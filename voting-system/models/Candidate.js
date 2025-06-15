const db = require("../config/db");

module.exports = {
  getAll: () => db.query("SELECT * FROM Candidate"),
  getById: (id) =>
    db.query("SELECT * FROM Candidate WHERE CandidateID = ?", [id]),
  create: (data) => db.query("INSERT INTO Candidate SET ?", [data]),
  update: (id, data) =>
    db.query("UPDATE Candidate SET ? WHERE CandidateID = ?", [data, id]),
  remove: (id) => db.query("DELETE FROM Candidate WHERE CandidateID = ?", [id]),
};
