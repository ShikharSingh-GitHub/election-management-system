import CommitteeDashboard from "./pages/CommitteeDashboard";
import LandingPage from "./pages/LandingPage";
import VoterDashboard from "./pages/VoterDashboard";

const routes = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/voter",
    element: <VoterDashboard />,
  },
  {
    path: "/committee",
    element: <CommitteeDashboard />,
  },
];

export default routes;
