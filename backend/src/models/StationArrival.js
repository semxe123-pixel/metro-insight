const mongoose = require("mongoose");

const stationArrivalSchema = new mongoose.Schema(
  {
    stationName: {
      type: String,
      required: true
    },
    subwayId: {
      type: String
    },
    direction: {
      type: String
    },
    trainLineName: {
      type: String
    },
    arrivalMessage: {
      type: String
    },
    currentLocation: {
      type: String
    },
    arrivalCode: {
      type: String
    },
    remainingTimeSec: {
      type: Number
    },
    trainNo: {
      type: String
    },
    terminalStation: {
      type: String
    },
    receivedAt: {
      type: Date
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

module.exports = mongoose.model("StationArrival", stationArrivalSchema);