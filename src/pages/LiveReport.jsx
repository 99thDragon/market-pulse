import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { FiActivity, FiMail, FiUsers, FiDollarSign, FiSearch, FiRefreshCw } from "react-icons/fi";

const CHANNEL_META = {
  google_ads: { name: "Google Ads", icon: <FiSearch />, color: "#f59e0b" },
  meta: { name: "Meta", icon: <FiDollarSign />, color: "#2563eb" },
  email: { name: "Email", icon: <FiMail />, color: "#16a34a" },
  crm: { name: "CRM", icon: <FiUsers />, color: "#7c3aed" },
};

function ChannelCard({ id, data }) {
  const meta = CHANNEL_META[id];
  const isMock = data?.source === "mock";
  const metrics = Object.entries(data || {}).filter(
    ([key, value]) =>
      !["channel", "source", "period", "note", "error"].includes(key) &&
      (typeof value === "number" || typeof value === "string")
  );

  return (
    <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
      <h4 style={{ color: meta.color, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
        {meta.icon} {meta.name}
        {isMock && <span className="badge badge-blue" style={{ marginLeft: "auto" }}>Mock</span>}
        {!isMock && !data?.error && <span className="badge badge-green" style={{ marginLeft: "auto" }}>Live</span>}
      </h4>
      {data?.error && <p style={{ color: "#dc2626", fontSize: "0.9rem" }}>Data Unavailable: {data.error}</p>}
      {data?.note && <p style={{ color: "#475569", fontSize: "0.9rem" }}>{data.note}</p>}
      {metrics.map(([key, value]) => (
        <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", padding: "3px 0" }}>
          <span style={{ color: "#475569" }}>{key.replaceAll("_", " ")}</span>
          <strong style={{ color: "#1e293b" }}>{value}</strong>
        </div>
      ))}
    </div>
  );
}

export default function LiveReport() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/report");
      if (!resp.ok) throw new Error(`Backend answered ${resp.status}`);
      setResult(await resp.json());
    } catch (err) {
      setError(`Could not reach the backend (${err.message}). Is uvicorn running on port 8000?`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <span className="badge badge-green">Live Demo</span>
        <h1 className="page-title">Weekly Report</h1>
        <p className="page-subtitle">Real data from the Market Pulse agent — all four channels, explained by AI</p>
      </div>

      <div className="section-card">
        <button
          onClick={runReport}
          disabled={loading}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: loading ? "#94a3b8" : "#2563eb", color: "white",
            border: "none", borderRadius: "8px", padding: "12px 24px",
            fontSize: "1rem", cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? <FiRefreshCw className="spin" /> : <FiActivity />}
          {loading ? "Agent is pulling channels and writing the report…" : "Run Weekly Report"}
        </button>
        {error && (
          <p style={{ marginTop: "12px", color: "#dc2626" }}>{error}</p>
        )}
      </div>

      {result?.data && (
        <div className="section-card">
          <h3><FiActivity style={{ color: "#2563eb" }} /> Channel Data</h3>
          <div className="grid-2" style={{ marginTop: "15px" }}>
            {Object.entries(result.data).map(([id, data]) => (
              <ChannelCard key={id} id={id} data={data} />
            ))}
          </div>
        </div>
      )}

      {result?.report && (
        <div className="section-card">
          <h3><FiMail style={{ color: "#16a34a" }} /> The Report</h3>
          <div style={{ marginTop: "10px", lineHeight: 1.7 }}>
            <ReactMarkdown>{result.report}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
