const axios = require("axios");

async function fetchCityData(placeName) {
  const apiKey = process.env.SEOUL_CITY_API_KEY;

  const encodedPlaceName = encodeURIComponent(placeName);

  const url = `http://openapi.seoul.go.kr:8088/${apiKey}/json/citydata/1/5/${encodedPlaceName}`;

  const response = await axios.get(url);

  return response.data;
}

module.exports = {
  fetchCityData
};