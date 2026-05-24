const {
  getCollectionLogsFromDB,
  getCollectionTargetsFromDB,
  createCollectionTargetInDB,
  findCollectionTargetById,
  deleteCollectionTargetFromDB
} = require("../repositories/adminRepository");

const { runCollectorOnce } = require("../jobs/collectorJob");

async function getCollectionLogs() {
  return getCollectionLogsFromDB(100);
}

async function runCollectorManually() {
  return runCollectorOnce();
}

async function getCollectionTargets() {
  return getCollectionTargetsFromDB();
}

async function createCollectionTarget({ type, name }) {
  if (!type || !name) {
    const error = new Error("type and name are required");
    error.statusCode = 400;
    throw error;
  }

  return createCollectionTargetInDB({
    type,
    name
  });
}

async function toggleCollectionTarget(id) {
  const target = await findCollectionTargetById(id);

  if (!target) {
    const error = new Error("collection target not found");
    error.statusCode = 404;
    throw error;
  }

  target.isActive = !target.isActive;
  await target.save();

  return target;
}

async function deleteCollectionTarget(id) {
  const target = await deleteCollectionTargetFromDB(id);

  if (!target) {
    const error = new Error("collection target not found");
    error.statusCode = 404;
    throw error;
  }

  return target;
}

module.exports = {
  getCollectionLogs,
  runCollectorManually,
  getCollectionTargets,
  createCollectionTarget,
  toggleCollectionTarget,
  deleteCollectionTarget
};