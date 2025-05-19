// client/src/components/TerminalPostViewer.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import './TerminalPostViewer.css'; // Ensure your CSS is imported

// Configuration Constants
const TYPE_SPEED_MS = 45;
const PAUSE_MS_SHORT = 90;
const PAUSE_MS_LONG = 280;
// const BACKSPACE_CHANCE = 0.025; // Removed backspace feature
const GLITCH_CHANCE = 0.012;
const GLITCH_CHARS = "!@#%^*_+-=[]{}|;:,./<>?";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function TerminalPostViewer({ postData }) {
  const storyOutputRef = useRef(null);
  const cursorRef = useRef(null);
  const [isTypingStory, setIsTypingStory] = useState(false); // Still useful to know when animation is active
  
  const isAnimatingRef = useRef(false);
  const animationControllerRef = useRef({ abort: false });

  const typeStoryContent = useCallback(async (currentPostData, controller) => {
    if (!storyOutputRef.current || !cursorRef.current || !currentPostData?.story_content_raw) {
      console.error('[Typewriter] Aborting: Missing refs or story content.');
      setIsTypingStory(false); // Ensure state is reset if we abort early
      if(cursorRef.current) cursorRef.current.style.display = 'none';
      return;
    }

    if (isAnimatingRef.current && !controller.abort) { // Check if another instance is running and not this one trying to abort
      console.log('[Typewriter] Animation already in progress by another call. Aborting new start.');
      return;
    }
    isAnimatingRef.current = true;
    controller.abort = false; 

    console.log('[Typewriter] Starting animation for volume:', currentPostData.volume_number);
    setIsTypingStory(true);

    const storyOutputElement = storyOutputRef.current;
    const cursorElement = cursorRef.current;
    
    storyOutputElement.innerHTML = ''; 
    cursorElement.style.display = 'inline-block';
    cursorElement.style.animation = 'blink-animation 0.9s step-end infinite';
    cursorElement.style.opacity = '1';

    const storyLinesRaw = currentPostData.story_content_raw || "";
    const G_STORY_LINES = storyLinesRaw.split(/\r?\n/);

    for (let lineIndex = 0; lineIndex < G_STORY_LINES.length; lineIndex++) {
      if (controller.abort) {
        console.log('[Typewriter] Animation aborted for volume:', currentPostData.volume_number);
        break; // Exit loop if aborted
      }

      const lineText = G_STORY_LINES[lineIndex];
      const p = document.createElement('p');
      storyOutputElement.appendChild(p);

      if (lineText.trim() === "---") {
        const hr = document.createElement('hr');
        p.appendChild(hr);
        await delay(PAUSE_MS_SHORT);
        storyOutputElement.appendChild(cursorElement); 
        continue;
      }
      
      if (lineText.trim() === "") {
        p.innerHTML = '&nbsp;';
        await delay(PAUSE_MS_SHORT);
      } else {
        let currentLineTextOnly = ''; 
        let prefixHTML = '';
        
        let isGreentextLine = lineText.startsWith(">");
        let textToType = isGreentextLine ? lineText.substring(1).trimStart() : lineText;
        
        if (isGreentextLine) {
          prefixHTML = '<span class="terminal-greentext-prefix">&gt;</span>';
        }

        for (let charIndex = 0; charIndex < textToType.length; charIndex++) {
          if (controller.abort) {
            console.log('[Typewriter] Animation aborted mid-line for volume:', currentPostData.volume_number);
            break; // Exit inner loop
          }

          const char = textToType[charIndex];
          
          if (Math.random() < GLITCH_CHANCE && char !== ' ') {
            p.innerHTML = prefixHTML + 
                          '<span class="terminal-greentext-line">' + currentLineTextOnly + '</span>' +
                          `<span class="terminal-glitch-effect">${GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]}</span>`;
            p.appendChild(cursorElement);
            await delay(100); 
          }

          // Backspace logic removed
          // if (charIndex > 0 && Math.random() < BACKSPACE_CHANCE && char !== ' ' && currentLineTextOnly.length > 0) {
          //   currentLineTextOnly = currentLineTextOnly.slice(0, -1);
          //   p.innerHTML = prefixHTML + '<span class="terminal-greentext-line">' + currentLineTextOnly + '</span>';
          //   p.appendChild(cursorElement);
          //   await delay(PAUSE_MS_SHORT * 2);
          // }
          
          currentLineTextOnly += char;
          p.innerHTML = prefixHTML + '<span class="terminal-greentext-line">' + currentLineTextOnly + '</span>';
          p.appendChild(cursorElement); 

          await delay(TYPE_SPEED_MS + (Math.random() * PAUSE_MS_SHORT / 3));
        }
      }
      if (controller.abort) break; // Check again after inner loop
      storyOutputElement.appendChild(cursorElement); 
      await delay(PAUSE_MS_LONG);    
    }
    
    if (!controller.abort) {
      console.log('[Typewriter] Animation complete for volume:', currentPostData.volume_number);
      if (cursorElement) {
          cursorElement.style.animation = 'none';
          cursorElement.style.opacity = '0';
      }
    }
    setIsTypingStory(false); 
    isAnimatingRef.current = false;
  }, []); 

  useEffect(() => {
    const currentAnimationController = { abort: false };
    animationControllerRef.current = currentAnimationController;

    if (postData && postData.story_content_raw) {
      console.log('[TerminalViewer] useEffect: Valid postData, initiating typewriter for volume:', postData.volume_number);
      // Ensure previous animation is signaled to abort before starting a new one.
      // This logic might need to be more robust if postData changes very rapidly.
      if (isAnimatingRef.current) {
          // If an animation is marked as running, tell the old controller to abort.
          // This is a bit tricky because this effect instance has its own controller.
          // A more robust solution might involve a component-level "current animation ID"
          // and aborting based on that. For now, we rely on isAnimatingRef.
          console.warn('[TerminalViewer] Attempting to start new animation while previous might be finishing. Ensure cleanup is effective.');
      }
      typeStoryContent(postData, currentAnimationController).catch(err => {
          console.error("Typewriter error:", err);
          setIsTypingStory(false); // Ensure UI updates if typewriter errors out
          isAnimatingRef.current = false;
      });
    } else {
      console.log('[TerminalViewer] useEffect: No postData or story_content_raw to type.');
      if(storyOutputRef.current) storyOutputRef.current.innerHTML = ''; 
      if(cursorRef.current) cursorRef.current.style.display = 'none';
      setIsTypingStory(false); 
      isAnimatingRef.current = false;
    }

    return () => {
      console.log('[TerminalViewer] Cleanup effect for volume:', postData?.volume_number);
      if (animationControllerRef.current) {
        animationControllerRef.current.abort = true;
      }
      // isAnimatingRef.current = false; // Resetting here might be too soon if a new effect starts immediately
    };
  }, [postData, typeStoryContent]);


  if (!postData) {
    return <div className="terminal-container">Awaiting transmission... [No Post Data]</div>;
  }

  return (
    <div className="terminal-container">
      <div className="terminal-scanlines"></div>

      <header className="terminal-post-header">
        <h1 className="terminal-post-title">
          {postData.full_title_generated || `The Abel Experience™ Volume ${postData.volume_number} – ${postData.title}`}
        </h1>
      </header>

      <div className="terminal-story-content-wrapper">
        <div ref={storyOutputRef} className="story-output">
          {/* Typewriter content is directly manipulated here */}
        </div>
        <span ref={cursorRef} id="terminal-typing-cursor" style={{ display: 'none' }}></span>
      </div>
      
      {/* Blessings and footer are now ALWAYS rendered if postData exists */}
      {/* The isTypingStory state is now only used to control cursor visibility or other minor UI tweaks if needed */}
      <div className="terminal-blessings-section">
        <p className="terminal-blessings-intro">
          <span className="prompt-prefix">SYS_MSG: </span>
          {postData.blessing_intro || "life is x, y and z, but at least I have:"}
        </p>
        <ul className="terminal-blessings-list"> 
          {postData.blessing_list && postData.blessing_list.map((blessing, index) => (
            <li key={index}>
              <span className="terminal-blessing-item-prompt">-</span>
              <span className="terminal-blessing-item-name">{blessing.item}</span>
              {blessing.description && (
                <span className="terminal-blessing-description">
                    <span className="comment-prefix"></span>{blessing.description}
                </span>
              )}
            </li>
          ))}
          {(!postData.blessing_list || postData.blessing_list.length === 0) && (
            <li><span className="terminal-blessing-item-prompt"></span><span style={{color: "#888"}}>(No blessings listed for this volume)</span></li>
          )}
        </ul>
      </div>

      <p className="terminal-edition-footer">
        {postData.edition_footer}
      </p>
    </div>
  );
}

export default TerminalPostViewer;
