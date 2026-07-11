import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FlagCard from "../../components/ui/FlagCard";
import ChannelSection from "../../components/ui/ChannelSection";
import ReportSkeleton from "../../components/ui/ReportSkeleton";
import EmptyState from "../../components/ui/EmptyState";
import Callout from "../../components/ui/Callout";
import { currentReport } from "../../data/mockReport";
import { FiCalendar, FiCheck } from "react-icons/fi";

export default function Report() {
  const [loading, setLoading] = useState(true);
  const [reviewed, setReviewed] = useState(currentReport.reviewed);
  const report = currentReport;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
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
          title="Your first report arrives Monday"
          description="Connect your integrations and Market Pulse will deliver your first unified cross-channel report automatically."
          action={<Link to="/app/status" className="btn btn-primary">Check integrations</Link>}
        />
      </div>
    );
  }

  if (report.status === "error") {
    return (
      <div className="page-container page-container--report">
        <Callout variant="danger" title="Report generation failed">
          One or more channels could not be reached. Check integration status and try again at the next scheduled run.
        </Callout>
      </div>
    );
  }

  return (
    <div className="page-container page-container--report">
      <div className="report-meta">
        <p className="report-meta-period">Week of {report.period}</p>
        <p className="report-meta-generated">Generated {report.generatedAt}</p>
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
