const express = require("express");

const {
  startBrainGym,
  submitBrainGym,
  completeFocusForge,
  completeMindfulMinute,
} = require("../controllers/activityController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/brain-gym/start", authenticateToken, startBrainGym);
router.post("/brain-gym/submit", authenticateToken, submitBrainGym);
router.post("/focus-forge", authenticateToken, completeFocusForge);
router.post("/mindful-minute", authenticateToken, completeMindfulMinute);

module.exports = router;
