const mongoose = require("mongoose");

const placeMetricSchema = new mongoose.Schema(
  {
    placeName: {
      type: String,
      required: true
    },
    areaCode: {
      type: String
    },
    congestionLevel: {
      type: String
    },
    populationMin: {
      type: Number
    },
    populationMax: {
      type: Number
    },
    temperature: {
      type: Number
    },
    collectedAt: {
      type: Date,
      required: true
    },
    rawPayload: {
      type: Object
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("PlaceMetric", placeMetricSchema);