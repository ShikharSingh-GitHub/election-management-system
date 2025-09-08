import CommitteeDashboard from "./pages/CommitteeDashboard";
import LandingPage from "./pages/LandingPage";
import Receipt from "./pages/receipt";
import VoterDashboard from "./pages/VoterDashboard";
import VoterVoting from "./pages/VoterVoting";

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
  {
    path: "/voting",
    element: <VoterVoting />,
  },
  {
    path: "/receipt",
    element: <Receipt />,
  },
];

export default routes;
