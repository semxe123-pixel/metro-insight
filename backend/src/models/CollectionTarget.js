const mongoose = require("mongoose");

const collectionTargetSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["citydata", "subway"],
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("CollectionTarget", collectionTargetSchema);