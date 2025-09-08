const db = require("../config/db");
const Voting = require("../models/Voting");

// Cast a vote
exports.castVote = async (req, res) => {
  const { voterId, candidateId, electionType } = req.body;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    await connection.query(
      `INSERT INTO voting (voterId, candidateId, electionType) VALUES (?, ?, ?)`,
      [voterId, candidateId, electionType]
    );

    await connection.query(
      `UPDATE Candidate SET VoteCount = VoteCount + 1 WHERE CandidateID = ?`,
      [candidateId]
    );

    await connection.commit();
    res.status(201).json({ message: "Vote cast successfully" });
  } catch (err) {
    await connection.rollback();
    console.error("Error casting vote:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ message: "You have already voted in this election." });
    }
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

// Get votes by voter ID for voting page
exports.getVotesByVoter = async (req, res) => {
  const { voterId } = req.params;

  try {
    const [rows] = await Voting.getVotesByVoterId(voterId);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching votes:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// Get detailed votes for receipt
exports.getReceiptByVoterId = async (req, res) => {
  const { voterId } = req.params;

  try {
    const [rows] = await Voting.getVoteDetailsByVoterId(voterId);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching receipt data:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
