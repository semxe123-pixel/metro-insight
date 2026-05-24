const cron = require("node-cron");
const { runCollectorOnce } = require("./collectorJob");

function startScheduler() {
  cron.schedule("*/10 * * * *", async () => {
    try {
      console.log("Scheduled collector started");
      await runCollectorOnce();
      console.log("Scheduled collector finished");
    } catch (error) {
      console.error("Scheduled collector failed:", error.message);
    }
  });

  console.log("Scheduler started: every 10 minutes");
}

module.exports = {
  startScheduler
};