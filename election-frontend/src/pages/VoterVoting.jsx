import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const elections = ["Rajya Sabha", "Lok Sabha", "Gram Panchayat"];

function VoterVoting() {
  const navigate = useNavigate();

  const [currentElection, setCurrentElection] = useState("Rajya Sabha");
  const [candidates, setCandidates] = useState([]);
  const [voterData, setVoterData] = useState(null);
  const [votesCast, setVotesCast] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const voterId = localStorage.getItem("id");

  useEffect(() => {
    async function init() {
      await fetchVoterData();
      await fetchVotes();
      await fetchCandidates();
    }
    init();
  }, []);

  useEffect(() => {
    // whenever election tab changes, fetch options
    fetchCandidates();
  }, [currentElection]);

  const fetchVoterData = async () => {
    try {
      const res = await axios.get(`/api/voters/by-user-id/${voterId}`);
      setVoterData(res.data);
    } catch {
      setVoterData({ unregistered: true });
    }
  };

  const fetchVotes = async () => {
    try {
      const res = await axios.get(`/api/voting/votes-by-voter/${voterId}`);
      const map = {};
      res.data.forEach((vote) => {
        map[vote.electionType] = vote.candidateId;
      });
      setVotesCast(map);
    } catch (err) {
      console.error("Error fetching votes:", err);
    }
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const encoded = encodeURIComponent(currentElection);
      const res = await axios.get(`/api/candidates/election/${encoded}`);
      setCandidates(res.data);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (candidate) => {
    if (votesCast[currentElection]) return; // safety
    if (!voterData || voterData.unregistered) {
      return setSnackbar({
        open: true,
        message: "You are not registered to vote.",
        type: "error",
      });
    }
    const age = getAge(voterData.dob);
    if (age < 18 || voterData.nationality.toLowerCase() !== "indian") {
      return setSnackbar({
        open: true,
        message: "Only Indian citizens 18+ can vote.",
        type: "error",
      });
    }
    try {
      await axios.post("/api/voting/vote", {
        voterId: voterData.voterId,
        candidateId: candidate.CandidateID,
        electionType: currentElection,
      });
      setVotesCast((prev) => ({
        ...prev,
        [currentElection]: candidate.CandidateID,
      }));
      setSnackbar({
        open: true,
        message: "Vote cast successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("Voting error:", err);
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message ||
          "Voting failed. Please refresh and try again.",
        type: "error",
      });
    }
  };

  const getAge = (dob) => {
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    if (
      now.getMonth() < birth.getMonth() ||
      (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleDragStart = (e, candidate) =>
    e.dataTransfer.setData("candidate", JSON.stringify(candidate));

  const handleDrop = (e) => {
    const candidate = JSON.parse(e.dataTransfer.getData("candidate"));
    handleVote(candidate);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Voting Panel</Typography>
          <Box>
            <Button color="inherit" onClick={() => navigate("/voter")}>
              Dashboard
            </Button>
            <Button color="inherit" onClick={() => navigate("/receipt")}>
              Receipt
            </Button>
            <Button color="inherit" onClick={() => navigate("/")}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Cast Your Vote
        </Typography>

        <Tabs
          value={currentElection}
          onChange={(e, val) => setCurrentElection(val)}
          sx={{ mb: 3 }}>
          {elections.map((el) => (
            <Tab label={el} key={el} value={el} />
          ))}
        </Tabs>

        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h6">
              Candidates for {currentElection}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                mb: 4,
              }}>
              {candidates.map((cand) => (
                <Box
                  key={cand.CandidateID}
                  draggable={!votesCast[currentElection]}
                  onDragStart={(e) => handleDragStart(e, cand)}
                  sx={{
                    width: 240,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#e0f7fa",
                    boxShadow: 3,
                    cursor: votesCast[currentElection] ? "not-allowed" : "grab",
                    opacity: votesCast[currentElection] ? 0.6 : 1,
                    userSelect: "none",
                  }}>
                  <Typography fontWeight="bold">{cand.Name}</Typography>
                  <Typography>Party: {cand.Party}</Typography>
                  <Typography>Location: {cand.Location}</Typography>
                </Box>
              ))}
            </Box>

            <Box
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              sx={{
                border: "2px dashed #1976d2",
                borderRadius: 3,
                height: 120,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#f0f8ff",
                color: "#1976d2",
                fontSize: "1.2rem",
              }}>
              {votesCast[currentElection]
                ? "Vote casted"
                : "Drag your selected candidate here"}
            </Box>
          </>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
          <Alert
            severity={snackbar.type}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}

export default VoterVoting;
