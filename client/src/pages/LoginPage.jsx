// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Basic styling (move to CSS file later)
const pageStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', fontFamily: "'Inter', sans-serif", color: '#E5E7EB' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px', padding: '2rem', backgroundColor: '#1F2937', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' };
const inputStyle = { padding: '0.75rem', borderRadius: '4px', border: '1px solid #374151', backgroundColor: '#111827', color: '#E5E7EB' };
const buttonStyle = { padding: '0.75rem', borderRadius: '4px', border: 'none', backgroundColor: '#3B82F6', color: 'white', cursor: 'pointer', fontWeight: '600' };
const errorStyle = { color: '#EF4444', marginTop: '0.5rem', textAlign: 'center' };

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      // Store user info (including token) in localStorage (or context/state management)
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      console.log('Login successful, navigating to admin');
      navigate('/admin'); // Redirect to admin hub on successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      console.error('Login error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '2rem', color: '#00BFFF', marginBottom: '2rem' }}>Admin Login</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Logging In...' : 'Login'}
        </button>
        {error && <p style={errorStyle}>{error}</p>}
      </form>
    </div>
  );
}

export default LoginPage;
