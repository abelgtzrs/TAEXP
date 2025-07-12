// layouts/QuantumLayout.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./styles/QuantumLayout.css";

function QuantumLayout() {
  return (
    <div className="quantum-layout d-flex">
      {/* === LEFT SIDEBAR === */}
      <aside className="quantum-sidebar bg-dark text-light position-fixed vh-100 p-3">
        <h5 className="text-info text-center mb-4">⚡ A.X. HUD</h5>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/admin/dashboard" className="nav-link text-light">
              📊 Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/new-post" className="nav-link text-light">
              📝 New Post
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/manage-posts" className="nav-link text-light">
              🗂 Manage Posts
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/manage-glossary" className="nav-link text-light">
              📚 Glossary
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/habit-tracker" className="nav-link text-light">
              ✅ Habit Tracker
            </Link>
          </li>
        </ul>
      </aside>

      {/* === MAIN SECTION === */}
      <div
        className="flex-grow-1 content-area"
        style={{ marginLeft: "250px", paddingRight: "300px" }}
      >
        {/* === TOP NAVBAR === */}
        <nav
          className="navbar navbar-dark bg-black px-4 shadow-sm fixed-top"
          style={{ left: "250px", zIndex: 1030 }}
        >
          <div className="container-fluid">
            <span className="navbar-brand text-info">
              The Abel Experience™ Console
            </span>
          </div>
        </nav>

        {/* === DYNAMIC PAGE CONTENT === */}
        <div className="main-content mt-5 pt-4 px-4">
          <Outlet />
        </div>
      </div>

      {/* === RIGHT SIDEBAR (optional stats panel) === */}
      <aside
        className="quantum-right-sidebar bg-black border-start text-light d-none d-md-block position-fixed end-0 top-0 vh-100 p-3"
        style={{ width: "300px" }}
      >
        <h6 className="text-secondary">System Status</h6>
        <div className="mt-3">
          <p className="small text-muted mb-1">Real Madrid: 3 - 1</p>
          <p className="small text-muted mb-1">Dodgers: 5 - 4</p>
          <p className="small text-muted mb-1">Mets: 2 - 2</p>
        </div>
      </aside>
    </div>
  );
}

export default QuantumLayout;
