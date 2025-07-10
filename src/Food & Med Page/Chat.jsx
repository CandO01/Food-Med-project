// src/ChatPage.jsx
import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import dayjs from 'dayjs'

const socket = io('http://localhost:3001')

function ChatPage() {
  const [username, setUsername] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [receiver, setReceiver] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const chatBoxRef = useRef(null)

  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight)
  }, [messages])

  useEffect(() => {
    if (isRegistered) {
      socket.emit('register', username)

      socket.on('user-list', (users) => {
        setOnlineUsers(users.filter((user) => user !== username))
      })

      socket.on('private message', (msg) => {
        setMessages((prev) => [...prev, msg])
      })

      socket.on('typing', (fromUser) => {
        if (fromUser === receiver) setIsTyping(true)
        setTimeout(() => setIsTyping(false), 2000)
      })
    }

    return () => {
      socket.off('user-list')
      socket.off('private message')
      socket.off('typing')
    }
  }, [isRegistered, username, receiver])

  const handleSend = (e) => {
    e.preventDefault()
    if (!message || !receiver) return

    socket.emit('private message', {
      sender: username,
      receiver,
      content: message,
      createdAt: new Date().toISOString()
    })

    setMessage('')
  }

  const handleTyping = () => {
    if (receiver) socket.emit('typing', receiver)
  }

  if (!isRegistered) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <h2>🔐 Enter your username</h2>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. donor01"
          style={{ padding: '10px', marginBottom: '10px', width: '250px' }}
        />
        <button
          onClick={() => setIsRegistered(true)}
          style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px' }}
        >
          Enter Chat
        </button>
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '1rem', backgroundColor: '#007bff', color: '#fff' }}>
        <h2>Welcome, {username}</h2>
        <div>
          <label><strong>Select user to chat with:</strong></label>
          <select
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            style={{ padding: '6px', marginLeft: '10px', borderRadius: '5px' }}
          >
            <option value="">-- Choose User --</option>
            {onlineUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message Area */}
      <div
        ref={chatBoxRef}
        style={{
          flex: 1,
          padding: '1rem',
          overflowY: 'auto',
          backgroundColor: '#fff'
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.sender === username ? 'right' : 'left',
              marginBottom: '0.75rem'
            }}
          >
            <div
              style={{
                display: 'inline-block',
                backgroundColor: msg.sender === username ? '#dcf8c6' : '#f1f0f0',
                borderRadius: '15px',
                padding: '10px 15px',
                maxWidth: '70%',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ fontSize: '0.9rem' }}>{msg.content}</div>
              <div style={{ fontSize: '0.7rem', marginTop: '5px', color: '#888' }}>
                {dayjs(msg.createdAt).format('HH:mm')}
              </div>
            </div>
          </div>
        ))}
        {isTyping && <div><em>✍️ {receiver} is typing...</em></div>}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid #ddd', display: 'flex', gap: '0.5rem' }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '20px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            fontSize: '1rem'
          }}
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatPage
