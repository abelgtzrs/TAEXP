import React from "react";
import "./styles/RightSidebar.css";

function RightSidebar() {
  return (
    <aside className="hud-right-sidebar">
      <h3 className="hud-sidebar-title">Sports Feed</h3>
      <div className="hud-sport-block">
        <h4>Real Madrid</h4>
        <p>W 2–0 vs Sevilla</p>
      </div>
      <div className="hud-sport-block">
        <h4>LA Dodgers</h4>
        <p>L 5–9 vs Diamondbacks</p>
      </div>
      <div className="hud-sport-block">
        <h4>NY Mets</h4>
        <p>L 0–2 vs Red Sox</p>
      </div>
    </aside>
  );
}

export default RightSidebar;
