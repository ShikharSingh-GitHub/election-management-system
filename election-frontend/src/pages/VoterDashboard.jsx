import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { logout } from "../services/authService";

function VoterDashboard() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [voterData, setVoterData] = useState(null);
  const open = Boolean(anchorEl);

  const userId = localStorage.getItem("id");

  const [formData, setFormData] = useState({
    userId,
    name: localStorage.getItem("userName") || "",
    email: localStorage.getItem("userEmail") || "",
    voterCard: "",
    nationality: "",
    address: "",
    aadharID: "",
    gender: "",
    contactNumber: "",
    dob: "",
  });

  // Fetch voter registration status on mount
  useEffect(() => {
    const fetchVoterData = async () => {
      try {
        const res = await axios.get(`/api/voters/by-user-id/${userId}`);
        setVoterData(res.data);
      } catch (err) {
        console.error("Error fetching voter data:", err);
        setVoterData({ registered: "No" });
      }
    };

    fetchVoterData();
  }, [userId]);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleRegisterClick = () => {
    handleCloseMenu();

    if (voterData?.registered === "Yes") {
      alert("You are already registered.");
      return;
    }

    setRegisterOpen(true);
  };

  const handleProfileClick = async () => {
    try {
      const res = await axios.get(`/api/voters/by-user-id/${userId}`);
      setVoterData(res.data);
      setProfileOpen(true);
    } catch (err) {
      console.error("Error fetching voter profile:", err);
    }
    handleCloseMenu();
  };

  const handleCloseRegister = () => setRegisterOpen(false);
  const handleCloseProfile = () => setProfileOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setVoterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async () => {
    try {
      await axios.post("/api/voters/register", {
        ...formData,
        registered: "Yes",
      });
      alert("Registration successful!");
      setRegisterOpen(false);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Error during registration.");
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await axios.put(`/api/auth/update-email/${voterData.userId}`, {
        email: voterData.email,
      });

      if (voterData.registered === "Yes") {
        await axios.put(`/api/voters/update-address/${voterData.userId}`, {
          address: voterData.address,
        });
      }

      alert("Profile updated successfully!");
      setProfileOpen(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Update failed.");
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    maxHeight: "90vh",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    overflowY: "auto",
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Voter Dashboard</Typography>
          <Box>
            <IconButton onClick={handleMenuClick} color="inherit">
              <Avatar sx={{ bgcolor: "white", color: "black" }}>
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}>
              <MenuItem
                onClick={handleRegisterClick}
                sx={{
                  color: voterData?.registered === "Yes" ? "gray" : "inherit",
                  pointerEvents:
                    voterData?.registered === "Yes" ? "auto" : "auto",
                }}>
                Register
              </MenuItem>
              <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  window.location.href = "/voting";
                }}>
                Voting
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4 }}>
        <Typography variant="h5">Welcome to your Voter Dashboard!</Typography>
      </Box>

      {/* Registration Modal */}
      <Modal open={registerOpen} onClose={handleCloseRegister}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Voter Registration
          </Typography>
          <Stack spacing={2}>
            <TextField label="Name" value={formData.name} disabled fullWidth />
            <TextField
              label="Email"
              value={formData.email}
              disabled
              fullWidth
            />
            <TextField
              name="voterCard"
              label="Voter Card Number"
              value={formData.voterCard}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              name="aadharID"
              label="Aadhar ID"
              value={formData.aadharID}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              name="dob"
              label="Date of Birth"
              type="date"
              value={formData.dob}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              name="gender"
              label="Gender"
              value={formData.gender}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              name="nationality"
              label="Nationality"
              value={formData.nationality}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              name="contactNumber"
              label="Contact Number"
              value={formData.contactNumber}
              onChange={handleFormChange}
              fullWidth
            />
            <Button variant="contained" onClick={handleRegisterSubmit}>
              Submit
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Profile Modal */}
      <Modal open={profileOpen} onClose={handleCloseProfile}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Voter Profile
          </Typography>
          {voterData && (
            <Stack spacing={2}>
              <Avatar
                sx={{ width: 80, height: 80, mx: "auto", bgcolor: "grey.500" }}
              />
              <TextField
                label="Name"
                value={voterData.name || ""}
                disabled
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                value={voterData.email || ""}
                onChange={handleProfileChange}
                fullWidth
              />
              {voterData.registered === "Yes" && (
                <>
                  <TextField
                    label="Voter Card"
                    value={voterData.voterCard || ""}
                    disabled
                    fullWidth
                  />
                  <TextField
                    label="Aadhar ID"
                    value={voterData.aadharID || ""}
                    disabled
                    fullWidth
                  />
                  <TextField
                    label="DOB"
                    value={voterData.dob || ""}
                    disabled
                    fullWidth
                  />
                  <TextField
                    label="Gender"
                    value={voterData.gender || ""}
                    disabled
                    fullWidth
                  />
                  <TextField
                    label="Nationality"
                    value={voterData.nationality || ""}
                    disabled
                    fullWidth
                  />
                  <TextField
                    label="Address"
                    name="address"
                    value={voterData.address || ""}
                    onChange={handleProfileChange}
                    fullWidth
                  />
                  <TextField
                    label="Contact Number"
                    value={voterData.contactNumber || ""}
                    disabled
                    fullWidth
                  />
                  <TextField
                    label="Registered"
                    value={voterData.registered || "No"}
                    disabled
                    fullWidth
                  />
                </>
              )}
              <Button variant="contained" onClick={handleProfileUpdate}>
                Save Changes
              </Button>
            </Stack>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default VoterDashboard;
