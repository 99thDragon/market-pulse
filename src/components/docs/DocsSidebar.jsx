import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiTrendingUp,
  FiTarget,
  FiBarChart,
  FiCpu,
} from "react-icons/fi";

const links = [
  { name: "Overview", path: "/", icon: FiHome },
  { name: "Value Proposition", path: "/value-proposition", icon: FiTrendingUp },
  { name: "MVP Features", path: "/mvp", icon: FiTarget },
  { name: "Success Metrics", path: "/metrics", icon: FiBarChart },
  { name: "Agent Requirements", path: "/agents", icon: FiCpu },
];

export default function DocsSidebar({ onNavigate }) {
  return (
    <nav aria-label="Documentation">
      <div className="sidebar-label">Documentation</div>
      {links.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
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
