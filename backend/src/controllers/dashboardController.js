const { getDashboardSummary } = require("../services/dashboardService");

async function getSummary(req, res) {
  try {
    const summary = await getDashboardSummary();

    res.json(summary);
  } catch (error) {
    res.status(500).json({
      message: "failed to get dashboard summary",
      error: error.message
    });
  }
}

module.exports = {
  getSummary
};