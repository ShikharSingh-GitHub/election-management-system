const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");

router.get("/", candidateController.getAllCandidates);
router.get("/:id", candidateController.getCandidateById);
router.post("/", candidateController.createCandidate);
router.put("/:id", candidateController.updateCandidate);
router.delete("/:id", candidateController.deleteCandidate);

module.exports = router;
