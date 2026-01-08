import { useState, useEffect } from "react";
import axiosInstance from "../../configs/axios-config.js";
import MapComponent from "../components/MapComponent.jsx";
import "./FacilityMapPage.css";
import { MAP, HOSPITAL, STYLE } from "../../configs/host-config.js";

const FacilityMapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("culture");
  const [showCultureSubCategories, setShowCultureSubCategories] =
    useState(false);
  const [selectedCultureSubCategory, setSelectedCultureSubCategory] =
    useState("12");
  const [selectedCultureRegion, setSelectedCultureRegion] = useState("1");
  const [cultureLocations, setCultureLocations] = useState([]);
  const [isCultureLoading, setIsCultureLoading] = useState(false);
  const [selectedCultureDetail, setSelectedCultureDetail] = useState(null);
  const [showHospitalRegion, setShowHospitalRegion] = useState(false);
  const [selectedHospitalRegion, setSelectedHospitalRegion] = useState("1");
  const [hospitalCategoryOptions, setHospitalCategoryOptions] = useState([]);
  const [selectedHospitalCategory, setSelectedHospitalCategory] = useState("");
  const [hospitalList, setHospitalList] = useState([]);
  const [isHospitalLoading, setIsHospitalLoading] = useState(false);
  const [selectedHospitalInfo, setSelectedHospitalInfo] = useState(null);
  const [showGroomingRegion, setShowGroomingRegion] = useState(false);
  const [selectedGroomingRegion, setSelectedGroomingRegion] = useState("1");
  const [groomingDistrictOptions, setGroomingDistrictOptions] = useState([]);
  const [selectedGroomingDistrict, setSelectedGroomingDistrict] = useState("");
  const [groomingList, setGroomingList] = useState([]);
  const [selectedGroomingDetail, setSelectedGroomingDetail] = useState(null);

  const cultureSubCategories = [
    { value: "12", name: "관광지" },
    { value: "14", name: "문화시설" },
    { value: "28", name: "레포츠" },
    { value: "32", name: "숙박" },
    { value: "38", name: "쇼핑" },
    { value: "39", name: "음식점" },
  ];

  const cultureRegionOptions = [
    { value: "1", label: "서울" },
    { value: "2", label: "인천" },
    { value: "3", label: "대전" },
    { value: "4", label: "대구" },
    { value: "5", label: "광주" },
    { value: "6", label: "부산" },
    { value: "7", label: "울산" },
    { value: "8", label: "세종" },
    { value: "31", label: "경기" },
    { value: "32", label: "강원" },
    { value: "33", label: "충북" },
    { value: "34", label: "충남" },
    { value: "35", label: "경북" },
    { value: "36", label: "경남" },
    { value: "37", label: "전북" },
    { value: "38", label: "전남" },
    { value: "39", label: "제주" },
  ];

  const hospitalRegionOptions = cultureRegionOptions;

  const categories = [
    { id: "culture", name: "반려동물 문화시설" },
    { id: "hospital", name: "동물병원" },
    { id: "style", name: "반려동물 미용실" },
    { id: "cafe", name: "반려동물 카페" },
    { id: "shop", name: "반려동물용품샵" },
    { id: "museum", name: "반려동물 박물관" },
    { id: "art", name: "미술관" },
    { id: "literary", name: "반려동물 문예시설" },
    { id: "drug", name: "반려동물 약국" },
  ];

  const groomingCategories = [
    "style",
    "cafe",
    "shop",
    "museum",
    "art",
    "literary",
    "drug",
  ];
  const isGroomingCategory = groomingCategories.includes(selectedCategory);

  // 미용실 지역 변경 시 리스트 요청
  useEffect(() => {
    if (isGroomingCategory) {
      setShowGroomingRegion(true);
      axiosInstance
        .get(
          `${STYLE}/region/list/${selectedGroomingRegion}/${selectedCategory}`
        )
        .then((res) => {
          const districts = res.data?.result || [];
          const sortedDistricts = districts.sort((a, b) =>
            a.localeCompare(b, "ko")
          );
          setGroomingDistrictOptions(sortedDistricts);
          setSelectedGroomingDistrict(sortedDistricts[0] || "");
        })
        .catch((err) => {
          setGroomingDistrictOptions([]);
          setSelectedGroomingDistrict("");
        });
    } else {
      setShowGroomingRegion(false);
      setGroomingDistrictOptions([]);
      setSelectedGroomingDistrict("");
    }
  }, [selectedCategory, selectedGroomingRegion, isGroomingCategory]);

  // 미용실 세부지역 변경 시 리스트 요청
  useEffect(() => {
    if (
      isGroomingCategory &&
      selectedGroomingRegion &&
      selectedGroomingDistrict
    ) {
      axiosInstance
        .get(
          `${STYLE}/list/${selectedGroomingRegion}/${selectedGroomingDistrict}/${selectedCategory}`
        )
        .then((res) => {
          const list = res.data?.result || [];
          setGroomingList(list);
        })
        .catch((err) => {
          setGroomingList([]);
        });
    }
  }, [
    selectedCategory,
    selectedGroomingRegion,
    selectedGroomingDistrict,
    isGroomingCategory,
  ]);

  // 문화시설 카테고리/지역 변경 시 POST 요청
  useEffect(() => {
    if (selectedCategory === "culture") {
      setIsCultureLoading(true);
      axiosInstance
        .post(`${MAP}/find`, {
          region: selectedCultureRegion,
          contentType: selectedCultureSubCategory,
        })
        .then((res) => {
          setCultureLocations(res.data?.result || res.data || []);
        })
        .catch((err) => {
          setCultureLocations([]);
        })
        .finally(() => setIsCultureLoading(false));
    }
  }, [selectedCategory, selectedCultureSubCategory, selectedCultureRegion]);

  // 동물병원 지역 변경 시 category 요청
  useEffect(() => {
    if (selectedCategory === "hospital") {
      axiosInstance
        .get(`${HOSPITAL}/category/${selectedHospitalRegion}`)
        .then((res) => {
          const categoryData = res.data?.result || res.data || [];
          const sortedCategoryData = categoryData.sort((a, b) =>
            a.localeCompare(b, "ko")
          );
          setHospitalCategoryOptions(sortedCategoryData);
          if (sortedCategoryData.length > 0) {
            setSelectedHospitalCategory(sortedCategoryData[0]);
          }
        })
        .catch((err) => {
          setHospitalCategoryOptions([]);
          setSelectedHospitalCategory("");
        });
    }
  }, [selectedCategory, selectedHospitalRegion]);

  // 동물병원 카테고리 변경 시 list 요청
  useEffect(() => {
    if (selectedCategory === "hospital" && selectedHospitalCategory) {
      setIsHospitalLoading(true);
      axiosInstance
        .get(
          `${HOSPITAL}/list/${selectedHospitalRegion}/${selectedHospitalCategory}`
        )
        .then((res) => {
          const hospitalData = Array.isArray(res.data?.result)
            ? res.data.result
            : [];
          setHospitalList(hospitalData);
        })
        .catch((err) => {
          setHospitalList([]);
        })
        .finally(() => setIsHospitalLoading(false));
    }
  }, [selectedCategory, selectedHospitalRegion, selectedHospitalCategory]);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedLocation(null);

    if (categoryId === "culture") {
      setShowCultureSubCategories(true);
      setShowHospitalRegion(false);
    } else if (categoryId === "hospital") {
      setShowHospitalRegion(true);
      setShowCultureSubCategories(false);
    } else {
      setShowCultureSubCategories(false);
      setShowHospitalRegion(false);
      setSelectedCultureSubCategory("12");
    }
  };

  const selectedCultureLabel = cultureSubCategories.find(
    (cat) => cat.value === selectedCultureSubCategory
  )?.name;

  const handleCultureLocationClick = async (location) => {
    setSelectedLocation(location);

    try {
      const res = await axiosInstance.get(`${MAP}/detail/${location.mapId}`);
      setSelectedCultureDetail(res.data?.result || res.data || null);
    } catch (err) {
      setSelectedCultureDetail(null);
    }
  };

  const handleHospitalLocationClick = async (hospital) => {
    setSelectedLocation(hospital);

    try {
      const res = await axiosInstance.get(
        `${HOSPITAL}/detail/${hospital.hospitalId}`
      );
      setSelectedHospitalInfo(res.data?.result || res.data || null);
    } catch (err) {
      setSelectedHospitalInfo(null);
    }
  };

  const handleGroomingCardClick = (shop) => {
    axiosInstance
      .get(`${STYLE}/detail/${selectedCategory}/${shop.id}`)
      .then((res) => {
        setSelectedGroomingDetail(res.data.result || null);
      })
      .catch((err) => {
        setSelectedGroomingDetail(null);
      });
  };

  const getMapLocations = () => {
    if (isGroomingCategory) {
      return [];
    } else if (selectedCategory === "culture") {
      return cultureLocations;
    } else if (selectedCategory === "hospital") {
      return (Array.isArray(hospitalList) ? hospitalList : []).map((h) => ({
        id: h.hospitalId,
        name: h.hospitalName,
        address: h.fullAddress,
        category: "hospital",
        lat: h.mapy,
        lng: h.mapx,
      }));
    }
    return [];
  };

  return (
    <div className="facility-map-page">
      <div className="facility-map-container">
        <div className="page-header">
          <h1 className="page-title">반려동물 관련 시설 정보</h1>
          <p className="page-subtitle">주변 시설을 지도에서 확인하세요</p>
        </div>

        {/* 필터 영역 (상단) */}
        <div className="filter-section">
          {/* 카테고리 선택 */}
          <div className="category-filter">
            <div className="category-buttons">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-button ${
                    selectedCategory === category.id ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* 지역 선택 (조건부 표시) */}
          <div className="region-filter">
            {/* 문화시설 하위 카테고리 */}
            {showCultureSubCategories && (
              <>
                <div className="sub-category-buttons">
                  {cultureSubCategories.map((subCategory) => (
                    <button
                      key={subCategory.value}
                      className={`sub-category-button ${
                        selectedCultureSubCategory === subCategory.value
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedCultureSubCategory(subCategory.value)
                      }
                    >
                      {subCategory.name}
                    </button>
                  ))}
                </div>
                <select
                  className="region-select"
                  value={selectedCultureRegion}
                  onChange={(e) => setSelectedCultureRegion(e.target.value)}
                >
                  {cultureRegionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* 동물병원 지역/카테고리 선택 */}
            {showHospitalRegion && (
              <>
                <select
                  className="region-select"
                  value={selectedHospitalRegion}
                  onChange={(e) => setSelectedHospitalRegion(e.target.value)}
                >
                  {hospitalRegionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {hospitalCategoryOptions.length > 0 && (
                  <select
                    className="region-select"
                    value={selectedHospitalCategory}
                    onChange={(e) =>
                      setSelectedHospitalCategory(e.target.value)
                    }
                  >
                    {hospitalCategoryOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}

            {/* 미용실 지역 선택 */}
            {showGroomingRegion && (
              <>
                <select
                  className="region-select"
                  value={selectedGroomingRegion}
                  onChange={(e) => setSelectedGroomingRegion(e.target.value)}
                >
                  {hospitalRegionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  className="region-select"
                  value={selectedGroomingDistrict}
                  onChange={(e) => setSelectedGroomingDistrict(e.target.value)}
                >
                  {groomingDistrictOptions.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>

        {/* 메인 콘텐츠 영역 (좌우 분할) */}
        <div className="main-content-wrapper">
          {/* 왼쪽: 아이템 목록 */}
          <div className="list-panel">
            {/* 문화시설 목록 */}
            {selectedCategory === "culture" && (
              <div className="list-section">
                <h3 className="list-title">
                  문화시설 목록 ({cultureLocations.length}개)
                </h3>
                {isCultureLoading ? (
                  <div className="loading-text">불러오는 중...</div>
                ) : cultureLocations.length === 0 ? (
                  <div className="empty-text">문화시설이 없습니다.</div>
                ) : (
                  <div className="card-list">
                    {cultureLocations
                      .filter((location) => location.addr || location.addr1)
                      .map((location) => (
                        <div
                          key={location.mapId || location.title}
                          className={`location-card ${
                            selectedLocation?.mapId === location.mapId
                              ? "active"
                              : ""
                          }`}
                          onClick={() => handleCultureLocationClick(location)}
                        >
                          <div className="card-content">
                            <h4 className="card-title">{location.title}</h4>
                            <span className="category-badge">
                              {selectedCultureLabel}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* 동물병원 목록 */}
            {selectedCategory === "hospital" && (
              <div className="list-section">
                <h3 className="list-title">
                  동물병원 목록 ({hospitalList.length}개)
                </h3>
                {isHospitalLoading ? (
                  <div className="loading-text">불러오는 중...</div>
                ) : hospitalList.length === 0 ? (
                  <div className="empty-text">동물병원이 없습니다.</div>
                ) : (
                  <div className="card-list">
                    {(Array.isArray(hospitalList) ? hospitalList : [])
                      .filter((hospital) => hospital.hospitalName)
                      .map((hospital) => (
                        <div
                          key={hospital.hospitalId}
                          className={`location-card ${
                            selectedLocation?.hospitalId === hospital.hospitalId
                              ? "active"
                              : ""
                          }`}
                          onClick={() => handleHospitalLocationClick(hospital)}
                        >
                          <div className="card-content">
                            <h4 className="card-title">
                              {hospital.hospitalName}
                            </h4>
                            <p className="card-address">
                              {hospital.fullAddress}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* 미용실 목록 */}
            {isGroomingCategory && (
              <div className="list-section">
                <h3 className="list-title">
                  {categories.find((cat) => cat.id === selectedCategory)
                    ?.name || "시설 목록"}{" "}
                  ({groomingList.length}개)
                </h3>
                {groomingList.length === 0 ? (
                  <div className="empty-text">
                    {categories.find((cat) => cat.id === selectedCategory)
                      ?.name || "시설"}{" "}
                    정보가 없습니다.
                  </div>
                ) : (
                  <div className="card-list">
                    {groomingList.map((shop) => (
                      <div
                        key={shop.id}
                        className={`location-card ${
                          selectedGroomingDetail &&
                          selectedGroomingDetail.id === shop.id
                            ? "active"
                            : ""
                        }`}
                        onClick={() => handleGroomingCardClick(shop)}
                      >
                        <div className="card-content">
                          <h4 className="card-title">{shop.facilityName}</h4>
                          <p className="card-address">{shop.fullAddress}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 오른쪽: 지도 영역 */}
          <div className="map-panel">
            <h3 className="map-title">위치 지도</h3>
            <div className="map-container">
              <MapComponent
                //key={selectedCategory}
                locations={getMapLocations()}
                selectedLocation={selectedLocation}
                onLocationClick={handleLocationClick}
                selectedCultureDetail={
                  selectedCategory === "culture" ? selectedCultureDetail : null
                }
                selectedHospitalInfo={
                  selectedCategory === "hospital" ? selectedHospitalInfo : null
                }
                selectedHospitalDetail={
                  selectedCategory === "hospital" ? selectedHospitalInfo : null
                }
                selectedCategory={selectedCategory}
                selectedGroomingDetail={selectedGroomingDetail}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityMapPage;
