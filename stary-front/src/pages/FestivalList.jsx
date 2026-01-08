import { useState, useEffect } from "react";
import axiosInstance from "../../configs/axios-config.js";
import "./FestivalList.css";
import { FESTIVAL } from "../../configs/host-config.js";

const FestivalList = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [_totalElements, setTotalElements] = useState(0);

  // 상세 조회 상태
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [detailData, setDetailData] = useState(null);

  // 행사 목록 조회 함수
  const fetchFestivals = async (page = 0) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`${FESTIVAL}/list/${page}`);

      console.log(response);

      const data = response.data;

      // API 응답 형식에 맞게 데이터 추출
      const resultData = data.result || data;
      setFestivals(resultData.content || resultData.data || resultData || []);

      if (resultData.pageable) {
        setCurrentPage(resultData.pageable.pageNumber);
      }
      setTotalPages(resultData.totalPages || 0);
      setTotalElements(resultData.totalElements || 0);
    } catch (err) {
      console.error("행사 목록 조회 실패:", err);
      setError("행사 정보를 불러오는데 실패했습니다.");
      setFestivals([]);
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경 함수
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchFestivals(page);
  };

  // 상세 조회 함수
  const fetchDetail = async (festivalId) => {
    if (!festivalId) return;
    setDetailLoading(true);
    setDetailError(null);
    try {
      const res = await axiosInstance.get(`${FESTIVAL}/detail/${festivalId}`);
      console.log(res);
      const data = res.data?.result || res.data;
      setDetailData(data);
    } catch (err) {
      console.error("상세 조회 실패:", err);
      setDetailError("상세 정보를 불러오지 못했습니다.");
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setDetailData(null);
    setDetailError(null);
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchFestivals(0);
  }, []);

  return (
    <div className="festival-list-page">
      <div className="festival-container">
        <div className="page-header">
          <h1 className="page-title">반려동물 행사정보</h1>
          <p className="page-subtitle">다양한 반려동물 행사를 만나보세요</p>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="loading-container">
            <div className="loader"></div>
            <p className="loading-text">행사 정보를 불러오는 중...</p>
          </div>
        )}

        {/* 에러 상태 */}
        {error && !loading && (
          <div className="error-container">
            <p className="error-text">{error}</p>
            <button
              className="retry-button"
              onClick={() => fetchFestivals(currentPage)}
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 데이터가 없을 때 */}
        {!loading && !error && festivals.length === 0 && (
          <div className="empty-container">
            <p className="empty-text">등록된 행사가 없습니다.</p>
          </div>
        )}

        {/* 행사 목록 */}
        {!loading && !error && festivals.length > 0 && (
          <>
            <div className="festival-list">
              {festivals.map((festival, index) => (
                <div
                  key={festival.festivalId || index}
                  className="festival-card"
                  onClick={() => fetchDetail(festival.festivalId)}
                >
                  <div className="festival-card-content">
                    <h3 className="festival-title">
                      {festival.title || "행사 제목"}
                    </h3>
                    <div className="festival-info-row">
                      <span className="festival-info-item">
                        <span className="info-label">위치:</span>
                        <span className="info-value">
                          {festival.location || "-"}
                        </span>
                      </span>
                      <span className="festival-info-item">
                        <span className="info-label">행사일:</span>
                        <span className="info-value">
                          {festival.festivalDate || "-"}
                        </span>
                      </span>
                      <span className="festival-info-item">
                        <span className="info-label">주소:</span>
                        <span className="info-value">
                          {festival.addr || "-"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이징 */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  이전
                </button>

                <div className="pagination-numbers">
                  {(() => {
                    const maxVisiblePages = 7;
                    const startPage = Math.max(
                      0,
                      currentPage - Math.floor(maxVisiblePages / 2)
                    );
                    const endPage = Math.min(
                      totalPages - 1,
                      startPage + maxVisiblePages - 1
                    );

                    return (
                      <>
                        {/* 첫 페이지가 보이지 않을 때만 표시 */}
                        {startPage > 0 && (
                          <>
                            <button
                              className="pagination-number"
                              onClick={() => handlePageChange(0)}
                            >
                              1
                            </button>
                            {startPage > 1 && (
                              <span className="pagination-ellipsis">...</span>
                            )}
                          </>
                        )}

                        {/* 현재 페이지 범위 */}
                        {Array.from(
                          { length: endPage - startPage + 1 },
                          (_, i) => startPage + i
                        ).map((page) => (
                          <button
                            key={page}
                            className={`pagination-number ${
                              currentPage === page ? "active" : ""
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page + 1}
                          </button>
                        ))}

                        {/* 마지막 페이지가 보이지 않을 때만 표시 */}
                        {endPage < totalPages - 1 && (
                          <>
                            {endPage < totalPages - 2 && (
                              <span className="pagination-ellipsis">...</span>
                            )}
                            <button
                              className="pagination-number"
                              onClick={() => handlePageChange(totalPages - 1)}
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>

                <button
                  className="pagination-button"
                  onClick={() =>
                    handlePageChange(Math.min(totalPages - 1, currentPage + 1))
                  }
                  disabled={currentPage === totalPages - 1}
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}

        {/* 상세 모달 */}
        {(detailData || detailLoading || detailError) && (
          <div className="detail-modal-backdrop" onClick={closeDetail}>
            <div
              className="detail-modal"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {detailLoading && (
                <div className="detail-loading">
                  <div className="loader"></div>
                  <p className="loading-text">상세 정보를 불러오는 중...</p>
                </div>
              )}

              {detailError && !detailLoading && (
                <div className="detail-error">
                  <p className="error-text">{detailError}</p>
                  <button className="retry-button" onClick={closeDetail}>
                    닫기
                  </button>
                </div>
              )}

              {detailData && !detailLoading && !detailError && (
                <>
                  <div className="detail-header">
                    <h2 className="detail-title">
                      {detailData.title || "행사 상세"}
                    </h2>
                    <button className="detail-close" onClick={closeDetail}>
                      ×
                    </button>
                  </div>

                  <div className="detail-content">
                    {detailData.imagePath && (
                      <div className="detail-image-container">
                        <img
                          src={detailData.imagePath}
                          alt={detailData.title || "행사 이미지"}
                          className="detail-image"
                          onError={(e) => {
                            e.target.src = "/logo.png";
                          }}
                        />
                      </div>
                    )}

                    <div className="detail-info-grid">
                      <div className="detail-info-row">
                        <span className="detail-label">위치:</span>
                        <span className="detail-value">
                          {detailData.location || "-"}
                        </span>
                      </div>
                      <div className="detail-info-row">
                        <span className="detail-label">행사일:</span>
                        <span className="detail-value">
                          {detailData.festivalDate || "-"}
                        </span>
                      </div>
                      <div className="detail-info-row">
                        <span className="detail-label">진행시간:</span>
                        <span className="detail-value">
                          {detailData.festivalTime || "-"}
                        </span>
                      </div>
                      <div className="detail-info-row">
                        <span className="detail-label">행사요금:</span>
                        <span className="detail-value">
                          {detailData.money || "-"}
                        </span>
                      </div>
                      <div className="detail-info-row">
                        <span className="detail-label">예약일:</span>
                        <span className="detail-value">
                          {detailData.reservationDate || "-"}
                        </span>
                      </div>
                      <div className="detail-info-row">
                        <span className="detail-label">주소:</span>
                        <span className="detail-value">
                          {detailData.addr || "-"}
                        </span>
                      </div>
                    </div>

                    {detailData.url && (
                      <div className="detail-footer">
                        <button
                          className="homepage-button"
                          onClick={() => {
                            window.open(detailData.url, "_blank");
                          }}
                        >
                          홈페이지보기
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FestivalList;
