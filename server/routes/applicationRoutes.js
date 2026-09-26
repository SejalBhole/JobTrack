const express = require("express");
const protect = require("../middleware/authMiddleware");
const { createApplication, getApplications, getApplicationById, updateApplication} = require("../controllers/applicationController");

const router = express.Router();

router.post("/", protect, createApplication);
router.get("/", protect, getApplications);
router.get("/:id", protect, getApplicationById);
router.put("/:id", protect, updateApplication);

module.exports = router;