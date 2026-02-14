import { useState } from "react";
import "./Sidebar.css";

type SidebarProps = {
  onLogout: () => void;
};

function Sidebar({ onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <img
            src="/bloom-life-logo.png"
            alt="Bloom Life Logo"
            className="sidebar-logo"
          />
          {!isCollapsed && (
            <div>
              <h1>Bloom Life</h1>
              <p>Admin Panel</p>
            </div>
          )}
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Menu</div>
          <a href="#inventory" className="nav-item active">
            <span className="nav-icon">📦</span>
            {!isCollapsed && <span>Inventory</span>}
          </a>
          <a href="#admins" className="nav-item">
            <span className="nav-icon">👥</span>
            {!isCollapsed && <span>Admins</span>}
          </a>
          <a href="#analytics" className="nav-item">
            <span className="nav-icon">📊</span>
            {!isCollapsed && <span>Analytics</span>}
          </a>
          <a href="#settings" className="nav-item">
            <span className="nav-icon">⚙️</span>
            {!isCollapsed && <span>Settings</span>}
          </a>
        </div>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout} title="Sign out">
          <span className="logout-icon">🚪</span>
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
