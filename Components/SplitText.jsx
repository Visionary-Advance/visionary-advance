import { useRef, useEffect, useState } from "react";

const SplitText = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "0px",
  textAlign = "center",
  onAnimationComplete,
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [splitElements, setSplitElements] = useState([]);

  useEffect(() => {
    if (!text) return;

    // Split the text based on splitType
    let elements = [];
    
    if (splitType === "chars") {
      elements = text.split("").map((char, index) => ({
        content: char === " " ? "\u00A0" : char, // Use non-breaking space
        index,
        isSpace: char === " "
      }));
    } else if (splitType === "words") {
      elements = text.split(" ").map((word, index) => ({
        content: word,
        index,
        isSpace: false
      }));
    } else if (splitType === "lines") {
      elements = text.split("\n").map((line, index) => ({
        content: line,
        index,
        isSpace: false
      }));
    }

    setSplitElements(elements);
  }, [text, splitType]);

  useEffect(() => {
    if (!ref.current || splitElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [splitElements, threshold, rootMargin]);

  // Convert delay from ms to seconds for CSS
  const delayInSeconds = delay / 1000;

  // CSS variables for animation
  const animationStyle = {
    '--duration': `${duration}s`,
    '--delay-base': `${delayInSeconds}s`,
    '--from-opacity': from.opacity || 0,
    '--from-y': `${from.y || 0}px`,
    '--to-opacity': to.opacity || 1,
    '--to-y': `${to.y || 0}px`,
    textAlign,
  };

  return (
    <>
      <style jsx>{`
       // In your SplitText component CSS
.split-container {
  display: inline-block;
  overflow: hidden;
  width: 100% !important; // Add !important to override Tailwind
}

@media (max-width: 768px) {
  .split-container {
    width: 91.666667% !important; // Add !important
    max-width: none !important; // Override any max-width constraints
  }
}
        
        .split-element {
          display: inline-block;
          opacity: var(--from-opacity);
          transform: translateY(var(--from-y));
          transition: opacity var(--duration) ease-out, transform var(--duration) ease-out;
          will-change: opacity, transform;
          white-space: pre;
        }
        
        .split-element.animate {
          opacity: var(--to-opacity);
          transform: translateY(var(--to-y));
        }
        
        .split-word {
          margin-right: 0.25em;
          white-space: nowrap;
        }
        
        .split-word:last-child {
          margin-right: 0;
        }
        
        .split-line {
          display: block;
        }
        
        .split-chars .split-element {
          white-space: normal;
        }
      `}</style>
      
      <div
        ref={ref}
        className={`split-container ${splitType === 'chars' ? 'split-chars' : ''} ${className}`}
        style={animationStyle}
      >
        {splitElements.map((element, index) => {
          const elementDelay = index * delayInSeconds;
          
          return (
            <span
              key={index}
              className={`split-element ${isVisible ? 'animate' : ''} ${
                splitType === 'words' ? 'split-word' : ''
              } ${splitType === 'lines' ? 'split-line' : ''}`}
              style={{
                transitionDelay: `${elementDelay}s`,
              }}
            >
              {element.content}
            </span>
          );
        })}
      </div>
    </>
  );
};

export default SplitText;