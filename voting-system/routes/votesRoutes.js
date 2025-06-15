const express = require("express");
const router = express.Router();
const votesController = require("../controllers/votesController");

router.get("/", votesController.getAllVotes);
router.get("/:id", votesController.getVoteById);
router.post("/", votesController.createVote);
router.put("/:id", votesController.updateVote);
router.delete("/:id", votesController.deleteVote);

module.exports = router;
