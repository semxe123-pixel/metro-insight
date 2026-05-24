const StationArrival = require("../models/StationArrival");

async function getLatestStationArrivalsFromDB(limit = 30) {
  const arrivals = await StationArrival.find()
    .sort({ collectedAt: -1 })
    .limit(limit)
    .lean();

  return arrivals;
}

module.exports = {
  getLatestStationArrivalsFromDB
};