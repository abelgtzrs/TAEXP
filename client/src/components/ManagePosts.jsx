import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/ManagePosts.css";

function ManagePosts({ onEdit }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/posts/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data.data || []);
    } catch (err) {
      setError("Failed to fetch posts.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`/api/posts/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete post.");
    }
  };

  return (
    <div className="manage-posts-container">
      <h2 className="manage-posts-title">🗂 Manage Greentext Posts</h2>
      {isLoading && <p className="loading-msg">Loading...</p>}
      {error && <p className="error-msg">{error}</p>}

      <div className="post-list">
        {posts.map((post) => (
          <div key={post._id} className="post-row">
            <div className="post-info">
              <strong>Vol {post.volume_number}</strong>: {post.title}
            </div>
            <div className="post-actions">
              <button className="btn-edit" onClick={() => onEdit(post)}>
                Edit
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(post._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagePosts;
