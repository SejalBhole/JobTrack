const express = require("express");
const protect = require("../middleware/authMiddleware");
const { createApplication, getApplications, getApplicationById, updateApplication, deleteApplication} = require("../controllers/applicationController");
const validateObjectId = require("../middleware/validateObjectId");
const validateApplication = require("../middleware/validateApplication");


const router = express.Router();

router.post(
    "/",
    protect,
    validateApplication,
    createApplication
);

router.get("/", protect, getApplications);
router.get(
    "/:id",
    protect,
    validateObjectId,
    getApplicationById
);

router.put(
    "/:id",
    protect,
    validateObjectId,
    updateApplication
);

router.delete(
    "/:id",
    protect,
    validateObjectId,
    deleteApplication
);
module.exports = router;