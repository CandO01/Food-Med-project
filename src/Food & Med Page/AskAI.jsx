import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '../AuthenticationContext/LoadingDots';


function AskAI() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  function typeWriteEffect(text) {
    if (typeof text !== 'string') return;

    let index = 0;
    setQuestion('');
    setAnswer('');
    const interval = setInterval(() => {
      setAnswer(prev => prev + text.charAt(index));
      index++;
      if (index > text.length) {
        clearInterval(interval);
      }
    }, 30);
  }

  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');

    try {
      const res = await fetch('https://foodmed-server-4.onrender.com/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question,
          history: messages  // ✅ send previous conversation to server
        })
      });

      const data = await res.json();

      const newMessages = [
        ...messages,
        { role: 'user', content: question },
        { role: 'assistant', content: data.answer }
      ];
      setMessages(newMessages);

      if (!data || typeof data.answer !== 'string') {
        setAnswer('No valid response from AI');
        return;
      }
      typeWriteEffect(data.answer);

    } catch (err) {
      console.error(err);
      setAnswer('Error fetching AI response');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2>Ask FoodMed AI</h2>

      {/* Chat history */}
      <div style={{ 
        // border: "1px solid #ccc", 
        padding: 10, 
        minHeight: 200, 
        marginBottom: 10, 
        whiteSpace: "pre-wrap" 
      }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
              <ReactMarkdown>
               {msg.content}
              </ReactMarkdown>
            </div>
          ))}
        
      </div>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask me anything about food & health..."
        style={{ width: "100%", height: 100, marginBottom: 10 }}
      />
      <button
        onClick={handleAsk}
        disabled={loading}
        style={{
          padding: "8px 16px",
          backgroundColor: "#b7ffb9ff",
          color: "GREEN",
          border: "none",
          cursor: "pointer",
      }}
    >
      {loading ? (
        <LoadingDots size={6} color='red' />
      ) : "Ask"}
    </button>
    </div>
  );
}

export default AskAI;
<style>
{`
 @keyframes bounce {
        0%, 80%, 100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }
`}
</style>

