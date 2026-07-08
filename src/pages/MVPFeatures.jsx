import { FiPlay, FiServer, FiFileText } from "react-icons/fi";

export default function MVPFeatures() {
  return (
    <div className="page-container">
      <div className="page-header">
        <span className="badge badge-green">Product Features</span>
        <h1 className="page-title">MVP Features & Workflow</h1>
        <p className="page-subtitle">The standard operations, integrations, and limits for the MVP version.</p>
      </div>

      <div className="section-card">
        <h3><FiServer style={{ color: "#3b82f6" }} /> 1. Integration Scope</h3>
        <p style={{ marginBottom: "15px" }}>
          Market Pulse unifies four essential marketing and sales data sources through dedicated read-only integration tasks:
        </p>
        <div className="grid-2">
          <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "10px" }}>
            <strong>Google Ads</strong>
            <p style={{ fontSize: "0.9rem", color: "#475569" }}>Spend, clicks, CTR, conversions, cost/conversion</p>
          </div>
          <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "10px" }}>
            <strong>Meta Ads</strong>
            <p style={{ fontSize: "0.9rem", color: "#475569" }}>Spend, reach, CTR, conversions, cost/conversion</p>
          </div>
          <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "10px" }}>
            <strong>Email Marketing</strong>
            <p style={{ fontSize: "0.9rem", color: "#475569" }}>Open rate, click rate, unsubscribes, sends</p>
          </div>
          <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "10px" }}>
            <strong>CRM Pipeline</strong>
            <p style={{ fontSize: "0.9rem", color: "#475569" }}>New leads, deal stage, deal source, conversions</p>
          </div>
        </div>
      </div>

      <div className="section-card">
        <h3><FiPlay style={{ color: "#16a34a" }} /> 2. Step-by-Step Reporting Loop</h3>
        <ul className="step-list" style={{ marginTop: "15px" }}>
          <li className="step-item">
            <span className="step-num">1</span>
            <div>
              <strong>Trigger & Sequential Fetch</strong>
              <p style={{ fontSize: "0.95rem", color: "#475569" }}>Runs every Monday morning. Calls APIs in precise order: Google Ads, Meta Ads, Email, and CRM.</p>
            </div>
          </li>
          <li className="step-item">
            <span className="step-num">2</span>
            <div>
              <strong>Reconcile & Compare</strong>
              <p style={{ fontSize: "0.95rem", color: "#475569" }}>Aggregates the retrieved metrics and compares them against the prior week's baseline.</p>
            </div>
          </li>
          <li className="step-item">
            <span className="step-num">3</span>
            <div>
              <strong>Generate Explanations</strong>
              <p style={{ fontSize: "0.95rem", color: "#475569" }}>Flags anomalies and uses LLM intelligence to formulate plain-language explanations of performance changes.</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="section-card">
        <h3><FiFileText style={{ color: "#7c3aed" }} /> 3. Read-Only Safeguard</h3>
        <p>
          Market Pulse operates under a strict **read-only** policy. It never writes to databases, changes budgets, updates campaigns, or contacts customers directly. It serves purely as an analytical co-pilot for the marketer, who maintains final decision-making power.
        </p>
      </div>
    </div>
  );
}
