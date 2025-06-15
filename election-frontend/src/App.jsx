import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CommitteeDashboard from "./pages/CommitteeDashboard";
import LandingPage from "./pages/LandingPage";
import VoterDashboard from "./pages/VoterDashboard";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/voter" element={<VoterDashboard />} />
        <Route path="/committee" element={<CommitteeDashboard />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
