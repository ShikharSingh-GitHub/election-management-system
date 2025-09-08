const express = require("express");
const router = express.Router();
const votingController = require("../controllers/votingController");

// POST route to cast a vote
router.post("/vote", votingController.castVote);

// GET route to check which votes a user has cast
router.get("/votes-by-voter/:voterId", votingController.getVotesByVoter);

// GET route to fetch voting receipt (detailed candidate info per election)
router.get("/receipt/:voterId", votingController.getReceiptByVoterId);

module.exports = router;
