// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';

// Page Components
import HomePage from './pages/HomePage';
import PostsPage from './pages/PostsPage';
import GlossaryPage from './pages/GlossaryPage';
import SinglePostPage from './pages/SinglePostPage';
import AdminPage from './pages/AdminPage';       // Your Admin Layout/Hub
import LoginPage from './pages/LoginPage';       // You'll create this

// Admin Section Components (placeholders or import from actual files)
// Assuming these will be in 'client/src/pages/admin/'
// import AdminDashboard from './pages/admin/AdminDashboard';
// import ManagePostsPage from './pages/admin/ManagePostsPage';
// import ManageGlossaryPage from './pages/admin/ManageGlossaryPage';
// import HabitTrackerPage from './pages/admin/HabitTrackerPage';
import AdminPostForm from './components/AdminPostForm'; // The form component

// Helper Components
import ProtectedRoute from './components/ProtectedRoute'; // You'll create this

import './App.css'; // For global styles, including Ophidic HUD elements if any

// --- Helper to get initial auth state (simplified) ---
const getInitialAuthState = () => {
  const userInfoString = localStorage.getItem('userInfo');
  if (userInfoString) {
    try {
      const userInfo = JSON.parse(userInfoString);
      // Optionally, add token expiration check here later
      return !!userInfo.token;
    } catch (e) {
      console.error("Error parsing userInfo from localStorage:", e);
      return false;
    }
  }
  return false;
};

function App() {
  // This state will manage the visibility of Login/Admin Hub links
  // In a real app, this would be driven by a global auth context or state manager
  const [isLoggedIn, setIsLoggedIn] = useState(getInitialAuthState());
  const location = useLocation(); // To re-check login state on navigation

  useEffect(() => {
    // Update login state if localStorage changes (e.g., after login/logout)
    setIsLoggedIn(getInitialAuthState());
  }, [location.pathname]); // Re-check when path changes

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => { // This function would be called from AdminPage
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    // Navigate to home or login page after logout
    // This navigation should ideally happen within the component triggering logout
  };

  // --- Placeholder components for Admin sections (can be imported later) ---
  const AdminDashboard = () => (
    <div style={{ color: '#A6B0C7', padding: '1rem' }}>
      <h2 style={{ color: '#00BFFF', fontFamily: "'Orbitron', sans-serif", marginBottom: '1rem' }}>ADMIN_DASHBOARD</h2>
      <p>System status: OPERATIONAL. Monitoring active feeds...</p>
      {/* Add more HUD-like elements here */}
    </div>
  );
  const ManagePostsPage = () => (
    <div style={{ color: '#A6B0C7', padding: '1rem' }}>
      <h2 style={{ color: '#00BFFF', fontFamily: "'Orbitron', sans-serif", marginBottom: '1rem' }}>POST_MANAGEMENT_INTERFACE</h2>
      <p>Content stream editor and archival tools.</p>
    </div>
  );
  const ManageGlossaryPage = () => (
    <div style={{ color: '#A6B0C7', padding: '1rem' }}>
      <h2 style={{ color: '#00BFFF', fontFamily: "'Orbitron', sans-serif", marginBottom: '1rem' }}>LEXICON_DATABASE_ACCESS</h2>
      <p>Glossary term definitions and cross-referencing.</p>
    </div>
  );
   const HabitTrackerPage = () => (
    <div style={{ color: '#A6B0C7', padding: '1rem' }}>
      <h2 style={{ color: '#00BFFF', fontFamily: "'Orbitron', sans-serif", marginBottom: '1rem' }}>PERSONNEL_PERFORMANCE_LOG</h2>
      <p>Daily directives and streak analysis.</p>
    </div>
  );


  return (
    <>
      {/* Main Navigation Bar - Styled with Ophidic HUD elements */}
      <nav style={{
        fontFamily: "'VT323', monospace", // Match Ophidic HUD font
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 1rem', 
        backgroundColor: 'rgba(0, 20, 0, 0.7)', // Dark green translucent panel
        borderBottom: '1px solid #00AA00', // HUD green border
        color: '#00FF00', // HUD green text
        minHeight: '60px',
        boxShadow: 'inset 0 -2px 5px rgba(0,255,0,0.1), 0 1px 3px rgba(0,0,0,0.3)'
      }}>
        <div className="nav-left-group">
          <Link to="/" style={{ marginRight: '15px', color: '#00FF00', textDecoration: 'none', letterSpacing: '0.05em' }}>HOME_BASE</Link>
          <Link to="/posts" style={{ marginRight: '15px', color: '#00FF00', textDecoration: 'none', letterSpacing: '0.05em' }}>ARCHIVES</Link>
          <Link to="/glossary" style={{ marginRight: '15px', color: '#00FF00', textDecoration: 'none', letterSpacing: '0.05em' }}>LEXICON</Link>
        </div>
        
        <div className="nav-site-title" style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: '1.2rem', 
          color: '#00FF00',
          textShadow: '0 0 5px #00FF00',
          textAlign: 'center'
        }}>
          The Abel Experience™
        </div>

        <div className="nav-right-group">
          {isLoggedIn ? (
            <Link to="/admin/dashboard" style={{ color: '#FFFF00', textDecoration: 'none', letterSpacing: '0.05em' }}>ADMIN_CONSOLE</Link>
            // Logout button is now primarily within AdminPage for better UX
          ) : (
            <Link to="/login" style={{ color: '#FFFF00', textDecoration: 'none', letterSpacing: '0.05em' }}>ADMIN_ACCESS</Link>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="content-container" style={{ /* Padding is handled by individual pages or AdminPage layout */ }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/:volumeNumber" element={<SinglePostPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />

          {/* Protected Admin Route - Renders AdminPage layout */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminPage /> 
              </ProtectedRoute>
            }
          >
            {/* Nested Routes within AdminPage, rendered in its <Outlet /> */}
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="new-post" element={<AdminPostForm />} />
            <Route path="manage-posts" element={<ManagePostsPage />} />
            <Route path="manage-glossary" element={<ManageGlossaryPage />} />
            <Route path="habit-tracker" element={<HabitTrackerPage />} />
            {/* Default route for /admin -> redirects to /admin/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} /> 
          </Route>
          
          {/* Fallback for any other undefined routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
