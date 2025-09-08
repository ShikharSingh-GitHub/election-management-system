const pool = require("../config/db"); //Interaction with the DB, returns a reference to the "Pool" which has established a connection to the DB by Referencing it
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const { name, email, password, userType } = req.body;

  try {
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password, userType) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, userType]
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = users[0];

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

exports.updateEmail = async (req, res) => {
  const { userId } = req.params;
  const { email } = req.body;
  try {
    await pool.query("UPDATE users SET email = ? WHERE id = ?", [
      email,
      userId,
    ]);
    res.json({ message: "Email updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};
