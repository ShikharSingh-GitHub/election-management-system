import {
  Box,
  Button,
  Modal,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { login, signup } from "../services/authService";

function LandingPage() {
  const [open, setOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [userType, setUserType] = useState("voter");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const resetLogin = () => {
    setEmail("");
    setPassword("");
    setName("");
  };

  const handleOpen = (mode) => {
    setAuthMode(mode);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      if (authMode === "login") {
        const res = await login({ email, password });
        if (res.status === 200) {
          userType === "voter" ? navigate("/voter") : navigate("/committee");
        }
      } else {
        const res = await signup({ name, email, password, userType });
        if (res.status === 201) {
          alert("User created successfully");
          setOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Header
        onLoginClick={() => handleOpen("login")}
        onSignupClick={() => handleOpen("signup")}
      />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: 'url("/LandingPage Background.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 6,
        }}>
        {/* <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 3,
            maxWidth: 600,
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(2px)",
            textAlign: "center",
          }}>
          <Typography variant="h3" gutterBottom>
            Election Management System
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            A secure and transparent digital voting platform built to modernize
            the electoral process. Empowering voters and enabling real-time
            election management for committees.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => handleOpen("login")}>
              Login
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => handleOpen("signup")}>
              Signup
            </Button>
          </Box>
        </Paper> */}
      </Box>

      <Footer />

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            {authMode === "login" ? "Login" : "Signup"} as{" "}
            {userType === "voter" ? "Voter" : "Committee Member"}
          </Typography>
          <Tabs
            value={userType}
            onChange={(e, val) => setUserType(val)}
            aria-label="user type selector"
            sx={{ mb: 2 }}
            centered>
            <Tab label="Voter" value="voter" />
            <Tab label="Committee" value="committee" />
          </Tabs>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {authMode === "signup" && (
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={async () => {
              await handleSubmit();
              resetLogin();
            }}>
            {authMode === "login" ? "Login" : "Signup"}
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default LandingPage;
