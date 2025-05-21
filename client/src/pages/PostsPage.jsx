import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError('');
        // This request will be proxied by Vite to your backend (e.g., http://localhost:5000/api/posts)
        const response = await axios.get('/api/posts'); 
        setPosts(response.data.data || []); // Assuming backend sends { message: '...', data: [...] }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Greentext Posts</h2>
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post._id || post.volume_number}>
              <li key={post._id || post.volume_number}>
                <RouterLink to={`/posts/${post.volume_number}`}> {/* Link to single post view */}
                  <h3>{post.full_title_generated || `Volume ${post.volume_number}: ${post.title}`}</h3>
                </RouterLink>
              </li>
            </li>
          ))}
        </ul>
      ) : (
        <p>No published posts found. (Or the API/proxy isn't working!)</p>
      )}
    </div>
  );
}

export default PostsPage;