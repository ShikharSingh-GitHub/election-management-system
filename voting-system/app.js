const express = require("express");
const app = express();
require("dotenv").config();
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const voterRoutes = require("./routes/voterRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const electionRoutes = require("./routes/electionRoutes");
const votesRoutes = require("./routes/votesRoutes");
const authRoutes = require("./routes/authRoutes");
const votingRoutes = require("./routes/votingRoutes");
const swaggerDocument = YAML.load("./docs/swagger.yaml");

app.use(express.json());
app.use("/api", leaderboardRoutes);
app.use("/api/voter", voterRoutes);
app.use("/api/voters", voterRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/votes", votesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/voting", votingRoutes);
// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
