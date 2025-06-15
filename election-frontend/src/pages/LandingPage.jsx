import {
  Box,
  Button,
  Modal,
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

  function resetLogin() {
    setEmail("");
    setPassword("");
    setName("");
  }
  const navigate = useNavigate();

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
          alert("user Created"); //It Blocks Javascript Code Execution as well
          setOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Header
        onLoginClick={() => handleOpen("login")}
        onSignupClick={() => handleOpen("signup")}
      />
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Welcome to Election Management System</h1>
        <p>Secure and Transparent Digital Voting</p>
      </main>
      <Footer />

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {authMode === "login" ? "Login" : "Signup"} as{" "}
            {userType === "voter" ? "Voter" : "Committee Member"}
          </Typography>
          <Tabs
            value={userType}
            onChange={(e, val) => setUserType(val)}
            aria-label="user type selector">
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
            onClick={async () => {
              await handleSubmit();
              resetLogin();
            }}
            fullWidth
            sx={{ mt: 2 }}>
            {authMode === "login" ? "Login" : "Signup"}
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default LandingPage;
