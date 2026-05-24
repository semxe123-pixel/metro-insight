const express = require("express");
const { getLatest } = require("../controllers/placeMetricController");

const router = express.Router();

router.get("/latest", getLatest);

module.exports = router;