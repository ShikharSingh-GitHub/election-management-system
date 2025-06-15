const db = require("../config/db");

module.exports = {
  getAll: () => db.query("SELECT * FROM Votes"),
  getById: (id) => db.query("SELECT * FROM Votes WHERE VID = ?", [id]),
  create: (data) => db.query("INSERT INTO Votes SET ?", [data]),
  update: (id, data) =>
    db.query("UPDATE Votes SET ? WHERE VID = ?", [data, id]),
  remove: (id) => db.query("DELETE FROM Votes WHERE VID = ?", [id]),
};
