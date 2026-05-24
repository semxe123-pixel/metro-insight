const {
  getLatestPlaceMetrics
} = require("../services/placeMetricService");

async function getLatest(req, res) {
  try {
    const metrics = await getLatestPlaceMetrics();

    res.json(metrics);
  } catch (error) {
    res.status(500).json({
      message: "failed to get latest place metrics",
      error: error.message
    });
  }
}

module.exports = {
  getLatest
};