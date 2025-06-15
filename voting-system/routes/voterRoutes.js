const express = require("express");
const router = express.Router();
const voterController = require("../controllers/voterController");

router.get("/", voterController.getAll);
router.get("/:id", voterController.getById);
router.post("/", voterController.create);
router.put("/:id", voterController.update);
router.delete("/:id", voterController.remove);

module.exports = router;
