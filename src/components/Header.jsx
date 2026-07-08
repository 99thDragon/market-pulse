import { FiMenu, FiSearch } from "react-icons/fi";
import "../styles/header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <h2>Market Pulse</h2>
        <span>Documentation</span>
      </div>

      <div className="header-search">
        <FiSearch size={18}/>
        <input
          type="text"
          placeholder="Search documentation..."
        />
      </div>

      <button
        className="mobile-menu"
        aria-label="Open menu"
      >
        <FiMenu size={24}/>
      </button>
    </header>
  );
}
