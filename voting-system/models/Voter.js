const db = require("../config/db");

module.exports = {
  getAll: () => db.query("SELECT * FROM Voters"),
  getById: (id) => db.query("SELECT * FROM Voters WHERE VoterID = ?", [id]),
  create: (data) => db.query("INSERT INTO Voters SET ?", [data]),
  update: (id, data) =>
    db.query("UPDATE Voters SET ? WHERE VoterID = ?", [data, id]),
  remove: (id) => db.query("DELETE FROM Voters WHERE VoterID = ?", [id]),
};
