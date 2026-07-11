import PageHeader from "../../components/ui/PageHeader";
import { integrationStatus } from "../../data/mockReport";

const statusLabels = {
  connected: { label: "Connected", variant: "green", dot: "connected" },
  error: { label: "Error", variant: "red", dot: "error" },
  pending: { label: "Pending", variant: "amber", dot: "pending" },
};

export default function IntegrationStatus() {
  return (
    <div className="page-container">
      <PageHeader
        badge="Health"
        badgeVariant="blue"
        title="Integration Status"
        subtitle="Read-only connection health for all reporting channels."
      />

      <div className="status-list" role="list">
        {integrationStatus.map((item) => {
          const s = statusLabels[item.status] || statusLabels.pending;
          return (
            <div key={item.id} className="status-item" role="listitem">
              <div className="status-item-left">
                <span className="status-item-name">{item.name}</span>
                <span className="status-item-sync">Last sync: {item.lastSync}</span>
              </div>
              <span className={`status-badge badge badge-${s.variant}`}>
                <span className={`status-dot status-dot--${s.dot}`} aria-hidden="true" />
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
