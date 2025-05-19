// components/HudWindow.jsx
import React, { useState, useRef } from 'react';
import './styles/HudWindow.css';

function HudWindow({ title, children, onClose, onFocus, zIndex }) {
  const [position, setPosition] = useState({ x: 200, y: 100 });
  const windowRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const startDrag = (e) => {
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
    onFocus();
  };

  const onDrag = (e) => {
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const stopDrag = () => {
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
  };

  return (
    <div
      className="hud-window"
      style={{ top: position.y, left: position.x, zIndex }}
      ref={windowRef}
      onMouseDown={onFocus}
    >
      <div className="hud-window-header" onMouseDown={startDrag}>
        <span>{title}</span>
        <button onClick={onClose}>✖</button>
      </div>
      <div className="hud-window-body">{children}</div>
    </div>
  );
}

export default HudWindow;
