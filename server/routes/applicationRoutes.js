const express = require("express");
const protect = require("../middleware/authMiddleware");
const { createApplication, getApplications } = require("../controllers/applicationController");

const router = express.Router();

router.post("/", protect, createApplication);
router.get("/", protect, getApplications);

module.exports = router;