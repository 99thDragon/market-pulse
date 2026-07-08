import { FiAlertCircle, FiTrendingUp, FiUsers } from "react-icons/fi";

export default function Home() {
  return (
    <div className="page-container">
      <div className="page-header">
        <span className="badge badge-blue">Product Overview</span>
        <h1 className="page-title">Market Pulse</h1>
        <p className="page-subtitle">AI-Powered Market Intelligence & Reporting Platform</p>
      </div>

      <div className="section-card">
        <h3>
          <FiAlertCircle style={{ color: "#dc2626" }} /> The Problem
        </h3>
        <p>
          Marketers experience a significant weekly time drain manually pulling and reconciling performance data across Google Ads, Meta, email, and CRM. Because there is no unified reporting view, it leads to delayed decisions on campaigns and budget—losing their critical window of relevance.
        </p>
        <div style={{ marginTop: "15px", borderLeft: "4px solid #ef4444", paddingLeft: "15px", color: "#475569" }}>
          <em>"Marketers spend between 4 to 14+ hours weekly on manual reporting. Dashboards show metrics but do not explain the 'why' behind changes."</em>
        </div>
      </div>

      <div className="section-card">
        <h3>
          <FiTrendingUp style={{ color: "#16a34a" }} /> The Opportunity
        </h3>
        <p>
          Give every marketer an automated weekly cross-channel report with built-in explanations. This recovers hours currently lost to manual reporting each week and speeds up critical budget and campaign decisions.
        </p>
      </div>

      <div className="section-card">
        <h3>
          <FiUsers style={{ color: "#7c3aed" }} /> Users & Target Audience
        </h3>
        <div className="grid-2" style={{ marginTop: "15px" }}>
          <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h4 style={{ color: "#1e293b", marginBottom: "8px" }}>Primary Users</h4>
            <p style={{ fontSize: "1rem" }}>
              Marketers managing campaigns across multiple paid ads, social, and email channels who value speed and clarity over exhaustive detail.
            </p>
          </div>
          <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h4 style={{ color: "#1e293b", marginBottom: "8px" }}>Secondary Users</h4>
            <p style={{ fontSize: "1rem" }}>
              Marketing leadership and executives who receive these summaries to make high-level budget and strategy updates without looking at raw data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
