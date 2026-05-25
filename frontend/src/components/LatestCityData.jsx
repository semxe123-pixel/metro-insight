function LatestCityData({ latestPlaceMetric }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>최신 도시데이터</h2>
        <span>City Data</span>
      </div>

      {latestPlaceMetric ? (
        <div className="metric-list">
          <div>
            <span>장소명</span>
            <strong>{latestPlaceMetric.placeName}</strong>
          </div>
          <div>
            <span>장소 코드</span>
            <strong>{latestPlaceMetric.areaCode}</strong>
          </div>
          <div>
            <span>혼잡도</span>
            <strong>{latestPlaceMetric.congestionLevel || "정보 없음"}</strong>
          </div>
          <div>
            <span>최소 인구</span>
            <strong>{latestPlaceMetric.populationMin ?? "정보 없음"}</strong>
          </div>
          <div>
            <span>최대 인구</span>
            <strong>{latestPlaceMetric.populationMax ?? "정보 없음"}</strong>
          </div>
          <div>
            <span>기온</span>
            <strong>
              {latestPlaceMetric.temperature
                ? `${latestPlaceMetric.temperature}℃`
                : "정보 없음"}
            </strong>
          </div>
          <div>
            <span>수집 시각</span>
            <strong>{latestPlaceMetric.collectedAt}</strong>
          </div>
        </div>
      ) : (
        <p>도시데이터가 없습니다.</p>
      )}
    </div>
  );
}

export default LatestCityData;