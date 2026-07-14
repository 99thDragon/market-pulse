import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { FiZap, FiRefreshCw } from "react-icons/fi";
import Callout from "../../components/ui/Callout";

const CHANNEL_NAMES = {
  google_ads: "Google Ads",
  meta: "Meta Ads",
  email: "Email",
  crm: "CRM",
};

function ChannelCard({ id, data }) {
  const source = data?.source;
  const isReal = source && !["mock", "simulated"].includes(source) && !data?.error;
  const badgeLabel = source === "mock" ? "Mock" : source === "simulated" ? "Simulated" : "Live";
  const metrics = Object.entries(data || {}).filter(
    ([key, value]) =>
      !["channel", "source", "period", "note", "error"].includes(key) &&
      (typeof value === "number" || typeof value === "string")
  );

  return (
    <div className="section-card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <strong style={{ color: "var(--text-heading)" }}>{CHANNEL_NAMES[id] ?? id}</strong>
        <span className={`badge ${isReal ? "badge-green" : "badge-amber"}`}>{isReal ? "Live" : badgeLabel}</span>
      </div>
      {data?.error && <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>Data Unavailable: {data.error}</p>}
      {data?.note && <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>{data.note}</p>}
      {metrics.map(([key, value]) => (
        <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: "var(--text-sm)" }}>
          <span style={{ color: "var(--text-muted)" }}>{key.replaceAll("_", " ")}</span>
          <strong style={{ color: "var(--text-primary)" }}>{value}</strong>
        </div>
      ))}
    </div>
  );
}

export default function LiveRun() {
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container page-container--report">
      <div className="report-meta">
        <p className="report-meta-period">Live Run</p>
        <p className="report-meta-generated">
          Runs the real agent: four channels pulled, report written by Claude on the spot.
        </p>
      </div>

      <div className="report-actions">
        <button type="button" className="btn btn-primary" onClick={runReport} disabled={loading}>
          {loading ? <FiRefreshCw size={16} aria-hidden="true" /> : <FiZap size={16} aria-hidden="true" />}
          {loading ? "Agent is running…" : "Run agent now"}
        </button>
      </div>

      {error && (
        <Callout variant="danger" title="Could not reach the backend">
          {error} — is the backend running?
        </Callout>
      )}

      {result?.data && (
        <>
          <h2 className="report-section-heading">Channel Data</h2>
          <div className="grid-2">
            {Object.entries(result.data).map(([id, data]) => (
              <ChannelCard key={id} id={id} data={data} />
            ))}
          </div>
        </>
      )}

      {result?.report && (
        <>
          <h2 className="report-section-heading">The Report</h2>
          <div className="section-card" style={{ lineHeight: 1.7 }}>
            <ReactMarkdown>{result.report}</ReactMarkdown>
          </div>
        </>
      )}
    </div>
  );
}
