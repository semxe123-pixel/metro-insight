const StationArrival = require("../models/StationArrival");

async function getLatestStationArrivalsFromDB(limit = 30) {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  const arrivals = await StationArrival.find({
    collectedAt: {
      $gte: fifteenMinutesAgo
    },
    remainingTimeSec: {
      $lte: 1800
    }
  })
    .sort({ collectedAt: -1 })
    .limit(limit)
    .lean();

  return arrivals;
}

module.exports = {
  getLatestStationArrivalsFromDB
};