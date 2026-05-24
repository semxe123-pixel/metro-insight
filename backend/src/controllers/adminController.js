const {
  getCollectionLogs,
  runCollectorManually,
  getCollectionTargets,
  createCollectionTarget,
  toggleCollectionTarget,
  deleteCollectionTarget
} = require("../services/adminService");

async function getLogs(req, res) {
  try {
    const logs = await getCollectionLogs();
    res.json(logs);
  } catch (error) {
    res.status(500).json({
      message: "failed to get collection logs",
      error: error.message
    });
  }
}

async function runCollector(req, res) {
  try {
    const result = await runCollectorManually();

    res.json({
      message: "collector executed manually",
      result
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to run collector manually",
      error: error.message
    });
  }
}

async function getTargets(req, res) {
  try {
    const targets = await getCollectionTargets();
    res.json(targets);
  } catch (error) {
    res.status(500).json({
      message: "failed to get collection targets",
      error: error.message
    });
  }
}

async function createTarget(req, res) {
  try {
    const target = await createCollectionTarget(req.body);

    res.status(201).json({
      message: "collection target created",
      data: target
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "failed to create collection target"
    });
  }
}

async function toggleTarget(req, res) {
  try {
    const target = await toggleCollectionTarget(req.params.id);

    res.json({
      message: "collection target status updated",
      data: target
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "failed to update collection target"
    });
  }
}

async function deleteTarget(req, res) {
  try {
    const target = await deleteCollectionTarget(req.params.id);

    res.json({
      message: "collection target deleted",
      data: target
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "failed to delete collection target"
    });
  }
}

module.exports = {
  getLogs,
  runCollector,
  getTargets,
  createTarget,
  toggleTarget,
  deleteTarget
};