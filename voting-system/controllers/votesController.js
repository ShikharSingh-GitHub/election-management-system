const Vote = require("../models/Votes");

exports.getAllVotes = async (req, res) => {
  try {
    const [rows] = await Vote.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching votes", error: err });
  }
};

exports.getVoteById = async (req, res) => {
  try {
    const [rows] = await Vote.getById(req.params.id);
    if (rows.length === 0)
      return res.status(404).json({ message: "Vote not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vote", error: err });
  }
};

exports.createVote = async (req, res) => {
  try {
    const [result] = await Vote.create(req.body);
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ message: "Error creating vote", error: err });
  }
};

exports.updateVote = async (req, res) => {
  try {
    const [result] = await Vote.update(req.params.id, req.body);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Vote not found" });
    res.json({ message: "Vote updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating vote", error: err });
  }
};

exports.deleteVote = async (req, res) => {
  try {
    const [result] = await Vote.remove(req.params.id);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Vote not found" });
    res.json({ message: "Vote deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting vote", error: err });
  }
};
