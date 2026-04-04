const express = require("express");
const cors = require("cors");
const { startMeterJob } = require("./src/jobs/meterJob");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "WattLedger running" });
});

// API routes
app.use("/", require("./src/routes/api"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  startMeterJob();
});