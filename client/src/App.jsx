// client/src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import PostsPage from "./pages/PostsPage";
import GlossaryPage from "./pages/GlossaryPage";
import SinglePostPage from "./pages/SinglePostPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import AdminPostForm from "./components/AdminPostForm";
import ProtectedRoute from "./components/ProtectedRoute";
import QuantumLayout from "./layouts/QuantumLayout";

import "./App.css";

// Helper: check auth
const getInitialAuthState = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return !!userInfo?.token;
  } catch {
    return false;
  }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(getInitialAuthState());
  const [now, setNow] = useState(new Date());
  const location = useLocation();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Refresh login state on route change
  useEffect(() => {
    setIsLoggedIn(getInitialAuthState());
  }, [location.pathname]);

  const timeString = now.toLocaleTimeString("en-US", { hour12: false });

  return (
    <>
      <nav className="hud-top-bar">
        <div className="hud-nav-section hud-nav-center">
          <span className="hud-site-title">The Abel Experience™</span>
        </div>
      </nav>
      <nav className="hud-nav">
        <div className="hud-nav-section hud-nav-left">
          <Link to="/" className="hud-link">
            ROOT_INTERFACE
          </Link>
          <Link to="/posts" className="hud-link">
            ARCHIVE_DB
          </Link>
          <Link to="/glossary" className="hud-link">
            TERMINOLOGY_DB
          </Link>
        </div>

        <div className="hud-nav-section hud-nav-right">
          {isLoggedIn ? (
            <Link to="/admin/dashboard" className="hud-link hud-link-admin">
              ADMIN_CONSOLE
            </Link>
          ) : (
            <Link to="/login" className="hud-link hud-link-admin">
              ADMIN_ACCESS
            </Link>
          )}
        </div>

        <div className="hud-status-bar">
          <span className="hud-status-item">SYS_STATUS: OPERATIONAL</span>
          <span className="hud-status-item">DATA_REPOSITORY: CONNECTED</span>
          <span className="hud-status-item">
            TEMPORAL_SYNCHRONIZATION: {timeString}
          </span>
          {isLoggedIn && (
            <span className="hud-status-item">
              AUTHENTICATION_TOKEN: VALIDATED
            </span>
          )}
        </div>
      </nav>

      {/* CONTENT (push down below fixed HUD) */}
      <div className="content-container">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/:volumeNumber" element={<SinglePostPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />}
          />

          {/* Admin HUD */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <QuantumLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="new-post" element={<AdminPostForm />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
