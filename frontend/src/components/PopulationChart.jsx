import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function PopulationChart({ populationChartData }) {
  return (
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
  );
}

export default PopulationChart;