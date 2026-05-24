const {
  getLatestStationArrivals
} = require("../services/stationArrivalService");

async function getLatest(req, res) {
  try {
    const arrivals = await getLatestStationArrivals();

    res.json(arrivals);
  } catch (error) {
    res.status(500).json({
      message: "failed to get latest station arrivals",
      error: error.message
    });
  }
}

module.exports = {
  getLatest
};