// controllers/leaderboardController.js
const db = require("../config/db");

exports.getLeaderboard = async (req, res) => {
  const electionType = decodeURIComponent(req.params.electionType);
  try {
    const [rows] = await db.query(
      `SELECT Name, VoteCount 
       FROM Candidate 
       WHERE ElectionType = ? 
       ORDER BY VoteCount DESC`,
      [electionType]
    );
    res.json(rows);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
