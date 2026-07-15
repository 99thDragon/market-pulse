import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FlagCard from "../../components/ui/FlagCard";
import ChannelSection from "../../components/ui/ChannelSection";
import ReportSkeleton from "../../components/ui/ReportSkeleton";
import EmptyState from "../../components/ui/EmptyState";
import Callout from "../../components/ui/Callout";
import { FiCalendar, FiCheck } from "react-icons/fi";

function mapApiReport(payload) {
  const rep = payload?.report;
  if (!rep) return { status: "empty" };

  const flags = (rep.flags ?? []).map((flag, i) => ({
    id: `${i}-${flag.metric}`,
    ...flag,
    conflict: flag.direction === "conflict",
  }));

  const channels = (rep.channels ?? []).map((channel) => {
    const flagCount = flags.filter(
      (f) =>
        (f.source || "").toLowerCase().includes(channel.id.replace("_", " ")) ||
        (f.source || "").toLowerCase().startsWith(channel.name.toLowerCase()) ||
        (f.metric || "").toLowerCase().startsWith(channel.name.toLowerCase())
    ).length;
    return {
      id: channel.id,
      name: channel.name,
      status: channel.status,
      flagCount,
      metrics: channel.metrics ?? [],
      unavailable: channel.status === "unavailable",
    };
  });

  const generated = rep.generatedAt ? new Date(rep.generatedAt) : null;
  return {
    status: "ready",
    period: rep.period,
    baselineWeek: rep.baseline_week ?? payload.baseline_week,
    generatedAt:
      generated && !Number.isNaN(generated.valueOf())
        ? generated.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
        : rep.generatedAt,
    flags,
    channels,
  };
}

export default function Report() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const resp = await fetch("/api/report");
        if (!resp.ok) throw new Error(`Backend answered ${resp.status}`);
        const payload = await resp.json();
        if (alive) setReport(mapApiReport(payload));
      } catch {
        if (alive) setReport({ status: "error" });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="page-container page-container--report">
        <ReportSkeleton />
      </div>
    );
  }

  if (report.status === "empty") {
    return (
      <div className="page-container page-container--report">
        <EmptyState
          icon={<FiCalendar size={40} />}
          title="No report for this week yet"
          description="Run the agent to generate this week's cross-channel report — it takes about 20 seconds."
          action={<Link to="/app/live" className="btn btn-primary">Run the agent</Link>}
        />
      </div>
    );
  }

  if (report.status === "error") {
    return (
      <div className="page-container page-container--report">
        <Callout variant="danger" title="Report generation failed">
          The backend could not be reached. Check that the API is running, then try again.
        </Callout>
      </div>
    );
  }

  return (
    <div className="page-container page-container--report">
      <div className="report-meta">
        <p className="report-meta-period">Week of {report.period}</p>
        <p className="report-meta-generated">
          Generated {report.generatedAt}
          {report.baselineWeek ? ` · vs baseline ${report.baselineWeek}` : " · first run, baseline established"}
        </p>
      </div>

      <div className="report-actions">
        {!reviewed ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setReviewed(true)}
          >
            <FiCheck size={16} aria-hidden="true" />
            Mark as reviewed
          </button>
        ) : (
          <span className="badge badge-green">
            <FiCheck size={14} aria-hidden="true" /> Reviewed
          </span>
        )}
      </div>

      <h2 className="report-section-heading">
        What Changed This Week
        <span className="badge badge-amber">{report.flags.length} flags</span>
      </h2>

      <div className="flag-list" role="list">
        {report.flags.map((flag) => (
          <div key={flag.id} role="listitem">
            <FlagCard {...flag} />
          </div>
        ))}
      </div>

      <h2 className="report-section-heading">Channel Details</h2>

      <div className="channel-list">
        {report.channels.map((channel) => (
          <ChannelSection
            key={channel.id}
            name={channel.name}
            status={channel.status}
            flagCount={channel.flagCount}
            metrics={channel.metrics}
            unavailable={channel.unavailable}
            defaultOpen={channel.flagCount > 0}
          />
        ))}
      </div>
    </div>
  );
}
