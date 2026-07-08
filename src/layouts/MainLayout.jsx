import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../styles/layout.css";

export default function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
}
