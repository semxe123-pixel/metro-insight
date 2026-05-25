import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

import HeroSection from "./components/HeroSection";
import SummaryCards from "./components/SummaryCards";
import LatestCityData from "./components/LatestCityData";
import SubwayArrivalList from "./components/SubwayArrivalList";
import PopulationChart from "./components/PopulationChart";
import ResponseTimeChart from "./components/ResponseTimeChart";
import CollectionTargetManager from "./components/CollectionTargetManager";
import CollectionLogTable from "./components/CollectionLogTable";

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
      <HeroSection
        onManualRun={handleManualRun}
        isRunning={isRunning}
        manualRunMessage={manualRunMessage}
      />

      {error && <p className="error">{error}</p>}

      {!summary && !error && <p className="loading">데이터를 불러오는 중...</p>}

      <SummaryCards summary={summary} />
      <section className="content-grid">
        <LatestCityData latestPlaceMetric={latestPlaceMetric} />
        <SubwayArrivalList stationArrivals={stationArrivals} />
      </section>
      <PopulationChart populationChartData={populationChartData} />
      <ResponseTimeChart responseTimeChartData={responseTimeChartData} />
      <CollectionTargetManager
        collectionTargets={collectionTargets}
        newTarget={newTarget}
        setNewTarget={setNewTarget}
        onAddTarget={handleAddTarget}
        onToggleTarget={handleToggleTarget}
        onDeleteTarget={handleDeleteTarget}
      />
      <CollectionLogTable collectionLogs={collectionLogs} />

      {summary && (
        <p className="updated-at">
          최근 수집 시각: {summary.latestCollectedAt || "정보 없음"}
        </p>
      )}
    </main>
  );
}

export default App;