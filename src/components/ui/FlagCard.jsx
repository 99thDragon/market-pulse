import clsx from "clsx";
import { FiTrendingDown, FiTrendingUp, FiAlertTriangle } from "react-icons/fi";

const icons = {
  up: FiTrendingUp,
  down: FiTrendingDown,
  conflict: FiAlertTriangle,
};

export default function FlagCard({ metric, change, direction, cause, source, conflict }) {
  const Icon = icons[direction] || FiAlertTriangle;
  const dir = conflict ? "conflict" : direction;

  return (
    <article className={clsx("flag-card", `flag-card--${dir}`)}>
      <div className="flag-card-header">
        <div className="flag-card-metric">
          <Icon size={18} aria-hidden="true" />
          <span>{metric}</span>
          {conflict && <span className="badge badge-amber">Conflicting signals</span>}
        </div>
        <span className={clsx("flag-card-change", `flag-card-change--${dir}`)}>
          {change}
        </span>
      </div>
      <p className="flag-card-cause">
        <strong>Likely cause:</strong> {cause}
      </p>
      {source && <p className="flag-card-source">Source: {source}</p>}
    </article>
  );
}
