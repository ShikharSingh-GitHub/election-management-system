const express = require("express");
const router = express.Router();
const electionController = require("../controllers/electionController");

router.get("/", electionController.getAllElections);
router.get("/:id", electionController.getElectionById);
router.post("/", electionController.createElection);
router.put("/:id", electionController.updateElection);
router.delete("/:id", electionController.deleteElection);

module.exports = router;
