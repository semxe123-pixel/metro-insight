const PlaceMetric = require("../models/PlaceMetric");

async function getLatestPlaceMetricsFromDB(limit = 20) {
  const metrics = await PlaceMetric.find()
    .sort({ collectedAt: -1 })
    .limit(limit)
    .lean();

  return metrics;
}

module.exports = {
  getLatestPlaceMetricsFromDB
};