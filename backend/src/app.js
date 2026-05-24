const express = require("express");
const cors = require("cors");

const devRoutes = require("./routes/devRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const placeMetricRoutes = require("./routes/placeMetricRoutes");
const stationArrivalRoutes = require("./routes/stationArrivalRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "metro-insight"
  });
});

app.use("/api/dev", devRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/place-metrics", placeMetricRoutes);
app.use("/api/station-arrivals", stationArrivalRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;