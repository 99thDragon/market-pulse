import { NavLink } from "react-router-dom";
import { FiFileText, FiArchive, FiActivity } from "react-icons/fi";

const links = [
  { name: "This Week", path: "/app/report", icon: FiFileText },
  { name: "Archive", path: "/app/reports", icon: FiArchive },
  { name: "Integrations", path: "/app/status", icon: FiActivity },
];

export default function AppSidebar({ onNavigate }) {
  return (
    <nav aria-label="Reports">
      <div className="sidebar-label">Reports</div>
      {links.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            onClick={onNavigate}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
