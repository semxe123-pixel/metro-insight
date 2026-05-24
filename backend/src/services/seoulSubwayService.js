const axios = require("axios");

async function fetchSubwayArrivals(stationName) {
  const apiKey = process.env.SEOUL_SUBWAY_API_KEY;

  const encodedStationName = encodeURIComponent(stationName);

  const url = `http://swopenapi.seoul.go.kr/api/subway/${apiKey}/json/realtimeStationArrival/0/10/${encodedStationName}`;

  const response = await axios.get(url);

  return response.data;
}

module.exports = {
  fetchSubwayArrivals
};