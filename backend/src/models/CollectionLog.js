const mongoose = require("mongoose");

const collectionLogSchema = new mongoose.Schema(
  {
    jobName: {
      type: String,
      required: true
    },
    targetType: {
      type: String,
      enum: ["citydata", "subway"],
      required: true
    },
    targetName: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      required: true
    },
    savedCount: {
      type: Number,
      default: 0
    },
    responseTimeMs: {
      type: Number
    },
    errorMessage: {
      type: String
    },
    collectedAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("CollectionLog", collectionLogSchema);