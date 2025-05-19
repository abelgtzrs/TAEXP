// client/src/components/AdminPostForm.jsx
import React, { useState } from 'react';
import axios from 'axios'; // Or your API service
// import './AdminPostForm.css'; // You'll create this for styling

// Helper function to get the auth token (implement this based on how you store it)
const getAuthToken = () => {
  // Example: localStorage.getItem('userInfo') might store { ..., token: '...' }
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo ? userInfo.token : null;
};

function AdminPostForm() {
  const [rawText, setRawText] = useState('');
  const [volumeNumber, setVolumeNumber] = useState('');
  const [tags, setTags] = useState(''); // Comma-separated
  const [status, setStatus] = useState('draft'); // Default to draft
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' }); // For success/error messages

  const parseGreentext = (fullText, volNum, inputTags, inputStatus) => {
    console.log("Starting to parse raw text:", fullText);
    const lines = fullText.split(/\r?\n/).map(line => line.trim());
    let postData = {
      volume_number: parseInt(volNum, 10),
      title: '',
      story_content_raw: '',
      blessings_intro: '',
      blessings_list: [],
      edition_footer: '',
      tags: inputTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      status: inputStatus,
    };

    if (isNaN(postData.volume_number)) {
        setMessage({ type: 'error', text: 'Volume Number must be a number.' });
        return null;
    }

    let currentSection = 'title'; // title, story, blessings_intro, blessings_list, footer
    let storyLines = [];
    let blessingLines = [];

    // Attempt to extract title from the first non-empty line if it matches the pattern
    const firstNonEmptyLine = lines.find(line => line !== '');
    if (firstNonEmptyLine) {
        const titleMatch = firstNonEmptyLine.match(/The Abel Experience™: Volume \d+ – (.*)/i);
        if (titleMatch && titleMatch[1]) {
            postData.title = titleMatch[1].trim();
            // Remove the title line from lines to process for story
            const titleLineIndex = lines.indexOf(firstNonEmptyLine);
            if (titleLineIndex > -1) lines.splice(titleLineIndex, 1);
        } else {
            // Fallback if pattern doesn't match, prompt user or handle differently
            console.warn("Could not automatically parse title from first line. User should verify.");
            // For now, we'll let the manual title field (if you add one) or a default take over
            // Or, you could decide the first line is always the title if no pattern
        }
    }
    
    // Attempt to extract edition footer from the last non-empty line
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i] !== '') {
            if (lines[i].startsWith("The Abel Experience™:") && lines[i].endsWith("Edition")) {
                postData.edition_footer = lines[i];
                lines.splice(i, 1); // Remove footer line
            }
            break; 
        }
    }
    
    // Process remaining lines
    for (const line of lines) {
      if (line.toLowerCase().startsWith("life is") && line.toLowerCase().includes("but at least i have:")) {
        currentSection = 'blessings_intro';
        postData.blessings_intro = line;
        continue;
      }

      if (currentSection === 'blessings_intro' && line !== '') {
        // After blessings_intro, next non-empty lines are blessings_list
        currentSection = 'blessings_list';
      }
      
      if (currentSection === 'blessings_list') {
        if (line === '') continue; // Skip empty lines within blessings section
        const blessingMatch = line.match(/^(.*?)\s*\((.*)\)\s*$/);
        if (blessingMatch) {
          blessingLines.push({ item: blessingMatch[1].trim(), description: `(${blessingMatch[2].trim()})` });
        } else if (line) { // Line without parenthesis, assume it's just an item
          blessingLines.push({ item: line.trim(), description: "()" }); // Add empty parenthesis as requested
        }
        continue;
      }

      // If not in blessings yet, it's part of the story (or title if not parsed)
      // We will assume anything before blessings_intro that isn't the title line is story
      if (currentSection !== 'blessings_intro' && currentSection !== 'blessings_list') {
         // Add '>' to every line for story_content_raw, including empty lines for spacing
        storyLines.push((line.startsWith(">") ? line : `> ${line.trim()}`));
      }
    }

    postData.story_content_raw = storyLines.join('\n');
    postData.blessings_list = blessingLines;

    // Basic validation after parsing
    if (!postData.title && !lines.find(line => line.toLowerCase().startsWith("be me"))) {
        // If title wasn't parsed and story doesn't start typically, it might be an issue
        console.warn("Title might be missing or story content is unusual.");
    }
    if (storyLines.length === 0) {
        setMessage({ type: 'error', text: 'Could not parse story content.' });
        return null;
    }

    console.log("Parsed post data:", postData);
    return postData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    if (!rawText.trim() || !volumeNumber.trim()) {
      setMessage({ type: 'error', text: 'Volume Number and Raw Text content are required.' });
      setIsLoading(false);
      return;
    }

    const parsedData = parseGreentext(rawText, volumeNumber, tags, status);

    if (!parsedData) {
      // Error message already set by parseGreentext
      setIsLoading(false);
      return;
    }
    
    // If title wasn't auto-parsed, you might want a manual title input
    // For now, ensure it's not empty or provide a default
    if (!parsedData.title) {
        // Example: prompt user or use a default
        const manualTitle = prompt("Could not auto-parse title. Please enter post subtitle:");
        if (!manualTitle) {
            setMessage({ type: 'error', text: 'Post subtitle is required.'});
            setIsLoading(false);
            return;
        }
        parsedData.title = manualTitle;
    }


    const token = getAuthToken();
    if (!token) {
      setMessage({ type: 'error', text: 'Authentication error: No token found. Please log in.' });
      setIsLoading(false);
      return;
    }

    try {
      // Replace with your actual API service call
      const response = await axios.post('/api/posts/admin', parsedData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMessage({ type: 'success', text: `Post "${response.data.data.title}" created successfully!` });
      setRawText(''); // Clear form on success
      setVolumeNumber('');
      setTags('');
      setStatus('draft');
    } catch (err) {
      console.error("Error creating post:", err.response?.data || err.message);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create post.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Basic styling for the form (move to AdminPostForm.css)
  const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '700px', margin: '2rem auto', padding: '2rem', backgroundColor: '#0D131C', border: '1px solid #00BFFF', borderRadius: '8px' };
  const labelStyle = { color: '#A6B0C7', marginBottom: '0.25rem', fontFamily: "'Share Tech Mono', monospace" };
  const inputStyle = { padding: '0.75rem', borderRadius: '4px', border: '1px solid #30363D', backgroundColor: '#161B22', color: '#E5E7EB', fontFamily: "'JetBrains Mono', monospace" };
  const textareaStyle = { ...inputStyle, minHeight: '300px', whiteSpace: 'pre-wrap' };
  const buttonStyle = { padding: '0.75rem 1.5rem', borderRadius: '4px', border: 'none', backgroundColor: '#FF8C00', color: 'white', fontFamily: "'Share Tech Mono', monospace", cursor: 'pointer', fontSize: '1rem', textTransform: 'uppercase' };
  const messageStyle = (type) => ({ padding: '1rem', borderRadius: '4px', margin: '1rem 0', color: 'white', backgroundColor: type === 'success' ? '#00AA00' : '#AA0000' });


  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ color: '#00BFFF', fontFamily: "'Orbitron', sans-serif", textAlign: 'center', fontSize: '1.8rem', letterSpacing: '0.05em' }}>Create New Greentext Post</h2>
      
      {message.text && (
        <div style={messageStyle(message.type)}>{message.text}</div>
      )}

      <div>
        <label htmlFor="volumeNumber" style={labelStyle}>Volume Number:</label>
        <input
          type="number"
          id="volumeNumber"
          value={volumeNumber}
          onChange={(e) => setVolumeNumber(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="rawText" style={labelStyle}>Paste Full Greentext (Title, Story, Blessings, Footer):</label>
        <textarea
          id="rawText"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          required
          placeholder="Paste the entire greentext content here..."
          style={textareaStyle}
        />
      </div>
      
      <div>
        <label htmlFor="tags" style={labelStyle}>Tags (comma-separated):</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="status" style={labelStyle}>Status:</label>
        <select 
          id="status" 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          style={inputStyle}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <button type="submit" disabled={isLoading} style={buttonStyle}>
        {isLoading ? 'Parsing & Submitting...' : 'Create Post'}
      </button>
    </form>
  );
}

export default AdminPostForm;
