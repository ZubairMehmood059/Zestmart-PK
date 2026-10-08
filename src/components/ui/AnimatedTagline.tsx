import React, { useState, useEffect } from 'react';

interface AnimatedTaglineProps {
  texts?: string[];
  text?: string;
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

export const AnimatedTagline: React.FC<AnimatedTaglineProps> = ({
  texts,
  text = '',
  className = '',
  typingSpeed = 38,
  deletingSpeed = 20,
  pauseTime = 2600
}) => {
  const taglineList = texts && texts.length > 0 ? texts : [text];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const currentText = taglineList[currentIndex] || '';

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayedText.length < currentText.length) {
      // Step Forward: Add letter
      timer = setTimeout(() => {
        setDisplayedText(currentText.slice(0, displayedText.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && displayedText.length === currentText.length) {
      // Pause at full text before reversing
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);
    } else if (isDeleting && displayedText.length > 0) {
      // Step Reverse: Delete letter
      timer = setTimeout(() => {
        setDisplayedText(currentText.slice(0, displayedText.length - 1));
      }, deletingSpeed);
    } else if (isDeleting && displayedText.length === 0) {
      // Pause empty, then advance to next tagline
      timer = setTimeout(() => {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % taglineList.length);
      }, 400);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentText, taglineList.length, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className={`inline-flex flex-wrap items-baseline min-h-[1.2em] ${className}`}>
      {displayedText.split('').map((char, index) => (
        <span
          key={`${index}-${char}`}
          className="inline-block transition-all duration-150"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
      <span className="inline-block w-[3px] h-[0.75em] bg-emerald-600 ml-1 rounded-full animate-pulse shrink-0 self-center" />
    </span>
  );
};
