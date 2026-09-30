const express = require("express");

const {
  completeBrainGym,
  completeFocusForge,
  completeMindfulMinute,
} = require("../controllers/activityController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/brain-gym", authenticateToken, completeBrainGym);
router.post("/focus-forge", authenticateToken, completeFocusForge);
router.post("/mindful-minute", authenticateToken, completeMindfulMinute);
module.exports = router;
