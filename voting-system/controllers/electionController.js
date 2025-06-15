const Election = require("../models/Election");

exports.getAllElections = async (req, res) => {
  try {
    const [rows] = await Election.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching elections", error: err });
  }
};

exports.getElectionById = async (req, res) => {
  try {
    const [rows] = await Election.getById(req.params.id);
    if (rows.length === 0)
      return res.status(404).json({ message: "Election not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching election", error: err });
  }
};

exports.createElection = async (req, res) => {
  try {
    const [result] = await Election.create(req.body);
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ message: "Error creating election", error: err });
  }
};

exports.updateElection = async (req, res) => {
  try {
    const [result] = await Election.update(req.params.id, req.body);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Election not found" });
    res.json({ message: "Election updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating election", error: err });
  }
};

exports.deleteElection = async (req, res) => {
  try {
    const [result] = await Election.remove(req.params.id);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Election not found" });
    res.json({ message: "Election deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting election", error: err });
  }
};
