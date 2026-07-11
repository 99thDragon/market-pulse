import { FiPlusCircle, FiActivity, FiShield } from "react-icons/fi";

export default function ValueProposition() {
  return (
    <div className="page-container">
      <div className="page-header">
        <span className="badge badge-purple">Core Proposition</span>
        <h1 className="page-title">Value Proposition</h1>
        <p className="page-subtitle">Why we are building Market Pulse and the immediate value it brings.</p>
      </div>

      <div className="section-card" style={{ background: "linear-gradient(135deg, #eff6ff, #f8fafc)", borderColor: "#bfdbfe" }}>
        <h3 style={{ color: "#2563eb" }}>Core Statement</h3>
        <p style={{ fontSize: "1.2rem", fontWeight: "500", color: "#1e3a8a" }}>
          Marketers who struggle to spot performance shifts early—because channel data is scattered—use Market Pulse, an AI agent that pulls and unifies this data every week and explains why key metrics moved.
        </p>
      </div>

      <h2 style={{ margin: "40px 0 20px 0", color: "#1e293b" }}>Top 3 MVP Value Propositions</h2>

      <div className="grid-3">
        <div className="section-card">
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "15px" }}>
            <span className="badge badge-green" style={{ padding: "8px" }}><FiPlusCircle size={20} /></span>
            <h4 style={{ fontSize: "1.2rem", color: "#1e293b" }}>The Vitamin</h4>
          </div>
          <p style={{ fontSize: "0.95rem" }}>
            <strong>Must-Have Baseline:</strong> Every channel's performance data—Google Ads, Meta, email platform, and CRM—pulled and organized in one single place, every week, without fail.
          </p>
        </div>

        <div className="section-card">
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "15px" }}>
            <span className="badge badge-blue" style={{ padding: "8px" }}><FiShield size={20} /></span>
            <h4 style={{ fontSize: "1.2rem", color: "#1e293b" }}>The Painkiller</h4>
          </div>
          <p style={{ fontSize: "0.95rem" }}>
            <strong>Solves Core Pain:</strong> No more manually logging into multiple dashboards to download and reconcile spreadsheets across four platforms. Market Pulse automates the pulling and the math.
          </p>
        </div>

        <div className="section-card">
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "15px" }}>
            <span className="badge badge-purple" style={{ padding: "8px" }}><FiActivity size={20} /></span>
            <h4 style={{ fontSize: "1.2rem", color: "#1e293b" }}>The Steroid</h4>
          </div>
          <p style={{ fontSize: "0.95rem" }}>
            <strong>The Magic Moment:</strong> Every flagged metric comes with a plain-English explanation of why it moved—so the marketer opens the report already knowing the story.
          </p>
        </div>
      </div>
    </div>
  );
}
