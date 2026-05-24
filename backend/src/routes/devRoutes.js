const express = require("express");
const PlaceMetric = require("../models/PlaceMetric");
const StationArrival = require("../models/StationArrival");
const { fetchCityData } = require("../services/seoulCityDataService");
const { fetchSubwayArrivals } = require("../services/seoulSubwayService");
const router = express.Router();

router.post("/sample-place-metric", async (req, res) => {
  try {
    const metric = await PlaceMetric.create({
      placeName: "광화문·덕수궁",
      areaCode: "POI009",
      congestionLevel: "보통",
      populationMin: 12000,
      populationMax: 14000,
      temperature: 21.5,
      collectedAt: new Date(),
      rawPayload: {
        source: "sample",
        message: "This is sample data for MongoDB insert test"
      }
    });

    res.status(201).json({
      message: "sample place metric created",
      data: metric
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to create sample place metric",
      error: error.message
    });
  }
});

router.post("/collect-citydata", async (req, res) => {
  try {
    const placeName = "광화문·덕수궁";

    const rawData = await fetchCityData(placeName);

    const cityData = rawData.CITYDATA;
    const populationStatus = cityData?.LIVE_PPLTN_STTS?.[0];

    const metric = await PlaceMetric.create({
      placeName: cityData?.AREA_NM,
      areaCode: cityData?.AREA_CD,
      congestionLevel: populationStatus?.AREA_CONGEST_LVL,
      populationMin: Number(populationStatus?.AREA_PPLTN_MIN),
      populationMax: Number(populationStatus?.AREA_PPLTN_MAX),
      temperature: Number(cityData?.WEATHER_STTS?.[0]?.TEMP),
      collectedAt: new Date(),
      rawPayload: rawData
    });

    res.status(201).json({
      message: "city data collected and saved",
      data: metric
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to collect city data",
      error: error.message
    });
  }
});

router.post("/collect-subway-arrivals", async (req, res) => {
  try {
    const stationName = "강남";

    const rawData = await fetchSubwayArrivals(stationName);

    const arrivalList = rawData.realtimeArrivalList || [];

    const arrivals = arrivalList.map((item) => ({
      stationName: item.statnNm,
      subwayId: item.subwayId,
      direction: item.updnLine,
      trainLineName: item.trainLineNm,
      arrivalMessage: item.arvlMsg2,
      currentLocation: item.arvlMsg3,
      arrivalCode: item.arvlCd,
      remainingTimeSec:
        item.barvlDt !== undefined && item.barvlDt !== null
          ? Number(item.barvlDt)
          : null,
      trainNo: item.btrainNo,
      terminalStation: item.bstatnNm,
      receivedAt: item.recptnDt ? new Date(item.recptnDt) : null,
      collectedAt: new Date(),
      rawPayload: item
    }));

    const savedArrivals = await StationArrival.insertMany(arrivals);

    res.status(201).json({
      message: "subway arrivals collected and saved",
      count: savedArrivals.length,
      data: savedArrivals
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to collect subway arrivals",
      error: error.message
    });
  }
});

module.exports = router;
