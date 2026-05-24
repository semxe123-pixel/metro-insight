const PlaceMetric = require("../models/PlaceMetric");
const StationArrival = require("../models/StationArrival");
const CollectionLog = require("../models/CollectionLog");

async function getDashboardSummaryFromDB() {
  const totalPlaceMetrics = await PlaceMetric.countDocuments();
  const totalStationArrivals = await StationArrival.countDocuments();
  const totalLogs = await CollectionLog.countDocuments();

  const successLogs = await CollectionLog.countDocuments({
    status: "success"
  });

  const failedLogs = await CollectionLog.countDocuments({
    status: "failed"
  });

  const latestLog = await CollectionLog.findOne()
    .sort({ collectedAt: -1 })
    .lean();

  return {
    totalPlaceMetrics,
    totalStationArrivals,
    totalLogs,
    successLogs,
    failedLogs,
    latestCollectedAt: latestLog?.collectedAt || null
  };
}

module.exports = {
  getDashboardSummaryFromDB
};