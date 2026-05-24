const {
  getLatestPlaceMetricsFromDB
} = require("../repositories/placeMetricRepository");

async function getLatestPlaceMetrics() {
  const metrics = await getLatestPlaceMetricsFromDB(20);

  return metrics;
}

module.exports = {
  getLatestPlaceMetrics
};