import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Snackbar,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Receipt() {
  const navigate = useNavigate();
  const receiptRef = useRef();

  const [votes, setVotes] = useState([]);
  const [voterName, setVoterName] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const userId = localStorage.getItem("id");

    if (!userId) {
      setSnackbar({
        open: true,
        message: "User not found. Please login again.",
        type: "error",
      });
      navigate("/");
      return;
    }

    const fetchVoterDataAndVotes = async () => {
      try {
        // Step 1: Get voter info from userId
        const voterRes = await axios.get(`/api/voter/by-user-id/${userId}`);
        const voterId = voterRes.data.voterId;
        setVoterName(voterRes.data.name || "Voter");

        if (!voterId) throw new Error("Voter not found for this user");

        // Step 2: Get detailed votes for this voter
        const res = await axios.get(`/api/voting/receipt/${voterId}`);
        setVotes(res.data);
      } catch (err) {
        console.error("Failed to fetch receipt data", err);
        setSnackbar({
          open: true,
          message: "Failed to load voting receipt",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVoterDataAndVotes();
  }, []);

  const handleDownload = async () => {
    const canvas = await html2canvas(receiptRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("voting-receipt.pdf");
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" component="div">
            Voting Receipt
          </Typography>
          <Box>
            <Button color="inherit" onClick={() => navigate("/voter")}>
              Dashboard
            </Button>
            <Button color="inherit" onClick={() => navigate("/voting")}>
              Vote
            </Button>
            <Button color="inherit" onClick={() => navigate("/")}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Receipt */}
      <Box
        ref={receiptRef}
        sx={{
          p: 4,
          bgcolor: "#fdfdfd",
          fontFamily: "serif",
          border: "1px solid #ccc",
          maxWidth: 1000,
          m: "40px auto",
          boxShadow: 4,
          borderRadius: 2,
        }}>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{
            textTransform: "uppercase",
            borderBottom: "2px solid #000",
            pb: 1,
          }}>
          Government of India — Voting Receipt
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 4 }}>
          Voter Name: <strong>{voterName}</strong>
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <CircularProgress />
        ) : votes.length === 0 ? (
          <Typography>No votes found.</Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {votes.map((vote, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #bdbdbd",
                  backgroundColor: "#f1f8e9",
                }}>
                <Typography fontWeight="bold" fontSize={18}>
                  {vote.Name} ({vote.Party})
                </Typography>
                <Typography fontSize={14}>Location: {vote.Location}</Typography>
                <Typography fontSize={14}>
                  Election: {vote.electionType}
                </Typography>
                {vote.voteTime && (
                  <Typography
                    fontSize={13}
                    sx={{ fontStyle: "italic", mt: 0.5 }}>
                    Voted On: {new Date(vote.createdAt).toLocaleString()}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        <Button
          variant="contained"
          sx={{ mt: 4, display: "block", mx: "auto" }}
          onClick={handleDownload}
          disabled={votes.length === 0}>
          Download PDF
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
        <Alert
          severity={snackbar.type}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Receipt;
