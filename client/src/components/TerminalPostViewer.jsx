// client/src/components/TerminalPostViewer.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import './styles/TerminalPostViewer.css'; // Import the CSS

// Configuration for the Typewriter Effect
const TYPE_SPEED_MS = 40; // Slightly faster
const PAUSE_MS_SHORT = 80;
const PAUSE_MS_LONG = 250;
const BACKSPACE_CHANCE = 0.02; // Reduced chance
const GLITCH_CHANCE = 0.01;  // Reduced chance
const GLITCH_CHARS = "!@#%^*_+-=[]{}|;:,./<>?";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function TerminalPostViewer({ postData }) {
  const storyOutputRef = useRef(null);
  const cursorRef = useRef(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const animationFrameId = useRef(null); // For cleanup

  const typeWriter = useCallback(async () => {
    const storyOutputElement = storyOutputRef.current;
    const cursorElement = cursorRef.current;
    if (!storyOutputElement || !cursorElement || !postData?.story_content_raw) return;

    storyOutputElement.innerHTML = ''; // Clear previous content
    cursorElement.style.display = 'inline-block';
    cursorElement.style.animation = 'blink-animation 0.9s step-end infinite';
    setIsTypingComplete(false);

    const storyLinesRaw = postData.story_content_raw || "";
    const G_STORY_LINES = storyLinesRaw.split(/\r?\n/);

    for (let lineIndex = 0; lineIndex < G_STORY_LINES.length; lineIndex++) {
      const lineText = G_STORY_LINES[lineIndex];
      const p = document.createElement('p');
      storyOutputElement.appendChild(p);

      if (lineText.trim() === "---") {
        const hr = document.createElement('hr');
        p.appendChild(hr);
        await delay(PAUSE_MS_SHORT);
        storyOutputElement.appendChild(cursorElement); // Move cursor below hr
        continue;
      }
      
      if (lineText.trim() === "") {
        p.innerHTML = '&nbsp;'; // Preserve line height for empty lines
        await delay(PAUSE_MS_SHORT);
      } else {
        let currentLineTextContent = '';
        let currentLineHTML = '';
        
        let isGreentextLine = lineText.startsWith(">");
        let textToType = isGreentextLine ? lineText.substring(1).trimStart() : lineText; // Trim leading space if any after '>'
        
        if (isGreentextLine) {
          currentLineHTML += '<span class="terminal-greentext-prefix">&gt;</span>';
        }

        for (let charIndex = 0; charIndex < textToType.length; charIndex++) {
          const char = textToType[charIndex];
          
          if (Math.random() < GLITCH_CHANCE && char !== ' ') {
            const tempGlitchHTML = currentLineHTML + 
                                   '<span class="terminal-greentext-line">' + currentLineTextContent + '</span>' +
                                   `<span class="terminal-glitch-effect">${GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]}</span>`;
            p.innerHTML = tempGlitchHTML;
            p.appendChild(cursorElement);
            await delay(100); 
          }

          if (charIndex > 0 && Math.random() < BACKSPACE_CHANCE && char !== ' ' && currentLineTextContent.length > 0) {
            currentLineTextContent = currentLineTextContent.slice(0, -1);
            p.innerHTML = currentLineHTML + '<span class="terminal-greentext-line">' + currentLineTextContent + '</span>';
            p.appendChild(cursorElement);
            await delay(PAUSE_MS_SHORT * 2);
          }
          
          currentLineTextContent += char;
          p.innerHTML = currentLineHTML + '<span class="terminal-greentext-line">' + currentLineTextContent + '</span>';
          p.appendChild(cursorElement); 

          await delay(TYPE_SPEED_MS + (Math.random() * PAUSE_MS_SHORT / 3));
        }
      }
      storyOutputElement.appendChild(cursorElement);
      await delay(PAUSE_MS_LONG);    
    }
    setIsTypingComplete(true);
    if (cursorElement) {
        cursorElement.style.animation = 'none'; // Stop blinking
        cursorElement.style.opacity = '0';    // Hide cursor
    }
  }, [postData]); // Dependency: re-run if postData changes

  useEffect(() => {
    // Start animation when component mounts and postData is available
    animationFrameId.current = requestAnimationFrame(typeWriter);
    
    // Cleanup function
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      // Ensure cursor is hidden if component unmounts mid-animation
      if (cursorRef.current) {
        cursorRef.current.style.display = 'none';
      }
    };
  }, [typeWriter]); // Rerun effect if typeWriter function identity changes (due to postData change)


  if (!postData) return <p className="terminal-container">Awaiting transmission...</p>;

  return (
    <div className="terminal-container">
      <div className="terminal-scanlines"></div> {/* Can be ::before on .terminal-container */}

      <header className="terminal-post-header">
        <h1 className="terminal-post-title">
          {postData.full_title_generated || `The Abel Experience™ Volume ${postData.volume_number} – ${postData.title}`}
        </h1>
      </header>

      <div className="terminal-story-content-wrapper">
        <div ref={storyOutputRef} className="story-output">
          {/* Typewriter content goes here */}
        </div>
        <span ref={cursorRef} id="terminal-typing-cursor"></span>
      </div>
      
      <div className="terminal-blessings-section">
        <p className="terminal-blessings-intro">
          <span className="prompt-prefix">SYS_MSG: </span>{postData.blessings_intro}
        </p>
        <ul className="terminal-blessings-list"> 
          {postData.blessings_list && postData.blessings_list.map((blessing, index) => (
            <li key={index}>
              <span className="terminal-blessing-item-prompt">*</span>
              <span className="terminal-blessing-item-name">{blessing.item}:</span>
              {blessing.description && (
                <span className="terminal-blessing-description">
                    <span className="comment-prefix">// </span>{blessing.description}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <p className="terminal-edition-footer">
        {postData.edition_footer}
      </p>
    </div>
  );
}

export default TerminalPostViewer;
