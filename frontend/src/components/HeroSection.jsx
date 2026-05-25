function HeroSection({
  onManualRun,
  isRunning,
  manualRunMessage
}) {
  return (
    <section className="hero">
      <p className="eyebrow">MetroInsight</p>
      <h1>서울 도시·교통 데이터 수집 대시보드</h1>
      <p>
        서울시 공공 API 데이터를 주기적으로 수집하고 MongoDB에 저장한 뒤,
        수집 현황과 최신 데이터를 시각화하는 운영형 웹서비스입니다.
      </p>

      <div className="hero-actions">
        <button onClick={onManualRun} disabled={isRunning}>
          {isRunning ? "수집 실행 중..." : "수동 수집 실행"}
        </button>
        {manualRunMessage && <span>{manualRunMessage}</span>}
      </div>
    </section>
  );
}

export default HeroSection;