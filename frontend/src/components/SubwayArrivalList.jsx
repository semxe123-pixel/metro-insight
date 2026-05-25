function SubwayArrivalList({ stationArrivals }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>최근 지하철 도착정보</h2>
        <span>Subway Arrival</span>
      </div>

      {stationArrivals.length > 0 ? (
        <div className="arrival-list">
          {stationArrivals.slice(0, 6).map((arrival) => (
            <article className="arrival-card" key={arrival._id}>
              <div className="arrival-title">
                <strong>{arrival.stationName}</strong>
                <span>{arrival.direction}</span>
              </div>
              <p>{arrival.trainLineName}</p>
              <p className="arrival-message">{arrival.arrivalMessage}</p>
              <div className="arrival-meta">
                <span>현재 위치: {arrival.currentLocation}</span>
                <span>남은 시간: {arrival.remainingTimeSec}초</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p>현재 표시 가능한 지하철 도착정보가 없습니다.</p>
      )}
    </div>
  );
}

export default SubwayArrivalList;