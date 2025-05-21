// pages/AdminPage.jsx
import React, { useState } from 'react';
import './styles/AdminPage.css';
import HudWindow from '../components/HudWindow';
import AdminPostForm from '../components/AdminPostForm';
import AdminToolPanel from '../components/AdminToolPanel';
import ManagePosts from '../components/ManagePosts';

function AdminPage() {
  const [openWindows, setOpenWindows] = useState([]);

  const openWindow = (toolId) => {
    if (!openWindows.find(win => win.id === toolId)) {
      setOpenWindows([...openWindows, { id: toolId, z: Date.now() }]);
    }
  };

  const closeWindow = (toolId) => {
    setOpenWindows(openWindows.filter(win => win.id !== toolId));
  };

  const bringToFront = (toolId) => {
    setOpenWindows(windows =>
      windows.map(win =>
        win.id === toolId ? { ...win, z: Date.now() } : win
      )
    );
  };

  const getComponentForTool = (id) => {
    switch (id) {
      case 'new-post': return <AdminPostForm />;
      case 'manage-posts': return <ManagePosts onEdit={(post) => console.log('Edit:', post)} />;
      case 'glossary': return <div>Glossary Editor</div>;
      case 'habit': return <div>Habit Tracker</div>;
      default: return <div>Unknown Tool</div>;
    }
  };

  return (
    <div className="admin-console">
      <aside className="console-sidebar">
        <h2 className="console-title">abelOS HUD</h2>
        <button onClick={() => openWindow('new-post')} className="console-link">New Post</button>
        <button onClick={() => openWindow('manage-posts')} className="console-link">Manage Posts</button>
        <button onClick={() => openWindow('glossary')} className="console-link">Glossary</button>
        <button onClick={() => openWindow('habit')} className="console-link">Habit Tracker</button>
      </aside>

      <div className="console-background">
        {openWindows.map(win => (
          <HudWindow
            key={win.id}
            zIndex={win.z}
            onFocus={() => bringToFront(win.id)}
            onClose={() => closeWindow(win.id)}
            title={win.id}
          >
              {getComponentForTool(win.id)}
          </HudWindow>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;
