const express = require("express");

const {
  getLogs,
  runCollector,
  getTargets,
  createTarget,
  toggleTarget,
  deleteTarget
} = require("../controllers/adminController");

const router = express.Router();

router.get("/collection-logs", getLogs);
router.post("/run-collector", runCollector);

router.get("/collection-targets", getTargets);
router.post("/collection-targets", createTarget);
router.patch("/collection-targets/:id/toggle", toggleTarget);
router.delete("/collection-targets/:id", deleteTarget);

module.exports = router;