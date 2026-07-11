import clsx from "clsx";

const variants = {
  quote: "callout-quote",
  info: "callout-info",
  success: "callout-success",
  warning: "callout-warning",
  danger: "callout-danger",
};

export default function Callout({ variant = "info", title, children }) {
  return (
    <div className={clsx("callout", variants[variant])}>
      {title && <p className="callout-title">{title}</p>}
      {children}
    </div>
  );
}
