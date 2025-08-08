import React, { useState, useEffect } from 'react';

const TypingBanner = () => {
  const words = [
    'Get your available food here 🍚',
    'Affordable medical advice at your fingertips.',
    'Donate your leftover food today',
    'Connect with healthcare professionals instantly.',
    'Trade food items easily',
    'Your health matters, get the care you deserve.',
    'Help someone in need😥',
    'Find a doctor near you.👨‍⚕️',
    'Get expert care without leaving your home.',
    'Make hunger history',
    'Your health is our priority.',
    'Access medical advice anytime, anywhere.',
    'Stay healthy with our expert tips.',
    'Find the right doctor for your needs.',
    'Book appointments with ease.',
    'No queues, no delays — instant consultations.',
    'Your health, your way.',
  ];

  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing characters
        setText((prev) => {
          const nextText = currentWord.substring(0, prev.length + 1);
          if (nextText === currentWord) {
            setTimeout(() => setIsDeleting(true), 1500); // pause before deleting
          }
          return nextText;
        });
      } else {
        // Deleting characters
        setText((prev) => {
          const nextText = currentWord.substring(0, prev.length - 1);
          if (nextText === '') {
            setIsDeleting(false);
            setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
          }
          return nextText;
        });
      }
    };

    const timeout = setTimeout(handleTyping, isDeleting ? 60 : typingSpeed);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex]);

  return (
    <div className="typing-banner">
      {text}
      <span className="cursor">|</span>
    </div>
  );
};

export default TypingBanner;
