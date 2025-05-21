// client/src/layouts/AdminLayout.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./styles/AdminLayout.css"; // For custom tweaks (optional)

function AdminLayout() {
  return (
    <div className="admin-layout d-flex">
      {/* SIDEBAR */}
      <nav className="sidebar bg-dark text-light position-fixed vh-100 p-3">
        <div className="sidebar-header mb-4">
          <h4 className="text-info">⚡ A.X. HUD</h4>
        </div>
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
              ✅ Habits
            </Link>
          </li>
        </ul>
      </nav>

      {/* MAIN AREA */}
      <div
        className="content-wrapper flex-grow-1"
        style={{ marginLeft: "250px" }}
      >
        {/* NAVBAR */}
        <nav
          className="navbar navbar-expand-lg navbar-dark bg-black px-4 shadow-sm fixed-top"
          style={{ left: "250px", zIndex: 1030 }}
        >
          <div className="container-fluid">
            <span className="navbar-brand text-info">
              The Abel Experience™ Console
            </span>
          </div>
        </nav>

        {/* PADDING BELOW FIXED NAV */}
        <div className="container-fluid mt-5 pt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
