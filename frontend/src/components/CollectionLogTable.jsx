function CollectionLogTable({ collectionLogs }) {
  return (
    <section className="panel log-panel">
      <div className="panel-header">
        <h2>수집 로그</h2>
        <span>Collection Logs</span>
      </div>

      {collectionLogs.length > 0 ? (
        <div className="log-table-wrapper">
          <table className="log-table">
            <thead>
              <tr>
                <th>작업명</th>
                <th>대상</th>
                <th>상태</th>
                <th>저장 건수</th>
                <th>응답 시간</th>
                <th>수집 시각</th>
              </tr>
            </thead>
            <tbody>
              {collectionLogs.slice(0, 10).map((log) => (
                <tr key={log._id}>
                  <td>{log.jobName}</td>
                  <td>{log.targetName}</td>
                  <td>
                    <span className={`status-badge ${log.status}`}>
                      {log.status}
                    </span>
                  </td>
                  <td>{log.savedCount}</td>
                  <td>{log.responseTimeMs}ms</td>
                  <td>{log.collectedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>수집 로그가 없습니다.</p>
      )}
    </section>
  );
}

export default CollectionLogTable;