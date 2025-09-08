const Voter = require("../models/Voter");

// Register a voter
exports.register = async (req, res) => {
  try {
    const data = req.body;
    const requiredFields = [
      "userId",
      "email",
      "voterCard",
      "aadharID",
      "gender",
      "nationality",
      "dob",
      "address",
      "contactNumber",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({ message: `Missing field: ${field}` });
      }
    }

    await Voter.registerVoter(data);
    res.status(201).json({ message: "Voter registered successfully" });
  } catch (err) {
    console.error("Registration failed:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// Get all voters
exports.getAll = async (req, res) => {
  try {
    const [rows] = await Voter.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get voter by voterId (primary key)
exports.getByVoterId = async (req, res) => {
  try {
    const [rows] = await Voter.getByVoterId(req.params.id);
    if (rows.length === 0)
      return res.status(404).json({ error: "Voter not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get voter by userId (custom query)
exports.getByUserId = async (req, res) => {
  try {
    const [rows] = await Voter.getByUserId(req.params.userId);
    if (rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    const result = {
      ...rows[0],
      registered: rows[0].registered || "No",
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create voter (generic)
exports.create = async (req, res) => {
  try {
    const [result] = await Voter.create(req.body);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update voter by voterId
exports.update = async (req, res) => {
  try {
    await Voter.update(req.params.id, req.body);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete voter
exports.remove = async (req, res) => {
  try {
    await Voter.remove(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  const { userId } = req.params;
  const { address } = req.body;
  try {
    await Voter.updateAddress(userId, address);
    res.json({ message: "Address updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVoterByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM Voters WHERE userId = ?", [
      userId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Voter not found" });
    }

    res.status(200).json(rows[0]); // return only one voter
  } catch (err) {
    console.error("Error fetching voter:", err);
    res.status(500).json({ error: err.message });
  }
};
