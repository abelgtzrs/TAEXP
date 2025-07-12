// layouts/QuantumGrid.jsx
import React from "react";
import "./QuantumGrid.css";

function QuantumGrid({ children }) {
  return (
    <div className="quantum-grid container-fluid p-4">
      <div className="row g-4">{children}</div>
    </div>
  );
}

export default QuantumGrid;
