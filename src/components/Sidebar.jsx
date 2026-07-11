import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiTrendingUp,
  FiTarget,
  FiBarChart,
  FiCpu,
  FiActivity
} from "react-icons/fi";
import "../styles/layout.css";

export default function Sidebar(){
  const links=[
    {
      name:"Overview",
      path:"/",
      icon:<FiHome/>
    },
    {
      name:"Value Proposition",
      path:"/value-proposition",
      icon:<FiTrendingUp/>
    },
    {
      name:"MVP Features",
      path:"/mvp",
      icon:<FiTarget/>
    },
    {
      name:"Success Metrics",
      path:"/metrics",
      icon:<FiBarChart/>
    },
    {
      name:"Agent Requirements",
      path:"/agents",
      icon:<FiCpu/>
    },
    {
      name:"Live Report",
      path:"/report",
      icon:<FiActivity/>
    }
  ];

  return (
    <aside className="sidebar">
      <nav>
        {links.map((item)=>(
          <NavLink
            key={item.path}
            to={item.path}
            className={({isActive})=>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
