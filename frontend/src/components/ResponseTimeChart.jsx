import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function ResponseTimeChart({ responseTimeChartData }) {
  return (
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
  );
}

export default ResponseTimeChart;