const express = require("express");
const { getLatest } = require("../controllers/stationArrivalController");

const router = express.Router();

router.get("/latest", getLatest);

module.exports = router;