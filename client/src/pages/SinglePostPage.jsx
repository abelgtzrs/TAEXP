// client/src/pages/SinglePostPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TerminalPostViewer from '../components/TerminalPostViewer'; // We'll create this next

function SinglePostPage() {
  const { volumeNumber } = useParams(); // Get volumeNumber from URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError('');
        // Request will be proxied by Vite to e.g., http://localhost:5000/api/posts/101
        const response = await axios.get(`/api/posts/${volumeNumber}`);
        setPost(response.data.data); // Assuming backend sends { message: '...', data: {...postObject} }
      } catch (err) {
        console.error(`Error fetching post volume ${volumeNumber}:`, err);
        setError(err.response?.data?.message || err.message || `Failed to fetch post volume ${volumeNumber}.`);
      } finally {
        setLoading(false);
      }
    };

    if (volumeNumber) {
      fetchPost();
    }
  }, [volumeNumber]); // Re-fetch if volumeNumber changes

  if (loading) return <p style={{ color: '#00FF00', fontFamily: "'VT323', monospace" }}>LOADING SYSTEM DATA FOR VOLUME {volumeNumber}...</p>;
  if (error) return <p style={{ color: 'red', fontFamily: "'VT323', monospace" }}>ERROR: {error}</p>;
  if (!post) return <p style={{ color: '#00FF00', fontFamily: "'VT323', monospace" }}>Post not found.</p>;

  return (
    <div className="single-post-page">
      {/* This page will eventually have the "Ophidic HUD" exterior framing the terminal */}
      {/* For now, it directly renders the TerminalPostViewer */}
      <TerminalPostViewer postData={post} />
    </div>
  );
}

export default SinglePostPage;
