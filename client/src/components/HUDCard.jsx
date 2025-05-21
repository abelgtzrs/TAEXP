// client/src/components/HUDCard.jsx
import React from "react";

function HUDCard({ title, children }) {
  return (
    <div className="card border-info shadow-sm mb-4">
      <div className="card-header bg-black text-info fw-bold">{title}</div>
      <div className="card-body bg-dark text-light">{children}</div>
    </div>
  );
}

export default HUDCard;
