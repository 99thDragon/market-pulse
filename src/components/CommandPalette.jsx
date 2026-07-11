import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { FiSearch } from "react-icons/fi";
import { searchIndex } from "../data/searchIndex";

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const fuse = useMemo(
    () =>
      new Fuse(searchIndex, {
        keys: ["title", "description", "keywords", "group"],
        threshold: 0.4,
      }),
    []
  );

  const results = query.trim()
    ? fuse.search(query).map((r) => r.item)
    : searchIndex;

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[activeIndex]) {
        e.preventDefault();
        navigate(results[activeIndex].path);
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, results, activeIndex, navigate, onClose]);

  if (!open) return null;

  const groups = results.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  let flatIndex = 0;

  return (
    <div
      className="palette-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onClick={onClose}
    >
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <div className="palette-input-wrap">
          <FiSearch size={18} aria-hidden="true" />
          <input
            className="palette-input"
            type="search"
            placeholder="Search docs and reports..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            aria-label="Search"
          />
        </div>

        <div className="palette-results" role="listbox">
          {results.length === 0 ? (
            <p className="palette-empty">No results for "{query}"</p>
          ) : (
            Object.entries(groups).map(([group, items]) => (
              <div key={group}>
                <div className="palette-group-label">{group}</div>
                {items.map((item) => {
                  const idx = flatIndex++;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`palette-item${idx === activeIndex ? " palette-item--active" : ""}`}
                      role="option"
                      aria-selected={idx === activeIndex}
                      onClick={() => {
                        navigate(item.path);
                        onClose();
                      }}
                      onMouseEnter={() => setActiveIndex(idx)}
                    >
                      <span className="palette-item-title">{item.title}</span>
                      <span className="palette-item-desc">{item.description}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
