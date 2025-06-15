import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  MenuItem,
  Modal,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import dayjs from "dayjs"; // For age calculation
import { useEffect, useState } from "react";

//axios.defaults.baseURL = "http://localhost:5173"; // Adjust port if different

function CommitteeDashboard() {
  const [currentElection, setCurrentElection] = useState("Rajya Sabha");
  const [candidates, setCandidates] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    CandidateID: "",
    Name: "",
    Gender: "",
    AadharID: "",
    DOB: "",
    Email: "",
    ContactNumber: "",
    Location: "",
    Party: "",
    ElectionType: currentElection, // for Segregrating the three Tabs
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect to fetch candidates when election type changes
  useEffect(() => {
    fetchCandidatesByType(currentElection);
  }, [currentElection]);

  // Function to fetch candidates by election type
  const fetchCandidatesByType = async (electionType) => {
    setLoading(true);
    try {
      const encodedType = encodeURIComponent(electionType);
      const response = await axios.get(
        `/api/candidates/election/${encodedType}`
      );
      console.log(`Fetched ${electionType} candidates:`, response.data);
      setCandidates(response.data);
    } catch (err) {
      console.error(`Error fetching ${electionType} candidates:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (e, val) => {
    setCurrentElection(val);
  };

  const handleOpenForm = (candidate = null) => {
    if (candidate) {
      setFormData({ ...candidate });
    } else {
      // Reset form for new candidate
      setFormData({
        CandidateID: "",
        Name: "",
        Gender: "",
        AadharID: "",
        DOB: "",
        Email: "",
        ContactNumber: "",
        Location: "",
        Party: "",
        ElectionType: currentElection, // Set the current election type
      });
    }
    setModalOpen(true);
  };

  const handleCloseForm = () => {
    setModalOpen(false);
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormSubmit = async () => {
    try {
      const submissionData = {
        ...formData,
        ElectionType: currentElection,
        DOB: dayjs(formData.DOB).format("YYYY-MM-DD"),
      };

      console.log("Submitting data:", submissionData); // Debug log

      if (formData.CandidateID) {
        await axios.put(
          `/api/candidates/${formData.CandidateID}`,
          submissionData
        );
      } else {
        // Remove CandidateID for new candidates
        const { CandidateID, ...newCandidateData } = submissionData;
        await axios.post(`/api/candidates`, newCandidateData);
      }
      handleCloseForm();
      fetchCandidatesByType(currentElection);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const handleDeleteCandidate = async (id) => {
    try {
      await axios.delete(`/api/candidates/${id}`);
      fetchCandidatesByType(currentElection);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /*const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = dayjs(dob);
    const today = dayjs();
    return today.diff(birthDate, "year");
  }; */

  const columns = [
    { field: "CandidateID", headerName: "ID", width: 90 },
    { field: "Name", headerName: "Name", width: 150 },
    { field: "Gender", headerName: "Gender", width: 100 },
    { field: "AadharID", headerName: "Aadhar ID", width: 150 },
    {
      field: "Age",
      headerName: "Age",
      width: 100,
      valueGetter: (params) => {
        const dob = params?.row?.DOB;
        if (!dob) return "N/A";
        // Remove timezone offset from date
        const birthDate = dayjs(dob.split("T")[0]);
        return dayjs().diff(birthDate, "year");
      },
    },
    { field: "Email", headerName: "Email", width: 180 },
    { field: "ContactNumber", headerName: "Contact", width: 130 },
    { field: "Location", headerName: "Location", width: 130 },
    { field: "Party", headerName: "Party", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleOpenForm(params.row)}>
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => handleDeleteCandidate(params.row.CandidateID)}>
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: 'url("/CommitteeDashboardBackground.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}>
      <Box
        sx={{
          p: 3,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          //backdropFilter: "blur(1px)",
          minHeight: "100vh",
        }}>
        <Typography variant="h4" gutterBottom>
          Committee Dashboard - {currentElection}
        </Typography>

        {/* Election Type Tabs */}
        <Tabs value={currentElection} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Rajya Sabha" value="Rajya Sabha" />
          <Tab label="Lok Sabha" value="Lok Sabha" />
          <Tab label="Gram Panchayat" value="Gram Panchayat" />
        </Tabs>

        {/* Add Candidate Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleOpenForm()}
            startIcon={<AddIcon />}>
            Add {currentElection} Candidate
          </Button>
        </Box>

        {/* Candidates DataGrid */}
        <DataGrid
          rows={candidates || []}
          columns={columns}
          getRowId={(row) => row.CandidateID}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          autoHeight
          loading={loading}
          error={error}
          components={{
            NoRowsOverlay: () => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}>
                {error
                  ? `Error: ${error}`
                  : `No candidates found for ${currentElection}`}
              </Box>
            ),
          }}
        />

        <Modal open={modalOpen} onClose={handleCloseForm}>
          <Box sx={modalStyle}>
            <Typography variant="h6" gutterBottom>
              {formData.CandidateID ? "Edit Candidate" : "Add Candidate"}
            </Typography>
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}>
              <TextField
                required
                name="Name"
                label="Name"
                value={formData.Name}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                required
                name="Gender"
                label="Gender"
                value={formData.Gender}
                onChange={handleFormChange}
                select
                fullWidth>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              <TextField
                required
                name="AadharID"
                label="Aadhar ID"
                value={formData.AadharID}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                required
                name="DOB"
                label="Date of Birth"
                type="date"
                value={
                  formData.DOB ? dayjs(formData.DOB).format("YYYY-MM-DD") : ""
                }
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                required
                name="Email"
                label="Email"
                type="email"
                value={formData.Email}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                required
                name="ContactNumber"
                label="Contact Number"
                value={formData.ContactNumber}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                required
                name="Location"
                label="Location"
                value={formData.Location}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                required
                name="Party"
                label="Party"
                value={formData.Party}
                onChange={handleFormChange}
                fullWidth
              />
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  mt: 2,
                }}>
                {formData.CandidateID && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this candidate?"
                        )
                      ) {
                        handleDeleteCandidate(formData.CandidateID);
                        handleCloseForm();
                      }
                    }}>
                    Delete
                  </Button>
                )}
                <Button variant="contained" onClick={handleFormSubmit}>
                  {formData.CandidateID ? "Update" : "Add"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default CommitteeDashboard;
