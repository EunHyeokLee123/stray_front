import { useEffect, useRef, useState } from "react";

const MapComponent = ({
  locations = [],
  selectedLocation,
  onLocationClick,
  selectedCultureDetail,
  selectedHospitalInfo,
  selectedHospitalDetail,
  selectedCategory,
  selectedGroomingDetail,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const AppKey = import.meta.env.VITE_KAKAO_MAP_API;

  // 카카오맵 API 로드
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setKakaoLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${AppKey}&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          setKakaoLoaded(true);
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!kakaoLoaded || !window.kakao || !window.kakao.maps) {
      return;
    }

    const kakao = window.kakao;

    // 지도 초기화
    const container = mapRef.current;
    if (!container) return;

    const options = {
      center: new kakao.maps.LatLng(37.5665, 126.978),
      level: 5,
    };

    const map = new kakao.maps.Map(container, options);
    mapInstanceRef.current = map;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 기존 인포윈도우 닫기
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
    }

    // 위치가 있으면 마커 추가
    if (locations && locations.length > 0) {
      locations.forEach((location) => {
        if (!location.lat || !location.lng) return;

        const position = new kakao.maps.LatLng(location.lat, location.lng);

        // 마커 생성
        const marker = new kakao.maps.Marker({
          position: position,
          map: map,
        });

        // 마커 클릭 이벤트
        kakao.maps.event.addListener(marker, "click", () => {
          if (onLocationClick) {
            onLocationClick(location);
          }
        });

        markersRef.current.push(marker);
      });

      // 모든 마커가 보이도록 지도 범위 조정
      if (locations.length > 0) {
        const bounds = new kakao.maps.LatLngBounds();
        locations.forEach((location) => {
          if (location.lat && location.lng) {
            bounds.extend(new kakao.maps.LatLng(location.lat, location.lng));
          }
        });
        map.setBounds(bounds);
      }
    }

    // 선택된 위치로 이동
    if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
      const position = new kakao.maps.LatLng(
        selectedLocation.lat,
        selectedLocation.lng
      );
      map.setCenter(position);
      map.setLevel(3);

      // 인포윈도우 표시
      let content = "";

      if (selectedCategory === "culture" && selectedCultureDetail) {
        content = `
          <div style="padding:10px;min-width:200px;">
            <h4 style="margin:0 0 5px 0;font-weight:bold;">${
              selectedCultureDetail.title || ""
            }</h4>
            <p style="margin:0;font-size:12px;color:#666;">${
              selectedCultureDetail.addr || selectedCultureDetail.addr1 || ""
            }</p>
            ${
              selectedCultureDetail.tel
                ? `<p style="margin:5px 0 0 0;font-size:12px;">전화: ${selectedCultureDetail.tel}</p>`
                : ""
            }
          </div>
        `;
      } else if (selectedCategory === "hospital" && selectedHospitalInfo) {
        content = `
          <div style="padding:10px;min-width:200px;">
            <h4 style="margin:0 0 5px 0;font-weight:bold;">${
              selectedHospitalInfo.hospitalName || ""
            }</h4>
            <p style="margin:0;font-size:12px;color:#666;">${
              selectedHospitalInfo.fullAddress || ""
            }</p>
            ${
              selectedHospitalInfo.phoneNumber
                ? `<p style="margin:5px 0 0 0;font-size:12px;">전화: ${selectedHospitalInfo.phoneNumber}</p>`
                : ""
            }
          </div>
        `;
      } else if (selectedGroomingDetail) {
        content = `
          <div style="padding:10px;min-width:200px;">
            <h4 style="margin:0 0 5px 0;font-weight:bold;">${
              selectedGroomingDetail.facilityName || ""
            }</h4>
            <p style="margin:0;font-size:12px;color:#666;">${
              selectedGroomingDetail.fullAddress || ""
            }</p>
            ${
              selectedGroomingDetail.phoneNumber
                ? `<p style="margin:5px 0 0 0;font-size:12px;">전화: ${selectedGroomingDetail.phoneNumber}</p>`
                : ""
            }
          </div>
        `;
      } else {
        content = `
          <div style="padding:10px;min-width:200px;">
            <h4 style="margin:0 0 5px 0;font-weight:bold;">${
              selectedLocation.name || ""
            }</h4>
            <p style="margin:0;font-size:12px;color:#666;">${
              selectedLocation.address || ""
            }</p>
          </div>
        `;
      }

      if (content) {
        const infoWindow = new kakao.maps.InfoWindow({
          content: content,
        });
        infoWindowRef.current = infoWindow;
        infoWindow.open(
          map,
          markersRef.current.find((m) => {
            const pos = m.getPosition();
            return (
              Math.abs(pos.getLat() - selectedLocation.lat) < 0.0001 &&
              Math.abs(pos.getLng() - selectedLocation.lng) < 0.0001
            );
          }) || null
        );
      }
    }
  }, [
    locations,
    selectedLocation,
    selectedCultureDetail,
    selectedHospitalInfo,
    selectedHospitalDetail,
    selectedCategory,
    selectedGroomingDetail,
    onLocationClick,
    kakaoLoaded,
  ]);

  if (!kakaoLoaded) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
          color: "#666",
        }}
      >
        지도를 불러오는 중...
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        zIndex: 1,
        isolation: "isolate",
      }}
    />
  );
};

export default MapComponent;
