require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();
app.use(express.json());


app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

connectDB();



app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "JobTrack API is running"
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});