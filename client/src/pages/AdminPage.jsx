// pages/AdminPage.jsx
import React, { useState } from "react";
import "./styles/AdminPage.css";
import HudWindow from "../components/HudWindow";
import AdminPostForm from "../components/AdminPostForm";
import AdminToolPanel from "../components/AdminToolPanel";
import RightSidebar from "../components/RightSidebar";
import ManagePosts from "../components/ManagePosts";

function AdminPage() {
  const [openWindows, setOpenWindows] = useState([]);

  const openWindow = (toolId) => {
    if (!openWindows.find((win) => win.id === toolId)) {
      setOpenWindows([...openWindows, { id: toolId, z: Date.now() }]);
    }
  };

  const closeWindow = (toolId) => {
    setOpenWindows(openWindows.filter((win) => win.id !== toolId));
  };

  const bringToFront = (toolId) => {
    setOpenWindows((windows) =>
      windows.map((win) =>
        win.id === toolId ? { ...win, z: Date.now() } : win
      )
    );
  };

  const getComponentForTool = (id) => {
    switch (id) {
      case "new-post":
        return <AdminPostForm />;
      case "manage-posts":
        return <ManagePosts onEdit={(post) => console.log("Edit:", post)} />;
      case "glossary":
        return <div>Glossary Editor</div>;
      case "habit":
        return <div>Habit Tracker</div>;
      default:
        return <div>Unknown Tool</div>;
    }
  };

  return (
    <div className="container-fluid admin-console px-0">
      <div className="row gx-0">
        {/* SIDEBAR */}
        <div className="col-auto bg-dark text-light vh-100 position-fixed sidebar-quantum">
          <div className="p-3 border-end border-info h-100 d-flex flex-column">
            <h5 className="text-info text-center mb-4">abelOS</h5>
            <button
              onClick={() => openWindow("new-post")}
              className="btn btn-outline-info mb-2 text-start"
            >
              New Post
            </button>
            <button
              onClick={() => openWindow("manage-posts")}
              className="btn btn-outline-info mb-2 text-start"
            >
              Manage Posts
            </button>
            <button
              onClick={() => openWindow("glossary")}
              className="btn btn-outline-info mb-2 text-start"
            >
              Glossary
            </button>
            <button
              onClick={() => openWindow("habit")}
              className="btn btn-outline-info mb-2 text-start"
            >
              Habit Tracker
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div
          className="col"
          style={{ marginLeft: "250px", paddingRight: "300px" }}
        >
          <div className="console-background position-relative vh-100 overflow-hidden p-3">
            {openWindows.map((win) => (
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

        {/* RIGHT SIDEBAR */}
        <div className="col-auto position-fixed end-0 top-0 vh-100 bg-black border-start border-info d-none d-md-block right-sidebar-quantum">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
