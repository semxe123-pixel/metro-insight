const {
  getLatestStationArrivalsFromDB
} = require("../repositories/stationArrivalRepository");

async function getLatestStationArrivals() {
  const arrivals = await getLatestStationArrivalsFromDB(30);

  return arrivals;
}

module.exports = {
  getLatestStationArrivals
};