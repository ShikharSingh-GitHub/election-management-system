const db = require("../config/db");

module.exports = {
  getAll: () => db.query("SELECT * FROM Election"),
  getById: (id) =>
    db.query("SELECT * FROM Election WHERE ElectionID = ?", [id]),
  create: (data) => db.query("INSERT INTO Election SET ?", [data]),
  update: (id, data) =>
    db.query("UPDATE Election SET ? WHERE ElectionID = ?", [data, id]),
  remove: (id) => db.query("DELETE FROM Election WHERE ElectionID = ?", [id]),
};
