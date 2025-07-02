import React from 'react';
import ChatPage from './ChatPage';
import './index.css';

function App() {
  return <ChatPage />;
}

export default App;
import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import './ChatPage.css';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'doctor', type: 'text', content: 'Hello there!', time: 'Sep 13, 20:34' },
    { id: 2, sender: 'doctor', type: 'image', content: '/stethoscope.jpg', time: 'Sep 13, 20:34' },
    { id: 3, sender: 'doctor', type: 'audio', content: '/audio-msg.mp3', time: 'Sep 22, 20:34' }
  ]);
  const [typing, setTyping] = useState(false);

  const addMessage = msg => {
    setMessages(prev => [...prev, { ...msg, id: prev.length + 1 }]);
  };

  // Simulate “Dr. Gabriella is typing…”
  useEffect(() => {
    const timer = setTimeout(() => setTyping(true), 2000);
    const stop  = setTimeout(() => setTyping(false), 5000);
    return () => { clearTimeout(timer); clearTimeout(stop); };
  }, []);

  return (
    <div className="chat-container">
      <ChatHeader name="Dr. Gabriella" />
      <MessageList messages={messages} typing={typing} />
      <ChatInput onSend={addMessage} />
    </div>
  );
}
import React from 'react';
import './ChatHeader.css';

export default function ChatHeader({ name }) {
  return (
    <header className="chat-header">
      <h2>{name}</h2>
    </header>
  );
}
// MessageList.js
import React, { useEffect, useRef } from 'react';
import Message from './Message';
import './MessageList.css';

export default function MessageList({ messages, typing }) {
  const endRef = useRef();
  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, typing]);

  return (
    <div className="message-list">
      {messages.map(msg => (
        <Message key={msg.id} {...msg} />
      ))}
      {typing && <div className="typing-indicator">Dr. Gabriella is typing...</div>}
      <div ref={endRef} />
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import './ChatPage.css';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'doctor', type: 'text', content: 'Hello there!', time: 'Sep 13, 20:34' },
    { id: 2, sender: 'doctor', type: 'image', content: '/stethoscope.jpg', time: 'Sep 13, 20:34' },
    { id: 3, sender: 'doctor', type: 'audio', content: '/audio-msg.mp3', time: 'Sep 22, 20:34' }
  ]);
  const [typing, setTyping] = useState(false);

  const addMessage = msg => {
    setMessages(prev => [...prev, { ...msg, id: prev.length + 1 }]);
  };

  // Simulate “Dr. Gabriella is typing…”
  useEffect(() => {
    const timer = setTimeout(() => setTyping(true), 2000);
    const stop  = setTimeout(() => setTyping(false), 5000);
    return () => { clearTimeout(timer); clearTimeout(stop); };
  }, []);

  return (
    <div className="chat-container">
      <ChatHeader name="Dr. Gabriella" />
      <MessageList messages={messages} typing={typing} />
      <ChatInput onSend={addMessage} />
    </div>
  );
}
import React from 'react';
import './ChatHeader.css';

export default function ChatHeader({ name }) {
  return (
    <header className="chat-header">
      <h2>{name}</h2>
    </header>
  );
}
// MessageList.js
import React, { useEffect, useRef } from 'react';
import Message from './Message';
import './MessageList.css';

export default function MessageList({ messages, typing }) {
  const endRef = useRef();
  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, typing]);

  return (
    <div className="message-list">
      {messages.map(msg => (
        <Message key={msg.id} {...msg} />
      ))}
      {typing && <div className="typing-indicator">Dr. Gabriella is typing...</div>}
      <div ref={endRef} />
    </div>
  );
}
// Message.js
import React from 'react';
import './Message.css';

export default function Message({ sender, type, content, time }) {
  const isDoctor = sender === 'doctor';
  const className = `message ${isDoctor ? 'doctor' : 'user'}`;

  let body;
  if (type === 'text') {
    body = <p>{content}</p>;
  } else if (type === 'image') {
    body = <img src={content} alt="shared content" />;
  } else if (type === 'audio') {
    body = <audio controls src={content} />;
  }

  return (
    <div className={className}>
      {isDoctor && <div className="avatar">👩‍⚕️</div>}
      <div className="bubble">
        {body}
        {time && <span className="timestamp">{time}</span>}
      </div>
      {!isDoctor && <div className="avatar user-avatar">😊</div>}
    </div>
  );
}
import React, { useState } from 'react';
import './ChatInput.css';

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');

  const handleSend = e => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend({ sender: 'user', type: 'text', content: text, time: new Date().toLocaleString() });
    setText('');
  };

  return (
    <form className="chat-input" onSubmit={handleSend}>
      <input
        type="text"
        placeholder="Type your message…"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}