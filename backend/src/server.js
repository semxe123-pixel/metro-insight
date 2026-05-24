const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");
const { startScheduler } = require("./jobs/scheduler");

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  startScheduler();

  app.listen(PORT, () => {
    console.log(`MetroInsight backend running on port ${PORT}`);
  });
});