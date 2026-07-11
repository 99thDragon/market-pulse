export default function ReportSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading report">
      <div className="skeleton" style={{ height: 32, width: "60%", marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 16, width: "40%", marginBottom: 32 }} />
      <div className="skeleton" style={{ height: 14, width: 180, marginBottom: 16 }} />
      <div className="skeleton-flag skeleton" />
      <div className="skeleton-flag skeleton" />
      <div className="skeleton-flag skeleton" />
      <div className="skeleton" style={{ height: 14, width: 140, margin: "32px 0 16px" }} />
      <div className="skeleton-channel skeleton" />
      <div className="skeleton-channel skeleton" />
      <div className="skeleton-channel skeleton" />
      <div className="skeleton-channel skeleton" />
    </div>
  );
}
