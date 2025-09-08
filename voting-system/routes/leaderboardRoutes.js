// routes/leaderboardRoutes.js
const express = require("express");
const router = express.Router();
const leaderboardController = require("../controllers/leaderboardController");

router.get("/leaderboard/:electionType", leaderboardController.getLeaderboard);
module.exports = router;
