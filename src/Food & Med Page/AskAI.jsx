import React, { useState } from 'react'

function AskAI() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  // function to show text like typing
  function typeWriteEffect(text){
    if(typeof text !== 'string') return; 
    
    let index = 0;
    // setAnswer(''); //clear old text
    setQuestion('')
    const interval = setInterval(()=>{
      setAnswer(prev => prev + text.charAt(index));
      index++;
      if(index > text.length){
        clearInterval(interval)
      }
    }, 30); //speed of typing in ms
  };

  async function handleAsk() {
    if(!question.trim()) return;
    setLoading(true);
    setAnswer('');

    try {
      const res = await fetch(' http://localhost:3226/ask', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
         },
         body: JSON.stringify({ question })
      });

      const data = await res.json();
      if(!data || typeof data.answer !== 'string'){
        setAnswer('No valid response from AI');
        return;
      }
      typeWriteEffect(data.answer);

    } catch (err) {
      console.error(err);
      setAnswer('Error fetching AI response');
    } finally{
      setLoading(false);
    }
  }

 return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2>Ask FoodMed AI</h2>
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
          padding: "8px 15px",
          backgroundColor: "orange",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      {answer && (
        <div
          style={{
            marginTop: 20,
            padding: 10,
            border: "1px solid #ccc",
            minHeight: 50,
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
          }}
        >
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default AskAI

