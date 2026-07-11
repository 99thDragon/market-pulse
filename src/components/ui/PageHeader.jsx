import clsx from "clsx";

export default function PageHeader({ badge, badgeVariant = "blue", title, subtitle, breadcrumb }) {
  return (
    <header className="page-header">
      {breadcrumb}
      {badge && <span className={clsx("badge", `badge-${badgeVariant}`)}>{badge}</span>}
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </header>
  );
}
