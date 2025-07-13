import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Your backend server

const ChatPage = () => {
  const { recipientId } = useParams();
  const storedRecipientId = localStorage.getItem('lastRecipientId');
  const chatWith = recipientId || storedRecipientId;

  const email = localStorage.getItem('userEmail') || localStorage.getItem('donorEmail');
  const role = localStorage.getItem('role');
  const userId = email;

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // 👥 Load contacts based on food request relationship
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch(`http://localhost:3001/requests?role=${role}&id=${userId}`);
        const data = await res.json();

        const uniqueEmails = new Set();
        const contactsList = [];

        data.forEach(req => {
          const contactEmail = role === 'donor' ? req.email : req.donorEmail;
          if (!uniqueEmails.has(contactEmail)) {
            uniqueEmails.add(contactEmail);
            contactsList.push({
              id: contactEmail,
              name: contactEmail,
              foodName: req.foodName
            });
          }
        });

        setContacts(contactsList);

        // Automatically select contact if coming via link
        if (chatWith) {
          const found = contactsList.find(c => c.id === chatWith);
          if (found) setSelectedContact(found);
        }

      } catch (err) {
        console.error('Failed to fetch contacts:', err);
      }
    };

    fetchContacts();
  }, [role, userId, chatWith]);

  // 🟢 Handle online users
  useEffect(() => {
    if (!email) return;

    socket.emit('joinRoom', { senderId: email, recipientId: null });
    socket.emit('online', email);

    socket.on('onlineUsers', (list) => setOnlineUsers(list));

    return () => socket.off('onlineUsers');
  }, [email]);

  // 💬 Fetch messages & setup listener
  useEffect(() => {
    if (!selectedContact) return;

    socket.emit('joinRoom', {
      senderId: email,
      recipientId: selectedContact.id
    });

    fetch(`http://localhost:3001/messages?senderId=${email}&recipientId=${selectedContact.id}`)
      .then(res => res.json())
      .then(setMessages)
      .catch(console.error);

    socket.on('receiveMessage', (msg) => {
      if (
        (msg.senderId === email && msg.recipientId === selectedContact.id) ||
        (msg.senderId === selectedContact.id && msg.recipientId === email)
      ) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => socket.off('receiveMessage');
  }, [selectedContact, email]);

  const sendMessage = () => {
    if (!text.trim() || !selectedContact) return;

    const msg = {
      senderId: email,
      recipientId: selectedContact.id,
      text
    };

    socket.emit('sendMessage', msg);
    setMessages(prev => [...prev, { ...msg, timestamp: new Date().toISOString() }]);
    setText('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isOnline = (id) => onlineUsers.includes(id);

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h3>Chats</h3>
        <ul style={styles.list}>
          {contacts.map(contact => (
            <li
              key={contact.id}
              onClick={() => {
                setSelectedContact(contact);
                localStorage.setItem('lastRecipientId', contact.id);
              }}
              style={{
                ...styles.listItem,
                background: selectedContact?.id === contact.id ? '#ddd' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <span style={{ marginRight: 8 }}>
                {isOnline(contact.id) ? '🟢' : '🔴'}
              </span>
              <div>
                <strong>{contact.name}</strong><br />
                <small>Food: {contact.foodName}</small>
              </div>
            </li>
          ))}

          {contacts.length === 0 && (
            <p style={{ padding: '1rem', color: '#555' }}>
              No contacts available. Make or receive a food request to chat.
            </p>
          )}
        </ul>
      </div>

      {/* Chat Box */}
      <div style={styles.chatContainer}>
        {selectedContact ? (
          <>
            <h3>Chat with {selectedContact.name}</h3>
            <div style={styles.chatBox}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.message,
                    alignSelf: msg.senderId === email ? 'flex-end' : 'flex-start',
                    background: msg.senderId === email ? '#dcf8c6' : '#fff'
                  }}
                >
                  <div>{msg.text}</div>
                  <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div style={styles.inputRow}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={styles.input}
                placeholder="Type your message..."
              />
              <button onClick={sendMessage} style={styles.button}>Send</button>
            </div>
          </>
        ) : (
          <p style={{ padding: '2rem' }}>Select a chat to begin.</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

const styles = {
  wrapper: {
    display: 'flex',
    height: '100vh'
  },
  sidebar: {
    width: '30%',
    borderRight: '1px solid #ccc',
    padding: '1rem',
    overflowY: 'auto'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    padding: '0.5rem',
    borderBottom: '1px solid #eee'
  },
  chatContainer: {
    flex: 1,
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column'
  },
  chatBox: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  message: {
    padding: '0.5rem 1rem',
    borderRadius: '10px',
    maxWidth: '70%'
  },
  inputRow: {
    display: 'flex',
    gap: '1rem'
  },
  input: {
    flex: 1,
    padding: '0.5rem'
  },
  button: {
    padding: '0.5rem 1rem',
    background: 'orange',
    border: 'none',
    color: 'white',
    cursor: 'pointer'
  }
};












































































// import React, { useEffect, useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3001'); // Replace with your backend server address

// const ChatPage = () => {
//   const { recipientId } = useParams(); // URL param: /chat/:recipientId
//   const senderId = localStorage.getItem('donorEmail'); // Used for both donor or user
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState('');
//   const messagesEndRef = useRef(null);

//   // Fetch previous chat and setup socket listeners
//   useEffect(() => {
//     if (!senderId || !recipientId) return;

//     // Join sender's room (so they receive messages)
//     socket.emit('joinRoom', senderId);

//     // Fetch chat history
//     fetch(`http://localhost:3001/messages?senderId=${senderId}&recipientId=${recipientId}`)
//       .then(res => res.json())
//       .then(setMessages)
//       .catch(err => console.error('Failed to fetch messages:', err));

//     // Listen for incoming messages
//     socket.on('receiveMessage', (msg) => {
//       if (
//         (msg.sender === senderId && msg.receiver === recipientId) ||
//         (msg.sender === recipientId && msg.receiver === senderId)
//       ) {
//         setMessages(prev => [...prev, msg]);
//       }
//     });

//     return () => {
//       socket.off('receiveMessage');
//     };
//   }, [senderId, recipientId]);

//   const sendMessage = () => {
//     if (text.trim() === '') return;

//     const msg = {
//       sender: senderId,
//       receiver: recipientId,
//       text,
//     };

//     socket.emit('sendMessage', msg); // Send to backend
//     setMessages(prev => [...prev, { ...msg, timestamp: new Date().toISOString() }]);
//     setText('');
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   return (
//     <div style={styles.container}>
//       <h2>Chat with {recipientId}</h2>
//       <div style={styles.chatBox}>
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             style={{
//               ...styles.message,
//               alignSelf: msg.sender === senderId ? 'flex-end' : 'flex-start',
//               background: msg.sender === senderId ? '#dcf8c6' : '#fff'
//             }}
//           >
//             <div>{msg.text}</div>
//             <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div style={styles.inputRow}>
//         <input
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           style={styles.input}
//           placeholder="Type your message..."
//         />
//         <button onClick={sendMessage} style={styles.button}>Send</button>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: { padding: '1rem', maxWidth: '600px', margin: 'auto' },
//   chatBox: {
//     border: '1px solid #ccc',
//     height: '400px',
//     overflowY: 'auto',
//     padding: '1rem',
//     display: 'flex',
//     flexDirection: 'column',
//     background: '#f5f5f5',
//     borderRadius: '8px',
//     marginBottom: '1rem'
//   },
//   message: {
//     padding: '0.6rem 1rem',
//     borderRadius: '20px',
//     margin: '0.3rem 0',
//     maxWidth: '80%',
//     wordBreak: 'break-word'
//   },
//   inputRow: {
//     display: 'flex',
//     gap: '1rem'
//   },
//   input: {
//     flex: 1,
//     padding: '0.6rem',
//     borderRadius: '20px',
//     border: '1px solid #ccc'
//   },
//   button: {
//     padding: '0.6rem 1rem',
//     background: 'orange',
//     color: 'white',
//     border: 'none',
//     borderRadius: '20px',
//     cursor: 'pointer'
//   }
// };

// export default ChatPage;









































































// import React, { useEffect, useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3001'); // Replace with your server if deployed

// const ChatPage = () => {
//   const { recipientId } = useParams(); // assuming /chat/:recipientId
//   const senderId = localStorage.getItem('donorEmail');
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState('');
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     socket.emit('joinRoom', { senderId, recipientId });

//     fetch(`http://localhost:3001/messages?senderId=${senderId}&recipientId=${recipientId}`)
//       .then(res => res.json())
//       .then(setMessages);

//     socket.on('receiveMessage', (msg) => {
//       setMessages(prev => [...prev, msg]);
//     });

//     return () => socket.disconnect();
//   }, [senderId, recipientId]);

//   const sendMessage = () => {
//     if (text.trim() === '') return;

//     const msg = { senderId, recipientId, text };
//     socket.emit('sendMessage', msg);
//     setMessages(prev => [...prev, { ...msg, timestamp: new Date() }]);
//     setText('');
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   return (
//     <div style={styles.container}>
//       <h2>Chat with {recipientId}</h2>
//       <div style={styles.chatBox}>
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             style={{
//               ...styles.message,
//               alignSelf: msg.senderId === senderId ? 'flex-end' : 'flex-start',
//               background: msg.senderId === senderId ? '#dcf8c6' : '#fff'
//             }}
//           >
//             <div>{msg.text}</div>
//             <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div style={styles.inputRow}>
//         <input
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           style={styles.input}
//           placeholder="Type your message..."
//         />
//         <button onClick={sendMessage} style={styles.button}>Send</button>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: { padding: '1rem', maxWidth: '600px', margin: 'auto' },
//   chatBox: {
//     border: '1px solid #ccc',
//     height: '400px',
//     overflowY: 'auto',
//     padding: '1rem',
//     display: 'flex',
//     flexDirection: 'column',
//     background: '#f5f5f5',
//     borderRadius: '8px',
//     marginBottom: '1rem'
//   },
//   message: {
//     padding: '0.6rem 1rem',
//     borderRadius: '20px',
//     margin: '0.3rem 0',
//     maxWidth: '80%',
//     wordBreak: 'break-word'
//   },
//   inputRow: {
//     display: 'flex',
//     gap: '1rem'
//   },
//   input: {
//     flex: 1,
//     padding: '0.6rem',
//     borderRadius: '20px',
//     border: '1px solid #ccc'
//   },
//   button: {
//     padding: '0.6rem 1rem',
//     background: 'orange',
//     color: 'white',
//     border: 'none',
//     borderRadius: '20px',
//     cursor: 'pointer'
//   }
// };

// export default ChatPage;





































































































































// // src/ChatPage.jsx
// import React, { useEffect, useRef, useState } from 'react'
// import { io } from 'socket.io-client'
// import dayjs from 'dayjs'

// const socket = io('https://foodmed-server3.onrender.com/')

// function ChatPage() {
//   const [username, setUsername] = useState('')
//   const [isRegistered, setIsRegistered] = useState(false)
//   const [onlineUsers, setOnlineUsers] = useState([])
//   const [receiver, setReceiver] = useState('')
//   const [message, setMessage] = useState('')
//   const [messages, setMessages] = useState([])
//   const [isTyping, setIsTyping] = useState(false)
//   const chatBoxRef = useRef(null)

//   useEffect(() => {
//     chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight)
//   }, [messages])

//   useEffect(() => {
//     if (isRegistered) {
//       socket.emit('register', username)

//       socket.on('user-list', (users) => {
//         setOnlineUsers(users.filter((user) => user !== username))
//       })

//       socket.on('private message', (msg) => {
//         setMessages((prev) => [...prev, msg])
//       })

//       socket.on('typing', (fromUser) => {
//         if (fromUser === receiver) setIsTyping(true)
//         setTimeout(() => setIsTyping(false), 2000)
//       })
//     }

//     return () => {
//       socket.off('user-list')
//       socket.off('private message')
//       socket.off('typing')
//     }
//   }, [isRegistered, username, receiver])

//   const handleSend = (e) => {
//     e.preventDefault()
//     if (!message || !receiver) return

//     socket.emit('private message', {
//       sender: username,
//       receiver,
//       content: message,
//       createdAt: new Date().toISOString()
//     })

//     setMessage('')
//   }

//   const handleTyping = () => {
//     if (receiver) socket.emit('typing', receiver)
//   }

//   if (!isRegistered) {
//     return (
//       <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
//         <h2>🔐 Enter your username</h2>
//         <input
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           placeholder="e.g. donor01"
//           style={{ padding: '10px', marginBottom: '10px', width: '250px' }}
//         />
//         <button
//           onClick={() => setIsRegistered(true)}
//           style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px' }}
//         >
//           Enter Chat
//         </button>
//       </div>
//     )
//   }

//   return (
//     <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
//       <div style={{ padding: '1rem', backgroundColor: '#007bff', color: '#fff' }}>
//         <h2>Welcome, {username}</h2>
//         <div>
//           <label><strong>Select user to chat with:</strong></label>
//           <select
//             value={receiver}
//             onChange={(e) => setReceiver(e.target.value)}
//             style={{ padding: '6px', marginLeft: '10px', borderRadius: '5px' }}
//           >
//             <option value="">-- Choose User --</option>
//             {onlineUsers.map((user) => (
//               <option key={user} value={user}>
//                 {user}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Message Area */}
//       <div
//         ref={chatBoxRef}
//         style={{
//           flex: 1,
//           padding: '1rem',
//           overflowY: 'auto',
//           backgroundColor: '#fff'
//         }}
//       >
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             style={{
//               textAlign: msg.sender === username ? 'right' : 'left',
//               marginBottom: '0.75rem'
//             }}
//           >
//             <div
//               style={{
//                 display: 'inline-block',
//                 backgroundColor: msg.sender === username ? '#dcf8c6' : '#f1f0f0',
//                 borderRadius: '15px',
//                 padding: '10px 15px',
//                 maxWidth: '70%',
//                 boxShadow: '0px 1px 3px rgba(0,0,0,0.05)'
//               }}
//             >
//               <div style={{ fontSize: '0.9rem' }}>{msg.content}</div>
//               <div style={{ fontSize: '0.7rem', marginTop: '5px', color: '#888' }}>
//                 {dayjs(msg.createdAt).format('HH:mm')}
//               </div>
//             </div>
//           </div>
//         ))}
//         {isTyping && <div><em>✍️ {receiver} is typing...</em></div>}
//       </div>

//       {/* Input Area */}
//       <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid #ddd', display: 'flex', gap: '0.5rem' }}>
//         <input
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={handleTyping}
//           placeholder="Type your message..."
//           style={{
//             flex: 1,
//             padding: '10px',
//             borderRadius: '20px',
//             border: '1px solid #ccc',
//             fontSize: '1rem'
//           }}
//         />
//         <button
//           type="submit"
//           style={{
//             padding: '10px 20px',
//             backgroundColor: '#007bff',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '20px',
//             fontSize: '1rem'
//           }}
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   )
// }

// export default ChatPage
