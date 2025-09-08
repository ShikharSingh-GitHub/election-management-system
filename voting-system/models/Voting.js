const db = require("../config/db");

const Voting = {
  // Cast a vote
  castVote: (voterId, candidateId, electionType) => {
    const query = `
      INSERT INTO voting (voterId, candidateId, electionType)
      VALUES (?, ?, ?)
    `;
    return db.query(query, [voterId, candidateId, electionType]);
  },

  // Update vote count
  incrementVoteCount: (candidateId) => {
    const query = `
      UPDATE Candidate
      SET VoteCount = VoteCount + 1
      WHERE CandidateID = ?
    `;
    return db.query(query, [candidateId]);
  },

  // Get all votes of a voter (for voting page)
  getVotesByVoterId: (voterId) => {
    const query = `
      SELECT electionType, candidateId
      FROM voting
      WHERE voterId = ?
    `;
    return db.query(query, [voterId]);
  },

  // Get detailed vote info (for receipt)
  getVoteDetailsByVoterId: (voterId) => {
    const query = `
      SELECT c.Name, c.Party, c.Location, v.electionType, v.createdAt
      FROM voting v
      JOIN Candidate c ON v.candidateId = c.CandidateID
      WHERE v.voterId = ?
    `;
    return db.query(query, [voterId]);
  },

  // Check if already voted
  hasVoted: (voterId, electionType) => {
    const query = `
      SELECT * FROM voting
      WHERE voterId = ? AND electionType = ?
    `;
    return db.query(query, [voterId, electionType]);
  },
};

module.exports = Voting;
