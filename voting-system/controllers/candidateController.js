const Candidate = require("../models/Candidate");

exports.getAllCandidates = async (req, res) => {
  try {
    const [rows] = await Candidate.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching candidates", error: err });
  }
};

exports.getCandidateById = async (req, res) => {
  try {
    const [rows] = await Candidate.getById(req.params.id);
    if (rows.length === 0)
      return res.status(404).json({ message: "Candidate not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching candidate", error: err });
  }
};

exports.createCandidate = async (req, res) => {
  try {
    const [result] = await Candidate.create(req.body);
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ message: "Error creating candidate", error: err });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    const [result] = await Candidate.update(req.params.id, req.body);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Candidate not found" });
    res.json({ message: "Candidate updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating candidate", error: err });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const [result] = await Candidate.remove(req.params.id);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Candidate not found" });
    res.json({ message: "Candidate deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting candidate", error: err });
  }
};
