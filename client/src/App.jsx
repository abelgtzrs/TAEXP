import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostsPage from './pages/PostsPage';
import GlossaryPage from './pages/GlossaryPage';
import SinglePostPage from './pages/SinglePostPage'; // <-- Import new page
import './App.css'; 

function App() {
  return (
    <>
      <nav style={{ marginBottom: '20px', padding: '10px', background: '#111827',
                   borderBottom: '1px solid #374151'}}>
        <Link to="/" style={{ marginRight: '15px', color: '#E5E7EB' }}>Home</Link>
        <Link to="/posts" style={{ marginRight: '15px', color: '#E5E7EB' }}>Posts</Link>
        <Link to="/glossary" style={{ marginRight: '15px', color: '#E5E7EB' }}>Glossary</Link>
      </nav>

      <div className="content-container" style={{ padding: '0 20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/:volumeNumber" element={<SinglePostPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
