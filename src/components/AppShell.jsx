import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { FiMenu, FiSearch, FiX } from "react-icons/fi";
import DocsSidebar from "./docs/DocsSidebar";
import AppSidebar from "./app/AppSidebar";
import CommandPalette from "./CommandPalette";

function isAppMode(pathname) {
  return pathname.startsWith("/app");
}

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const appMode = isAppMode(pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header className="header">
        <div className="header-left">
          <button
            type="button"
            className="mobile-menu-btn"
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <FiMenu size={22} />
          </button>

          <Link to={appMode ? "/app/report" : "/"} className="header-brand">
            <h2>Market Pulse</h2>
            <span>{appMode ? "Reports" : "Documentation"}</span>
          </Link>

          <nav className="mode-toggle" aria-label="Switch between docs and reports">
            <Link
              to="/"
              className={clsx("mode-toggle-link", !appMode && "mode-toggle-link--active")}
            >
              Documentation
            </Link>
            <Link
              to="/app/report"
              className={clsx("mode-toggle-link", appMode && "mode-toggle-link--active")}
            >
              Reports
            </Link>
          </nav>
        </div>

        <div className="header-right">
          <button
            type="button"
            className="mobile-search-btn"
            onClick={() => setPaletteOpen(true)}
            aria-label="Open search"
          >
            <FiSearch size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="search-trigger"
            onClick={() => setPaletteOpen(true)}
            aria-label="Open search"
          >
            <FiSearch size={16} aria-hidden="true" />
            <span>Search...</span>
            <kbd>⌘K</kbd>
          </button>
        </div>
      </header>

      <div className="layout-body">
        <aside className="sidebar">
          {appMode ? <AppSidebar /> : <DocsSidebar />}
        </aside>

        <main
          id="main-content"
          className={clsx("content-area", appMode && "content-area--wide")}
        >
          {children}
        </main>
      </div>

      {drawerOpen && (
        <>
          <div
            className="drawer-backdrop drawer-backdrop--open"
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <aside className={clsx("drawer-sidebar", drawerOpen && "drawer-sidebar--open")}>
            <div className="drawer-header">
              <span className="sidebar-label">{appMode ? "Reports" : "Documentation"}</span>
              <button
                type="button"
                className="drawer-close"
                aria-label="Close navigation menu"
                onClick={closeDrawer}
              >
                <FiX size={22} />
              </button>
            </div>
            {appMode ? <AppSidebar onNavigate={closeDrawer} /> : <DocsSidebar onNavigate={closeDrawer} />}
          </aside>
        </>
      )}

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
