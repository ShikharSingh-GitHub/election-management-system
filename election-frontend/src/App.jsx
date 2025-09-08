import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CommitteeDashboard from "./pages/CommitteeDashboard";
import LandingPage from "./pages/LandingPage";
import Receipt from "./pages/Receipt";
import VoterDashboard from "./pages/VoterDashboard";
import VoterVoting from "./pages/VoterVoting";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/voter" element={<VoterDashboard />} />
        <Route path="/committee" element={<CommitteeDashboard />} />
        <Route path="/voting" element={<VoterVoting />} />
        <Route path="/receipt" element={<Receipt />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
