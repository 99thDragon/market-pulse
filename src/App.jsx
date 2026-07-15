import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/AppShell";

// Richard's V2 dashboard (Figma Make export) — own chrome, so it mounts
// outside AppShell while it gets wired to the backend.
const V2Dashboard = lazy(() => import("./v2/App"));
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
      <Route
        path="/v2"
        element={
          <Suspense fallback={null}>
            <V2Dashboard />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={
          <AppShell>
            <Routes>
              <Route path="/" element={<Home />} />
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
