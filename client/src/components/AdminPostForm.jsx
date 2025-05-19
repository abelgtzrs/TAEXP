import React, { useState, useMemo } from 'react';
import axios from 'axios';
import AdminToolPanel from './AdminToolPanel';
import './styles/AdminPostForm.css';

const getAuthToken = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo ? userInfo.token : null;
};

function AdminPostForm() {
  const [rawText, setRawText] = useState('');
  const [volumeNumber, setVolumeNumber] = useState('0');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const parseGreentext = (fullText, volNum, inputTags, inputStatus) => {
    const lines = fullText.split(/\r?\n/).map(line => line.trim());
    let postData = {
      volume_number: parseInt(volNum, 10),
      title: '',
      story_content_raw: '',
      blessing_intro: '',
      blessing_list: [],
      edition_footer: '',
      tags: inputTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      status: inputStatus,
    };

    if (isNaN(postData.volume_number)) return 1;

    let currentSection = 'title';
    let storyLines = [];
    let blessingLines = [];

    const firstNonEmptyLine = lines.find(line => line !== '');
    if (firstNonEmptyLine) {
      const titleMatch = firstNonEmptyLine.match(/The Abel Experience™: Volume \d+ – (.*)/i);
      if (titleMatch && titleMatch[1]) {
        postData.title = titleMatch[1].trim();
        const titleLineIndex = lines.indexOf(firstNonEmptyLine);
        if (titleLineIndex > -1) lines.splice(titleLineIndex, 1);
      }
    }

    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i] !== '') {
        if (lines[i].startsWith("The Abel Experience™:") && lines[i].endsWith("Edition")) {
          postData.edition_footer = lines[i];
          lines.splice(i, 1);
        }
        break;
      }
    }

    for (const line of lines) {
      if (line.toLowerCase().startsWith("life is") && line.toLowerCase().includes("but at least i have:")) {
        currentSection = 'blessing_intro';
        postData.blessing_intro = line;
        continue;
      }

      if (currentSection === 'blessing_intro' && line !== '') {
        currentSection = 'blessing_list';
      }

      if (currentSection === 'blessing_list') {
        if (line === '') continue;
        const blessingMatch = line.match(/^(.*?)\s*\((.*)\)\s*$/);
        if (blessingMatch) {
          blessingLines.push({ item: blessingMatch[1].trim(), description: `(${blessingMatch[2].trim()})` });
        } else {
          blessingLines.push({ item: line.trim(), description: "()" });
        }
        continue;
      }

      if (currentSection !== 'blessing_intro' && currentSection !== 'blessing_list') {
        storyLines.push(line.startsWith(">") ? line : `> ${line.trim()}`);
      }
    }

    postData.story_content_raw = storyLines.join('\n');
    postData.blessing_list = blessingLines;

    if (!postData.title && !lines.find(line => line.toLowerCase().startsWith("be me"))) return null;
    if (storyLines.length === 0) return null;

    return postData;
  };

  const parsedPayload = useMemo(() => {
    if (!rawText || !volumeNumber) return null;
    return parseGreentext(rawText, volumeNumber, tags, status);
  }, [rawText, volumeNumber, tags, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    const parsedData = parsedPayload;
    if (!parsedData) {
      setMessage({ type: 'error', text: 'Parsing failed or incomplete fields.' });
      setIsLoading(false);
      return;
    }

    if (!parsedData.title) {
      const manualTitle = prompt("Title not found. Enter subtitle:");
      if (!manualTitle) {
        setMessage({ type: 'error', text: 'Subtitle is required.' });
        setIsLoading(false);
        return;
      }
      parsedData.title = manualTitle;
    }

    const token = getAuthToken();
    if (!token) {
      setMessage({ type: 'error', text: 'Authentication token missing. Please log in again.' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/posts/admin', parsedData, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setMessage({ type: 'success', text: `Post "${response.data.data.title}" created successfully.` });
      setRawText('');
      setVolumeNumber('');
      setTags('');
      setStatus('draft');
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to create post.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
      <div className="hud-form-wrapper">
      <form onSubmit={handleSubmit} className="hud-form">
        <h2 className="hud-form-title">Create New Greentext Post</h2>
        {message.text && <div className={`hud-message ${message.type}`}>{message.text}</div>}

        <label className="hud-label">Volume Number:</label>
        <input type="number" value={volumeNumber} onChange={(e) => setVolumeNumber(e.target.value)} required className="hud-input" />

        <label className="hud-label">Paste Full Greentext:</label>
        <textarea value={rawText} onChange={(e) => setRawText(e.target.value)} required className="hud-textarea" placeholder="Paste the entire greentext content here..." />

        <label className="hud-label">Tags (comma-separated):</label>
        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="hud-input" />

        <label className="hud-label">Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="hud-input">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <button type="submit" disabled={isLoading} className="hud-submit">
          {isLoading ? 'Submitting...' : 'Create Post'}
        </button>
      </form>

      {/* JSON Preview */}
      <div className="hud-preview">
        <h3 className="hud-preview-title">JSON Payload Preview</h3>
        <pre className="hud-terminal">
          {parsedPayload ? JSON.stringify(parsedPayload, null, 2) : '// Waiting for input...'}
        </pre>
      </div>
  </div>
  );
}

export default AdminPostForm;
