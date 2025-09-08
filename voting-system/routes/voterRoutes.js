const express = require("express");
const router = express.Router();
const voterController = require("../controllers/voterController");

router.get("/", voterController.getAll);
router.post("/register", voterController.register);

router.get("/by-voter-id/:id", voterController.getByVoterId);
router.get("/by-user-id/:userId", voterController.getByUserId);
router.get("/by-user-id/:userId", voterController.getVoterByUserId);

router.post("/", voterController.create);
router.put("/:id", voterController.update);
router.delete("/:id", voterController.remove);

router.put("/update-address/:userId", voterController.updateAddress);

module.exports = router;
