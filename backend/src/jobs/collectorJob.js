const PlaceMetric = require("../models/PlaceMetric");
const StationArrival = require("../models/StationArrival");
const CollectionLog = require("../models/CollectionLog");
const CollectionTarget = require("../models/CollectionTarget");
const { fetchCityData } = require("../services/seoulCityDataService");
const { fetchSubwayArrivals } = require("../services/seoulSubwayService");

async function collectCityData(placeName = "광화문·덕수궁") {
  const startedAt = Date.now();

  try {
    const rawData = await fetchCityData(placeName);

    const cityData = rawData.CITYDATA;
    const populationStatus = cityData?.LIVE_PPLTN_STTS?.[0];

    const metric = await PlaceMetric.create({
      placeName: cityData?.AREA_NM || placeName,
      areaCode: cityData?.AREA_CD,
      congestionLevel: populationStatus?.AREA_CONGEST_LVL,
      populationMin: Number(populationStatus?.AREA_PPLTN_MIN),
      populationMax: Number(populationStatus?.AREA_PPLTN_MAX),
      temperature: Number(cityData?.WEATHER_STTS?.[0]?.TEMP),
      collectedAt: new Date(),
      rawPayload: rawData
    });

    await CollectionLog.create({
      jobName: "collect_citydata",
      targetType: "citydata",
      targetName: placeName,
      status: "success",
      savedCount: 1,
      responseTimeMs: Date.now() - startedAt,
      errorMessage: null,
      collectedAt: new Date()
    });

    return metric;
  } catch (error) {
    await CollectionLog.create({
      jobName: "collect_citydata",
      targetType: "citydata",
      targetName: placeName,
      status: "failed",
      savedCount: 0,
      responseTimeMs: Date.now() - startedAt,
      errorMessage: error.message,
      collectedAt: new Date()
    });

    throw error;
  }
}

async function collectSubwayArrivals(stationName = "강남") {
  const startedAt = Date.now();

  try {
    const rawData = await fetchSubwayArrivals(stationName);
    const arrivalList = rawData.realtimeArrivalList || [];

    const arrivals = arrivalList.map((item) => ({
      stationName: item.statnNm || stationName,
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

    const savedArrivals =
      arrivals.length > 0 ? await StationArrival.insertMany(arrivals) : [];

    await CollectionLog.create({
      jobName: "collect_subway_arrivals",
      targetType: "subway",
      targetName: stationName,
      status: "success",
      savedCount: savedArrivals.length,
      responseTimeMs: Date.now() - startedAt,
      errorMessage: null,
      collectedAt: new Date()
    });

    return savedArrivals;
  } catch (error) {
    await CollectionLog.create({
      jobName: "collect_subway_arrivals",
      targetType: "subway",
      targetName: stationName,
      status: "failed",
      savedCount: 0,
      responseTimeMs: Date.now() - startedAt,
      errorMessage: error.message,
      collectedAt: new Date()
    });

    throw error;
  }
}

async function runCollectorOnce() {
  console.log("Running collector job...");

  const targets = await CollectionTarget.find({
    isActive: true
  }).lean();

  if (targets.length === 0) {
    console.log("No active collection targets found");

    return {
      message: "no active collection targets",
      cityDataSaved: 0,
      subwayArrivalsSaved: 0
    };
  }

  let cityDataSaved = 0;
  let subwayArrivalsSaved = 0;

  for (const target of targets) {
    if (target.type === "citydata") {
      await collectCityData(target.name);
      cityDataSaved += 1;
    }

    if (target.type === "subway") {
      const arrivals = await collectSubwayArrivals(target.name);
      subwayArrivalsSaved += arrivals.length;
    }
  }

  console.log("Collector job completed");

  return {
    targetCount: targets.length,
    cityDataSaved,
    subwayArrivalsSaved
  };
}

module.exports = {
  collectCityData,
  collectSubwayArrivals,
  runCollectorOnce
};