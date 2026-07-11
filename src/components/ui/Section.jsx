import clsx from "clsx";

export default function Section({ title, icon, accent, children, className }) {
  return (
    <section className={clsx("section", accent && "section--accent", className)}>
      {title && (
        <h3 className="section-title">
          {icon && <span className="section-title-icon" aria-hidden="true">{icon}</span>}
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}
