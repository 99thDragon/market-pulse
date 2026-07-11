import { Link } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import { reportArchive } from "../../data/mockReport";

export default function ReportArchive() {
  return (
    <div className="page-container page-container--wide">
      <PageHeader
        badge="History"
        badgeVariant="neutral"
        title="Report Archive"
        subtitle="Past weekly cross-channel reports."
      />

      <div className="archive-list" role="list">
        {reportArchive.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className="archive-item"
            role="listitem"
          >
            <div>
              <p className="archive-item-period">{item.period}</p>
              <p className="archive-item-meta">
                Generated {item.generatedAt} · {item.flagCount} flag{item.flagCount !== 1 ? "s" : ""}
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
