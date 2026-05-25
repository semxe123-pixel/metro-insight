function SummaryCards({ summary }) {
  if (!summary) {
    return null;
  }

  return (
    <section className="summary-grid">
      <div className="summary-card">
        <span>도시데이터</span>
        <strong>{summary.totalPlaceMetrics}</strong>
        <p>저장 건수</p>
      </div>

      <div className="summary-card">
        <span>지하철 도착정보</span>
        <strong>{summary.totalStationArrivals}</strong>
        <p>저장 건수</p>
      </div>

      <div className="summary-card">
        <span>수집 성공</span>
        <strong>{summary.successLogs}</strong>
        <p>로그 수</p>
      </div>

      <div className="summary-card">
        <span>수집 실패</span>
        <strong>{summary.failedLogs}</strong>
        <p>로그 수</p>
      </div>

      <div className="summary-card">
        <span>최근 100회 성공률</span>
        <strong>{summary.recentSuccessRate}%</strong>
        <p>수집 안정성</p>
      </div>

      <div className="summary-card">
        <span>평균 응답 시간</span>
        <strong>{summary.averageResponseTimeMs}ms</strong>
        <p>최근 100회 기준</p>
      </div>

      <div className="summary-card">
        <span>최근 실패 수</span>
        <strong>{summary.recentFailedCount}</strong>
        <p>최근 100회 기준</p>
      </div>

      <div className="summary-card">
        <span>마지막 성공 수집</span>
        <strong className="small-text">
          {summary.latestSuccessAt
            ? new Date(summary.latestSuccessAt).toLocaleString("ko-KR")
            : "정보 없음"}
        </strong>
        <p>성공 로그 기준</p>
      </div>
    </section>
  );
}

export default SummaryCards;