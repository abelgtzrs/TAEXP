// components/AdminToolPanel.jsx
import React from 'react';
import './styles/AdminToolPanel.css';

function AdminToolPanel({ title, children, onClose }) {
  return (
    <div className="hud-panel">
      <div className="hud-panel-header">
        <span className="hud-panel-title">{title}</span>
        <div className="hud-panel-controls">
          <button onClick={onClose} className="hud-close-button">✖</button>
        </div>
      </div>
      <div className="hud-panel-body">{children}</div>
    </div>
  );
}

export default AdminToolPanel;
