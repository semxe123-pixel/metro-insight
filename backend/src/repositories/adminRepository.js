const CollectionLog = require("../models/CollectionLog");
const CollectionTarget = require("../models/CollectionTarget");

async function getCollectionLogsFromDB(limit = 100) {
  return CollectionLog.find()
    .sort({ collectedAt: -1 })
    .limit(limit)
    .lean();
}

async function getCollectionTargetsFromDB() {
  return CollectionTarget.find()
    .sort({ createdAt: -1 })
    .lean();
}

async function createCollectionTargetInDB({ type, name }) {
  return CollectionTarget.create({
    type,
    name,
    isActive: true
  });
}

async function findCollectionTargetById(id) {
  return CollectionTarget.findById(id);
}

async function deleteCollectionTargetFromDB(id) {
  return CollectionTarget.findByIdAndDelete(id);
}

module.exports = {
  getCollectionLogsFromDB,
  getCollectionTargetsFromDB,
  createCollectionTargetInDB,
  findCollectionTargetById,
  deleteCollectionTargetFromDB
};