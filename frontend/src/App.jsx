import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import "./App.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function App() {
  const [summary, setSummary] = useState(null);
  const [placeMetrics, setPlaceMetrics] = useState([]);
  const [stationArrivals, setStationArrivals] = useState([]);
  const [collectionLogs, setCollectionLogs] = useState([]);
  const [error, setError] = useState("");
  const [manualRunMessage, setManualRunMessage] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [collectionTargets, setCollectionTargets] = useState([]);
  const [newTarget, setNewTarget] = useState({
    type: "citydata",
    name: ""
  });

  async function fetchDashboardData() {
    try {
      const [summaryRes, placeRes, stationRes, logRes, targetRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/dashboard/summary`),
        axios.get(`${API_BASE_URL}/api/place-metrics/latest`),
        axios.get(`${API_BASE_URL}/api/station-arrivals/latest`),
        axios.get(`${API_BASE_URL}/api/admin/collection-logs`),
        axios.get(`${API_BASE_URL}/api/admin/collection-targets`)
      ]);

      setSummary(summaryRes.data);
      setPlaceMetrics(placeRes.data);
      setStationArrivals(stationRes.data);
      setCollectionLogs(logRes.data);
      setCollectionTargets(targetRes.data);
      setError("");
    } catch (err) {
      setError("대시보드 데이터를 불러오지 못했습니다.");
      console.error(err);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function handleManualRun() {
    try {
      setIsRunning(true);
      setManualRunMessage("");
      setError("");

      await axios.post(`${API_BASE_URL}/api/admin/run-collector`);

      setManualRunMessage("수동 수집이 완료되었습니다.");
      await fetchDashboardData();
    } catch (err) {
      setManualRunMessage("");
      setError("수동 수집 실행에 실패했습니다.");
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  }

  async function handleAddTarget(event) {
    event.preventDefault();

    if (!newTarget.name.trim()) {
      setError("수집 대상명을 입력해주세요.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/admin/collection-targets`, {
        type: newTarget.type,
        name: newTarget.name.trim()
      });

      setNewTarget({
        type: "citydata",
        name: ""
      });

      await fetchDashboardData();
    } catch (err) {
      setError("수집 대상 추가에 실패했습니다.");
      console.error(err);
    }
  }

  async function handleToggleTarget(id) {
    try {
      await axios.patch(`${API_BASE_URL}/api/admin/collection-targets/${id}/toggle`);
      await fetchDashboardData();
    } catch (err) {
      setError("수집 대상 상태 변경에 실패했습니다.");
      console.error(err);
    }
  }

  async function handleDeleteTarget(id) {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/collection-targets/${id}`);
      await fetchDashboardData();
    } catch (err) {
      setError("수집 대상 삭제에 실패했습니다.");
      console.error(err);
    }
  }

  const latestPlaceMetric = placeMetrics[0];
  const populationChartData = [...placeMetrics]
    .reverse()
    .map((metric) => ({
      time: new Date(metric.collectedAt).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit"
      }),
      populationMin: metric.populationMin,
      populationMax: metric.populationMax
    }));
  const responseTimeChartData = [...collectionLogs]
  .slice(0, 20)
  .reverse()
  .map((log) => ({
    label: `${log.targetName} ${new Date(log.collectedAt).toLocaleTimeString(
      "ko-KR",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    )}`,
    responseTimeMs: log.responseTimeMs,
    status: log.status
  }));
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">MetroInsight</p>
        <h1>서울 도시·교통 데이터 수집 대시보드</h1>
        <p>
          서울시 공공 API 데이터를 주기적으로 수집하고 MongoDB에 저장한 뒤,
          수집 현황과 최신 데이터를 시각화하는 운영형 웹서비스입니다.
        </p>

        <div className="hero-actions">
          <button onClick={handleManualRun} disabled={isRunning}>
            {isRunning ? "수집 실행 중..." : "수동 수집 실행"}
          </button>
          {manualRunMessage && <span>{manualRunMessage}</span>}
        </div>
      </section>

      {error && <p className="error">{error}</p>}

      {!summary && !error && <p className="loading">데이터를 불러오는 중...</p>}

      {summary && (
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
      )}

      <section className="content-grid">
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
      </section>
      <section className="panel chart-panel">
        <div className="panel-header">
          <h2>도시데이터 인구 추이</h2>
          <span>Population Trend</span>
        </div>

        {populationChartData.length > 0 ? (
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={populationChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="populationMin"
                  name="최소 인구"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="populationMax"
                  name="최대 인구"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p>차트로 표시할 도시데이터가 없습니다.</p>
        )}
      </section>
      <section className="panel chart-panel">
        <div className="panel-header">
          <h2>API 응답 시간 추이</h2>
          <span>Response Time Monitoring</span>
        </div>

        {responseTimeChartData.length > 0 ? (
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" hide />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="responseTimeMs"
                  name="응답 시간(ms)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p>응답 시간 차트로 표시할 로그가 없습니다.</p>
        )}
      </section>
      <section className="panel target-panel">
        <div className="panel-header">
          <h2>수집 대상 관리</h2>
          <span>Collection Targets</span>
        </div>

        <form className="target-form" onSubmit={handleAddTarget}>
          <select
            value={newTarget.type}
            onChange={(event) =>
              setNewTarget({
                ...newTarget,
                type: event.target.value
              })
            }
          >
            <option value="citydata">도시데이터</option>
            <option value="subway">지하철</option>
          </select>

          <input
            type="text"
            placeholder="예: 광화문·덕수궁 또는 강남"
            value={newTarget.name}
            onChange={(event) =>
              setNewTarget({
                ...newTarget,
                name: event.target.value
              })
            }
          />

          <button type="submit">추가</button>
        </form>

        {collectionTargets.length > 0 ? (
          <div className="target-list">
            {collectionTargets.map((target) => (
              <div className="target-item" key={target._id}>
                <div>
                  <strong>{target.name}</strong>
                  <span>{target.type}</span>
                </div>

                <span
                  className={`target-status ${
                    target.isActive ? "active" : "inactive"
                  }`}
                >
                  {target.isActive ? "활성" : "비활성"}
                </span>

                <div className="target-actions">
                  <button onClick={() => handleToggleTarget(target._id)}>
                    {target.isActive ? "비활성화" : "활성화"}
                  </button>
                  <button
                    className="danger-button"
                    onClick={() => handleDeleteTarget(target._id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>등록된 수집 대상이 없습니다.</p>
        )}
      </section>
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

      {summary && (
        <p className="updated-at">
          최근 수집 시각: {summary.latestCollectedAt || "정보 없음"}
        </p>
      )}
    </main>
  );
}

export default App;