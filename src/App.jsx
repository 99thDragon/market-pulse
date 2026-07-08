import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import ValueProposition from "./pages/ValueProposition";
import MVPFeatures from "./pages/MVPFeatures";
import SuccessMetrics from "./pages/SuccessMetrics";
import AgentRequirements from "./pages/AgentRequirements";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/value-proposition" element={<ValueProposition />} />
        <Route path="/mvp" element={<MVPFeatures />} />
        <Route path="/metrics" element={<SuccessMetrics />} />
        <Route path="/agents" element={<AgentRequirements />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
