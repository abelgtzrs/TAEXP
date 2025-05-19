// client/src/pages/admin/AdminDashboard.jsx
import React from 'react';

const hudTextStyle = { color: '#A6B0C7', fontFamily: "'Roboto Mono', monospace" };

function AdminDashboard() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ color: '#00BFFF', fontFamily: "'Orbitron', sans-serif", marginBottom: '1rem' }}>SYSTEM DASHBOARD</h2>
      <p style={hudTextStyle}>Welcome, Admin. All systems operational.</p>
      <p style={hudTextStyle}>This area will display key metrics, recent activity, and quick access HUD elements.</p>
      {/* Placeholder for HUD elements */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ border: '1px solid #005500', padding: '1rem', minWidth: '200px', backgroundColor: 'rgba(0,20,0,0.5)'}}>
            <h4 style={{color: '#00FF00', margin: '0 0 0.5rem 0'}}>POST COUNT</h4>
            <p style={{fontSize: '1.5rem', color: '#00FF00', margin: 0}}>...loading...</p>
        </div>
        <div style={{ border: '1px solid #005500', padding: '1rem', minWidth: '200px', backgroundColor: 'rgba(0,20,0,0.5)'}}>
            <h4 style={{color: '#00FF00', margin: '0 0 0.5rem 0'}}>GLOSSARY TERMS</h4>
            <p style={{fontSize: '1.5rem', color: '#00FF00', margin: 0}}>...loading...</p>
        </div>
      </div>
    </div>
  );
}
export default AdminDashboard;