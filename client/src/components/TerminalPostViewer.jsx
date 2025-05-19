// client/src/components/TerminalPostViewer.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import './TerminalPostViewer.css'; // Ensure your CSS is imported and defines styles for p tags

// Configuration Constants
const TYPE_SPEED_MS = 30;
const PAUSE_MS_SHORT = 90;
const PAUSE_MS_LONG = 280;
const GLITCH_CHANCE = 0.12;
const GLITCH_CHARS = "!@#%^*_+-=[]{}|;:,./<>?";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function TerminalPostViewer({ postData }) {
  const storyOutputRef = useRef(null);
  const cursorRef = useRef(null);
  const [isTypingStory, setIsTypingStory] = useState(false); 
  
  const animationInProgressRef = useRef(false);
  const currentAnimationControllerRef = useRef({ abort: false });

  useEffect(() => {
    console.log("[TerminalViewer] Received postData:", postData);
  }, [postData]);

  const typeStoryContent = useCallback(async (dataToType, controller) => {
    if (!storyOutputRef.current || !cursorRef.current || !dataToType?.story_content_raw) {
      console.error('[Typewriter] Abort: Missing refs, or story_content_raw in dataToType.', {
        hasStoryOutputRef: !!storyOutputRef.current,
        hasCursorRef: !!cursorRef.current,
        hasStoryContentRaw: !!dataToType?.story_content_raw
      });
      setIsTypingStory(false);
      if(cursorRef.current) cursorRef.current.style.display = 'none';
      animationInProgressRef.current = false; 
      return;
    }

    if (animationInProgressRef.current && !controller.abort) {
      console.log('[Typewriter] Animation already in progress by another call. Aborting new start.');
      return;
    }
    animationInProgressRef.current = true;
    controller.abort = false; 

    console.log('[Typewriter] Starting animation for volume:', dataToType.volume_number);
    setIsTypingStory(true);

    const storyOutputElement = storyOutputRef.current;
    const cursorElement = cursorRef.current;
    
    storyOutputElement.innerHTML = ''; 
    cursorElement.style.display = 'inline-block';
    cursorElement.style.animation = 'blink-animation 0.9s step-end infinite';
    cursorElement.style.opacity = '1';

    const storyLinesRaw = dataToType.story_content_raw;
    if (typeof storyLinesRaw !== 'string') {
        console.error('[Typewriter] story_content_raw is not a string:', storyLinesRaw);
        storyOutputElement.innerHTML = '<p style="color: red;">Error: Story content is not valid text.</p>';
        setIsTypingStory(false);
        animationInProgressRef.current = false;
        if(cursorRef.current) cursorRef.current.style.display = 'none';
        return;
    }
    const G_STORY_LINES = storyLinesRaw.split(/\r?\n/);

    for (let lineIndex = 0; lineIndex < G_STORY_LINES.length; lineIndex++) {
      if (controller.abort) {
        console.log('[Typewriter] Animation aborted by controller for volume:', dataToType.volume_number);
        break; 
      }

      const lineText = G_STORY_LINES[lineIndex];
      const p = document.createElement('p');
      // These styles should primarily be handled by TerminalPostViewer.css
      // Ensure .story-output p has margin: 0; and appropriate line-height.
      // p.style.margin = '0'; // Enforce no margin for typed lines
      // p.style.lineHeight = '1.3'; // Example tight line height

      storyOutputElement.appendChild(p);

      if (lineText.trim() === "---") {
        const hr = document.createElement('hr');
        p.appendChild(hr); // HR is inside the paragraph, which might affect spacing.
                           // Consider appending HR directly to storyOutputElement if p adds too much space.
        await delay(PAUSE_MS_SHORT);
        storyOutputElement.appendChild(cursorElement); 
        continue;
      }
      
      if (lineText.trim() === "") {
        p.innerHTML = '&nbsp;'; // This will be a paragraph with a non-breaking space.
                                // Its height will be determined by line-height.
                                // If you want MORE space for these, add a specific class or style.
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
            console.log('[Typewriter] Animation aborted mid-line by controller for volume:', dataToType.volume_number);
            break; 
          }

          const char = textToType[charIndex];
          
          if (Math.random() < GLITCH_CHANCE && char !== ' ') {
            p.innerHTML = prefixHTML + 
                          '<span class="terminal-greentext-line">' + currentLineTextOnly + '</span>' +
                          `<span class="terminal-glitch-effect">${GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]}</span>`;
            p.appendChild(cursorElement);
            await delay(100); 
          }
          
          currentLineTextOnly += char;
          p.innerHTML = prefixHTML + '<span class="terminal-greentext-line">' + currentLineTextOnly + '</span>';
          p.appendChild(cursorElement); 

          await delay(TYPE_SPEED_MS + (Math.random() * PAUSE_MS_SHORT / 3));
        }
      }
      if (controller.abort) break; 
      storyOutputElement.appendChild(cursorElement); 
      await delay(PAUSE_MS_LONG);    
    }
    
    if (!controller.abort) {
      console.log('[Typewriter] Animation successfully completed for volume:', dataToType.volume_number);
      if (cursorElement) {
          cursorElement.style.animation = 'none';
          cursorElement.style.opacity = '0';
      }
    }
    setIsTypingStory(false); 
    animationInProgressRef.current = false;
  }, []); 

  useEffect(() => {
    const controller = { abort: false };
    currentAnimationControllerRef.current = controller;

    if (postData && typeof postData.story_content_raw === 'string') {
      if (storyOutputRef.current) storyOutputRef.current.innerHTML = '';
      console.log('[TerminalViewer] useEffect: Valid postData, initiating typewriter for volume:', postData.volume_number);
      typeStoryContent(postData, controller).catch(err => {
          console.error("Typewriter execution error:", err);
          setIsTypingStory(false); 
          animationInProgressRef.current = false; 
      });
    } else {
      console.log('[TerminalViewer] useEffect: No valid postData or story_content_raw to type. Clearing output.', postData);
      if(storyOutputRef.current) storyOutputRef.current.innerHTML = ''; 
      if(cursorRef.current) cursorRef.current.style.display = 'none';
      setIsTypingStory(false); 
      animationInProgressRef.current = false;
    }

    return () => {
      console.log('[TerminalViewer] Cleanup effect for volume:', postData?.volume_number);
      if (currentAnimationControllerRef.current) {
        console.log('[TerminalViewer] Cleanup: Aborting ongoing animation.');
        currentAnimationControllerRef.current.abort = true;
      }
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

      {/* Story content wrapper is now BEFORE blessings */}
      <div className="terminal-story-content-wrapper">
        <div ref={storyOutputRef} className="story-output">
          {/* Typewriter content is directly manipulated here */}
        </div>
        <span ref={cursorRef} id="terminal-typing-cursor" style={{ display: 'none' }}></span>
      </div>
      
      <div className="terminal-blessing-section">
        <p className="terminal-blessing-intro">
          <span className="prompt-prefix">SYS_MSG: </span>
          {postData.blessing_intro || "life is x, y and z, but at least I have:"}
        </p>
        <ul className="terminal-blessings-list"> 
          {postData.blessing_list && postData.blessing_list.length > 0 ? (
            postData.blessing_list.map((blessing, index) => (
              <li key={index}>
                <span className="terminal-blessing-item-prompt">-</span>
                <span className="terminal-blessing-item-name">{blessing.item}</span>
                {blessing.description && (
                  <span className="terminal-blessing-description">
                      <span className="comment-prefix"></span>
                      {blessing.description}
                  </span>
                )}
              </li>
            ))
          ) : (
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
