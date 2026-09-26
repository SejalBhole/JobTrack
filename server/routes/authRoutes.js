const express = require("express");
const {registerUser, loginUser} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser); 
router.get("/profile", protect, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "You are authenticated",
        userId: req.user
    });
});
module.exports = router;