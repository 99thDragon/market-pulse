import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/AppShell";

// The V2 dashboard is the main app (team decision, July 2026). The classic
// docs site lives at /docs and the report pages keep their /app/* routes.
import V2Dashboard from "./v2/App";
import Home from "./pages/docs/Home";
import ValueProposition from "./pages/docs/ValueProposition";
import MVPFeatures from "./pages/docs/MVPFeatures";
import SuccessMetrics from "./pages/docs/SuccessMetrics";
import AgentRequirements from "./pages/docs/AgentRequirements";
import Report from "./pages/app/Report";
import ReportArchive from "./pages/app/ReportArchive";
import IntegrationStatus from "./pages/app/IntegrationStatus";
import LiveRun from "./pages/app/LiveRun";

function App() {
  return (
    <Routes>
      <Route path="/" element={<V2Dashboard />} />
      <Route path="/v2" element={<Navigate to="/" replace />} />
      <Route
        path="*"
        element={
          <AppShell>
            <Routes>
              <Route path="/docs" element={<Home />} />
              <Route path="/value-proposition" element={<ValueProposition />} />
              <Route path="/mvp" element={<MVPFeatures />} />
              <Route path="/metrics" element={<SuccessMetrics />} />
              <Route path="/agents" element={<AgentRequirements />} />

              <Route path="/app/report" element={<Report />} />
              <Route path="/app/reports" element={<ReportArchive />} />
              <Route path="/app/status" element={<IntegrationStatus />} />
              <Route path="/app/live" element={<LiveRun />} />
              <Route path="/app" element={<Navigate to="/app/report" replace />} />
            </Routes>
          </AppShell>
        }
      />
    </Routes>
  );
}

export default App;
