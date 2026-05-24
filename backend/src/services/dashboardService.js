const {
  getDashboardSummaryFromDB
} = require("../repositories/dashboardRepository");

async function getDashboardSummary() {
  const summary = await getDashboardSummaryFromDB();

  return summary;
}

module.exports = {
  getDashboardSummary
};