const db = require("../config/db");

module.exports = {
  getAll: () => db.query("SELECT * FROM voters"),

  getByVoterId: (id) =>
    db.query("SELECT * FROM voters WHERE voterId = ?", [id]),

  getByUserId: (userId) =>
    db.query(
      `SELECT 
         v.voterId, u.id AS userId, u.name, u.email,
         v.voterCard, v.aadharID, v.dob, v.gender, v.nationality, 
         v.address, v.contactNumber, v.registered
       FROM users u
       LEFT JOIN voters v ON u.id = v.userId
       WHERE u.id = ?`,
      [userId]
    ),

  create: (data) => db.query("INSERT INTO voters SET ?", [data]),

  update: (id, data) =>
    db.query("UPDATE voters SET ? WHERE voterId = ?", [data, id]),

  remove: (id) => db.query("DELETE FROM voters WHERE voterId = ?", [id]),

  registerVoter: (data) =>
    db.query(
      `INSERT INTO voters 
        (userId, voterCard, gender, nationality, email, dob, registered, address, contactNumber, aadharID) 
       VALUES (?, ?, ?, ?, ?, ?, 'Yes', ?, ?, ?)`,
      [
        data.userId,
        data.voterCard,
        data.gender,
        data.nationality,
        data.email,
        data.dob,
        data.address,
        data.contactNumber,
        data.aadharID,
      ]
    ),

  updateAddress: (userId, address) =>
    db.query("UPDATE voters SET address = ? WHERE userId = ?", [
      address,
      userId,
    ]),
};
