import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import { FiArchive } from "react-icons/fi";

export default function ReportArchive() {
  const [reports, setReports] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const resp = await fetch("/api/report/archive");
        const payload = resp.ok ? await resp.json() : { reports: [] };
        if (alive) setReports(payload.reports ?? []);
      } catch {
        if (alive) setReports([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="page-container page-container--wide">
      <PageHeader
        badge="History"
        badgeVariant="neutral"
        title="Report Archive"
        subtitle="Past weekly cross-channel reports."
      />

      {reports && reports.length === 0 && (
        <EmptyState
          icon={<FiArchive size={40} />}
          title="No reports stored yet"
          description="Each week's report is archived automatically after the agent runs."
          action={<Link to="/app/live" className="btn btn-primary">Run the agent</Link>}
        />
      )}

      <div className="archive-list" role="list">
        {(reports ?? []).map((item) => (
          <Link
            key={item.id}
            to="/app/report"
            className="archive-item"
            role="listitem"
          >
            <div>
              <p className="archive-item-period">{item.period}</p>
              <p className="archive-item-meta">
                Generated {item.generatedAt ? new Date(item.generatedAt).toLocaleDateString() : "—"} · {item.flagCount} flag{item.flagCount !== 1 ? "s" : ""}
              </p>
            </div>
            <span className={`badge ${item.reviewed ? "badge-green" : "badge-amber"}`}>
              {item.reviewed ? "Reviewed" : "Unreviewed"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
