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
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { logout } from "../services/authService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const electionTypes = ["Rajya Sabha", "Lok Sabha", "Gram Panchayat"];

function CommitteeDashboard() {
  const [currentTab, setCurrentTab] = useState("Candidates");
  const [currentElection, setCurrentElection] = useState("Rajya Sabha");
  const [candidates, setCandidates] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [loading, setLoading] = useState(false);
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
    ElectionType: currentElection,
  });

  useEffect(() => {
    if (currentTab === "Candidates") {
      fetchCandidatesByType(currentElection);
    } else {
      fetchLeaderboard(currentElection);
    }
  }, [currentElection, currentTab]);

  const fetchCandidatesByType = async (type) => {
    setLoading(true);
    try {
      const encodedType = encodeURIComponent(type);
      const res = await axios.get(`/api/candidates/election/${encodedType}`);
      setCandidates(res.data);
    } catch (err) {
      console.error("Fetch Candidates Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async (type) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/leaderboard/${encodeURIComponent(type)}`
      );
      setLeaderboardData(res.data);
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabSwitch = (e, value) => setCurrentElection(value);

  const handleOpenForm = (candidate = null) => {
    if (candidate) {
      setFormData({ ...candidate });
    } else {
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
        ElectionType: currentElection,
      });
    }
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async () => {
    try {
      const submissionData = {
        ...formData,
        ElectionType: currentElection,
        DOB: dayjs(formData.DOB).format("YYYY-MM-DD"),
      };

      if (formData.CandidateID) {
        await axios.put(
          `/api/candidates/${formData.CandidateID}`,
          submissionData
        );
      } else {
        const { CandidateID, ...newData } = submissionData;
        await axios.post(`/api/candidates`, newData);
      }

      setModalOpen(false);
      fetchCandidatesByType(currentElection);
    } catch (err) {
      console.error("Submit error:", err);
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

  const labels = leaderboardData.map((d) => d.Name);
  const counts = leaderboardData.map((d) => d.VoteCount);
  const totalVotes = counts.reduce((a, b) => a + b, 0);
  const bgColors = counts.map((_, i) => {
    if (i === 0) return "#ffd700";
    if (i === 1) return "#c0c0c0";
    if (i === 2) return "#cd7f32";
    return "#1976d2";
  });

  const chartData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: bgColors,
        datalabels: {
          formatter: (value) =>
            totalVotes > 0
              ? `${((value / totalVotes) * 100).toFixed(1)}%`
              : "0%",
          color: "#000",
          anchor: "center",
          align: "center",
          font: { weight: "bold" },
        },
      },
    ],
  };

  const barOptions = {
    indexAxis: "y",
    plugins: { legend: { display: false }, datalabels: { clamp: true } },
    elements: { bar: { borderRadius: 4, barThickness: 10 } },
    responsive: true,
    maintainAspectRatio: false,
  };

  const columns = [
    { field: "CandidateID", headerName: "ID", width: 90 },
    { field: "Name", headerName: "Name", width: 150 },
    { field: "Gender", headerName: "Gender", width: 100 },
    { field: "AadharID", headerName: "Aadhar ID", width: 150 },
    //{
    //  field: "Age",
    //  headerName: "Age",
    //  width: 100,
    //  valueGetter: (params) => {
    //    const dob = params?.row?.DOB;
    //    if (!dob) return "N/A";
    //    const birthDate = dayjs(dob.split("T")[0]);
    //   return dayjs().diff(birthDate, "year");
    //  },
    //},
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
            size="small"
            variant="outlined"
            onClick={() => handleOpenForm(params.row)}>
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDeleteCandidate(params.row.CandidateID)}>
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}>
        <Typography variant="h4">
          Committee Dashboard - {currentElection}
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            logout();
            window.location.href = "/";
          }}>
          Logout
        </Button>
      </Box>

      <Tabs value={currentElection} onChange={handleTabSwitch} sx={{ mb: 2 }}>
        {electionTypes.map((et) => (
          <Tab label={et} value={et} key={et} />
        ))}
      </Tabs>

      <Box sx={{ mb: 2 }}>
        <Button onClick={() => setCurrentTab("Candidates")} sx={{ mr: 1 }}>
          Candidates
        </Button>
        <Button onClick={() => setCurrentTab("Leaderboard")}>
          Leaderboard
        </Button>
      </Box>

      {currentTab === "Candidates" ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              onClick={() => handleOpenForm()}
              startIcon={<AddIcon />}>
              Add {currentElection} Candidate
            </Button>
          </Box>

          <DataGrid
            rows={candidates}
            columns={columns}
            getRowId={(row) => row.CandidateID}
            autoHeight
            loading={loading}
            pageSize={5}
          />
        </>
      ) : (
        <Box sx={{ maxWidth: "100%", height: 300 }}>
          <Button
            variant="contained"
            onClick={() => setChartType(chartType === "bar" ? "pie" : "bar")}
            sx={{ mb: 2 }}>
            Switch to {chartType === "bar" ? "Pie Chart" : "Bar Chart"}
          </Button>
          {chartType === "bar" ? (
            <Bar data={chartData} options={barOptions} />
          ) : (
            <Pie
              data={chartData}
              options={{
                plugins: {
                  legend: { position: "right" },
                  datalabels: {
                    formatter: (value) =>
                      totalVotes > 0
                        ? `${((value / totalVotes) * 100).toFixed(1)}%`
                        : "0%",
                    color: "#fff",
                    font: { weight: "bold" },
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          )}
        </Box>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 2,
            width: 500,
            top: "50%",
            left: "50%",
            position: "absolute",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}>
          <Typography variant="h6">
            {formData.CandidateID ? "Edit Candidate" : "Add Candidate"}
          </Typography>
          <TextField
            name="Name"
            label="Name"
            value={formData.Name}
            onChange={handleFormChange}
          />
          <TextField
            name="Gender"
            label="Gender"
            value={formData.Gender}
            onChange={handleFormChange}
            select>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField
            name="AadharID"
            label="Aadhar ID"
            value={formData.AadharID}
            onChange={handleFormChange}
          />
          <TextField
            name="DOB"
            label="Date of Birth"
            type="date"
            value={formData.DOB ? dayjs(formData.DOB).format("YYYY-MM-DD") : ""}
            onChange={handleFormChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="Email"
            label="Email"
            value={formData.Email}
            onChange={handleFormChange}
          />
          <TextField
            name="ContactNumber"
            label="Contact Number"
            value={formData.ContactNumber}
            onChange={handleFormChange}
          />
          <TextField
            name="Location"
            label="Location"
            value={formData.Location}
            onChange={handleFormChange}
          />
          <TextField
            name="Party"
            label="Party"
            value={formData.Party}
            onChange={handleFormChange}
          />
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            {formData.CandidateID && (
              <Button
                color="error"
                variant="outlined"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this candidate?"
                    )
                  ) {
                    handleDeleteCandidate(formData.CandidateID);
                    setModalOpen(false);
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
      </Modal>
    </Box>
  );
}

export default CommitteeDashboard;
