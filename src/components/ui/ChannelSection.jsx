import { useState } from "react";
import clsx from "clsx";
import { FiChevronDown } from "react-icons/fi";
import Callout from "./Callout";

export default function ChannelSection({ name, status, flagCount, metrics, unavailable, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={clsx("channel-section", unavailable && "channel-section--unavailable")}>
      <button
        type="button"
        className="channel-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="channel-trigger-left">
          <FiChevronDown
            size={18}
            className={clsx("channel-chevron", open && "channel-chevron--open")}
            aria-hidden="true"
          />
          {name}
          {flagCount > 0 && (
            <span className="badge badge-amber">{flagCount} flag{flagCount !== 1 ? "s" : ""}</span>
          )}
          {status === "normal" && flagCount === 0 && !unavailable && (
            <span className="badge badge-green">Normal</span>
          )}
        </span>
      </button>

      {open && (
        <div className="channel-body">
          {unavailable ? (
            <Callout variant="warning" title="Data Unavailable">
              This channel could not be reached during report generation. No metrics were estimated.
            </Callout>
          ) : (
            <div className="channel-metrics">
              {metrics.map((m) => (
                <div key={m.label} className="channel-metric">
                  <div className="channel-metric-label">{m.label}</div>
                  <div className="channel-metric-value">{m.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
