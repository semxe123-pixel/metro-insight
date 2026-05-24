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

  const recentLogs = await CollectionLog.find()
    .sort({ collectedAt: -1 })
    .limit(100)
    .lean();

  const recentSuccessCount = recentLogs.filter(
    (log) => log.status === "success"
  ).length;

  const recentFailedCount = recentLogs.filter(
    (log) => log.status === "failed"
  ).length;

  const recentSuccessRate =
    recentLogs.length > 0
      ? Math.round((recentSuccessCount / recentLogs.length) * 1000) / 10
      : 0;

  const logsWithResponseTime = recentLogs.filter(
    (log) => typeof log.responseTimeMs === "number"
  );

  const averageResponseTimeMs =
    logsWithResponseTime.length > 0
      ? Math.round(
          logsWithResponseTime.reduce(
            (sum, log) => sum + log.responseTimeMs,
            0
          ) / logsWithResponseTime.length
        )
      : 0;

  const latestSuccessLog = await CollectionLog.findOne({
    status: "success"
  })
    .sort({ collectedAt: -1 })
    .lean();

  return {
    totalPlaceMetrics,
    totalStationArrivals,
    totalLogs,
    successLogs,
    failedLogs,
    latestCollectedAt: latestLog?.collectedAt || null,

    recentSuccessRate,
    averageResponseTimeMs,
    recentFailedCount,
    latestSuccessAt: latestSuccessLog?.collectedAt || null
  };
}

module.exports = {
  getDashboardSummaryFromDB
};