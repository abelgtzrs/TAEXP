// client/src/pages/AdminPage.jsx
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './styles/AdminPage.css';

// Basic styling (move to CSS file later)
const adminPageStyle = { display: 'flex', minHeight: 'calc(100vh - 100px)', fontFamily: "'Roboto Mono', monospace" };
const sidebarStyle = { 
    width: '250px', 
    background: '#0D131C', // Dark sci-fi panel
    padding: '1.5rem', 
    borderRight: '1px solid rgba(0, 191, 255, 0.3)', /* Glowing cyan border */
    color: '#A6B0C7'
};
const navLinkStyle = { 
    display: 'block', 
    color: '#A6B0C7', 
    textDecoration: 'none', 
    padding: '0.75rem 1rem', 
    margin: '0.5rem 0',
    borderRadius: '3px',
    border: '1px solid transparent',
    transition: 'all 0.2s ease-out'
};
const navLinkHoverStyle = { // Combine this with :hover in CSS
    backgroundColor: 'rgba(0, 191, 255, 0.1)',
    borderColor: 'rgba(0, 191, 255, 0.4)',
    color: '#00BFFF'
};
const contentAreaStyle = { flexGrow: 1, padding: '2rem', background: '#0A0F14' /* Slightly different dark for content */ };
const logoutButtonStyle = { ...navLinkStyle, color: '#FF8C00', borderColor: 'rgba(255, 140, 0, 0.5)'};

function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo'); // Clear auth token
    navigate('/login'); // Redirect to login
  };

  return (
    <div style={adminPageStyle}>
      <aside style={sidebarStyle}>
        <h2 style={{ fontFamily: "'Orbitron', sans-serif", color: '#00BFFF', marginBottom: '2rem', fontSize: '1.5rem', textAlign: 'center' }}>Admin Hub</h2>
        <nav>
          <Link 
            to="/admin/dashboard" 
            style={navLinkStyle} 
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = navLinkHoverStyle.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/new-post" 
            style={navLinkStyle}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = navLinkHoverStyle.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Create New Post
          </Link>
          <Link 
            to="/admin/manage-posts" 
            style={navLinkStyle}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = navLinkHoverStyle.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Manage Posts
          </Link>
          <Link 
            to="/admin/manage-glossary" 
            style={navLinkStyle}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = navLinkHoverStyle.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Manage Glossary
          </Link>
          <Link 
            to="/admin/habit-tracker" 
            style={navLinkStyle}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = navLinkHoverStyle.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Habit Tracker
          </Link>
          {/* Add more links as you develop features */}
        </nav>
        <button 
            onClick={handleLogout} 
            style={{...logoutButtonStyle, marginTop: 'auto', width: '100%'}}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 140, 0, 0.15)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
            Logout
        </button>
      </aside>
      <main style={contentAreaStyle}>
        <Outlet /> {/* Nested routes will render their components here */}
      </main>
    </div>
  );
}

export default AdminPage;
