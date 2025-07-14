// src/pages/ChatPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:3005');

const ChatPage = () => {
  const { recipientId } = useParams();
  const email = localStorage.getItem('userEmail') || localStorage.getItem('donorEmail');
  const userId = email;

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);


  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!email) return;
    socket.emit('online', userId); 
    socket.on('onlineUsers', (list) => {
      console.log('🟢 Online Users List:', list);
      setOnlineUsers(list);
    });
    return () => socket.off('onlineUsers');
  }, [email]);

  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      if (
        (msg.senderId === userId && msg.recipientId === selectedContact?.id) ||
        (msg.senderId === selectedContact?.id && msg.recipientId === userId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off('receiveMessage');
  }, [selectedContact]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const role = localStorage.getItem('role');
        const id = localStorage.getItem('userId') || localStorage.getItem('donorId');
        const res = await fetch(`http://localhost:3005/requests?role=${role}&id=${id}`);
        const data = await res.json();


        const unique = {};
        
        const formatted = data.map(r => {
          return {
              id: role === 'donor' ? r.userEmail : r.donorEmail,
              name: role === 'donor' ? r.userName || r.userEmail : r.donorName || r.donorEmail
            };
        }).filter(c => {
          if (unique[c.id]) return false;
          unique[c.id] = true;
          return true;
        });

        setContacts(formatted);
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
      }
    };

    fetchContacts();
  }, []);


          // Load messages from localStorage on chat change
        useEffect(() => {
          if (selectedContact) {
            const savedMessages = localStorage.getItem(`chat_${userId}_${selectedContact.id}`);
            if (savedMessages) {
              setMessages(JSON.parse(savedMessages));
            }
          }
        }, [selectedContact, userId]);

        // Fetch fresh messages from backend and replace current messages
        useEffect(() => {
          if (!selectedContact || !userId) return;
          const fetchMessages = async () => {
            try {
              const res = await fetch(
                `http://localhost:3005/messages?senderId=${userId}&recipientId=${selectedContact.id}`
              );
              const data = await res.json();
              setMessages(data);
            } catch (err) {
              console.error('Failed to load messages:', err);
            }
          };
          fetchMessages();
        }, [selectedContact]);

        // Save messages to localStorage on every update
        useEffect(() => {
          if (selectedContact) {
            localStorage.setItem(`chat_${userId}_${selectedContact.id}`, JSON.stringify(messages));
          }
        }, [messages, selectedContact, userId]);


  useEffect(() => {
    if (recipientId && contacts.length > 0) {
      const found = contacts.find(c => c.id === recipientId);
      if (found) setSelectedContact(found);
    }
  }, [recipientId, contacts]);

  useEffect(() => {
    if (!selectedContact || !userId) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:3005/messages?senderId=${userId}&recipientId=${selectedContact.id}`
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };
    fetchMessages();
  }, [selectedContact]);

  const sendMessage = () => {
    if (!text.trim() || !selectedContact) return;
    socket.emit('sendMessage', {
      senderId: userId,
      recipientId: selectedContact.id,
      text
    });
    setMessages((prev) => [...prev, { senderId: userId, recipientId: selectedContact.id, text }]);
    setText('');
  };

  //handle change of text in the input field and showing typing while user is typing
  const handleTextChange = (e) => {
      setText(e.target.value);
      socket.emit('typing', { senderId: userId, recipientId: selectedContact?.id });
    };
 
    //listening to typing
    useEffect(() => {
      socket.on('typing', ({ senderId }) => {
        if (senderId === selectedContact?.id) {
          setIsTyping(true);
          // Clear after 3 seconds
          setTimeout(() => setIsTyping(false), 3000);
        }
      });
      return () => socket.off('typing');
    }, [selectedContact]);

    //chat history
    useEffect(() => {
        if (selectedContact) {
          localStorage.setItem(`chat_${userId}_${selectedContact.id}`, JSON.stringify(messages));
        }
      }, [messages, selectedContact, userId]);

      //chat history 
      useEffect(() => {
        if (selectedContact) {
          const savedMessages = localStorage.getItem(`chat_${userId}_${selectedContact.id}`);
          if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
          }
        }
      }, [selectedContact, userId]);




  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h3>Contacts</h3>
        {contacts.map((contact, idx) => (
          <div
            key={idx}
            style={{
              ...styles.contactItem,
              backgroundColor: selectedContact?.id === contact.id ? '#ddd' : '#fff'
            }}
            onClick={() => setSelectedContact(contact)}
          >
            {contact.name} {onlineUsers.includes(contact.id) ? '🟢' : '🔴'}
          </div>
        ))}
      </div>

      <div style={styles.chatArea}>
        {selectedContact ? (
          <>
            <h4>Chat with {selectedContact.name}</h4>
            {isTyping && <div style={styles.typingIndicator}>{selectedContact.name} is typing...</div>}

            <div style={styles.messages}>
              {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.message,
                      alignSelf: msg.senderId === userId ? 'flex-end' : 'flex-start',
                      backgroundColor: msg.senderId === userId ? '#dcf8c6' : '#fff'
                    }}
                  >
                    {msg.text}
                    {msg.fileUrl && (
                      <div style={{ marginTop: 5 }}>
                        <img src={msg.fileUrl} alt="uploaded file" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                      </div>
                    )}
                    <div style={styles.timestamp}>
                      {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}

              <div ref={messagesEndRef} />
            </div>

            <div style={styles.inputRow}>
              <input
                value={text}
                onChange={handleTextChange}
                placeholder="Type your message..."
                style={styles.input}
              />
              <button onClick={sendMessage} style={styles.button}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a chat to begin.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', height: '80vh' },

  sidebar: { width: '30%', borderRight: '1px solid #ccc', padding: '1rem', overflowY: 'auto' },

  chatArea: { flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem' },

  contactItem: { padding: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer', borderRadius: '5px' },

  typingIndicator: { fontStyle: 'italic', color: '#888', marginBottom: '0.5rem', }, 

  messages: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' },

  message: { padding: '0.5rem 1rem', borderRadius: '10px', maxWidth: '60%' },

  timestamp: { fontSize: '0.75rem', color: '#666', marginTop: 4, textAlign: 'right' },

  inputRow: { display: 'flex', gap: '0.5rem', marginBottom: -70 },

  input: { flex: 1, padding: '0.5rem', borderRadius: '20px', border: '1px solid #ccc' },

  button: { padding: '0.5rem 1rem', borderRadius: '20px', backgroundColor: 'orange', color: 'white', border: 'none' }
};

export default ChatPage;















// import React, { useEffect, useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3005'); // Your backend server

// const ChatPage = () => {
//   const { recipientId } = useParams();
//   const storedRecipientId = localStorage.getItem('lastRecipientId');
//   const chatWith = recipientId || storedRecipientId;

//   const email = localStorage.getItem('userEmail') || localStorage.getItem('donorEmail');
//   const role = localStorage.getItem('role');
//   const userId = email;

//   const [contacts, setContacts] = useState([]);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState('');
//   const messagesEndRef = useRef(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);

//   // 👥 Load contacts based on food request relationship
//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const res = await fetch(`http://localhost:3005/requests?role=${role}&id=${userId}`);
//         const data = await res.json();

//         const uniqueEmails = new Set();
//         const contactsList = [];

//         data.forEach(req => {
//           const contactEmail = role === 'donor' ? req.email : req.donorEmail;
//           if (contactEmail && !uniqueEmails.has(contactEmail)) {
//             uniqueEmails.add(contactEmail);
//             contactsList.push({
//               id: contactEmail,
//               name: contactEmail,
//               foodName: req.foodName
//             });

//             // 🆕 Automatically create room between user & donor
//             socket.emit('joinRoom', {
//               senderId: email,
//               recipientId: contactEmail
//             });
//           }
//         });

//         setContacts(contactsList);

//         // Auto-select contact if redirected from another page
//         if (chatWith) {
//           const found = contactsList.find(c => c.id === chatWith);
//           if (found) setSelectedContact(found);
//         }

//       } catch (err) {
//         console.error('Failed to fetch contacts:', err);
//       }
//     };

//     fetchContacts();
//   }, [role, userId, chatWith, email]);

//   // 🟢 Handle online users
//   useEffect(() => {
//     if (!email) return;

//     socket.emit('online', email);

//     socket.on('onlineUsers', (list) => setOnlineUsers(list));

//     return () => {
//       socket.off('onlineUsers');
//     };
//   }, [email]);

//   // 💬 Fetch messages & setup listener
//   useEffect(() => {
//     if (!selectedContact) return;

//     // Join room once contact is selected
//     socket.emit('joinRoom', {
//       senderId: email,
//       recipientId: selectedContact.id
//     });

//     // Load past messages
//     fetch(`http://localhost:3005/messages?senderId=${email}&recipientId=${selectedContact.id}`)
//       .then(res => res.json())
//       .then(setMessages)
//       .catch(console.error);

//     // Receive real-time messages
//     socket.on('receiveMessage', (msg) => {
//       if (
//         (msg.senderId === email && msg.recipientId === selectedContact.id) ||
//         (msg.senderId === selectedContact.id && msg.recipientId === email)
//       ) {
//         setMessages(prev => [...prev, msg]);
//       }
//     });

//     return () => {
//       socket.off('receiveMessage');
//     };
//   }, [selectedContact, email]);

//   const sendMessage = () => {
//     if (!text.trim() || !selectedContact) return;

//     const msg = {
//       senderId: email,
//       recipientId: selectedContact.id,
//       text
//     };

//     socket.emit('sendMessage', msg);

//     setMessages(prev => [...prev, { ...msg, timestamp: new Date().toISOString() }]);
//     setText('');
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const isOnline = (id) => onlineUsers.includes(id);

//   return (
//     <div style={styles.wrapper}>
//       {/* Sidebar */}
//       <div style={styles.sidebar}>
//         <h3>Chats</h3>
//         <ul style={styles.list}>
//           {contacts.map(contact => (
//             <li
//               key={contact.id}
//               onClick={() => {
//                 setSelectedContact(contact);
//                 localStorage.setItem('lastRecipientId', contact.id);
//               }}
//               style={{
//                 ...styles.listItem,
//                 background: selectedContact?.id === contact.id ? '#ddd' : 'transparent',
//                 cursor: 'pointer',
//               }}
//             >
//               <span style={{ marginRight: 8 }}>
//                 {isOnline(contact.id) ? '🟢' : '🔴'}
//               </span>
//               <div>
//                 <strong>{contact.name}</strong><br />
//                 <small>Food: {contact.foodName}</small>
//               </div>
//             </li>
//           ))}

//           {contacts.length === 0 && (
//             <p style={{ padding: '1rem', color: '#555' }}>
//               No contacts available. Make or receive a food request to chat.
//             </p>
//           )}
//         </ul>
//       </div>

//       {/* Chat Box */}
//       <div style={styles.chatContainer}>
//         {selectedContact ? (
//           <>
//             <h3>Chat with {selectedContact.name}</h3>
//             <div style={styles.chatBox}>
//               {messages.map((msg, idx) => (
//                 <div
//                   key={idx}
//                   style={{
//                     ...styles.message,
//                     alignSelf: msg.senderId === email ? 'flex-end' : 'flex-start',
//                     background: msg.senderId === email ? '#dcf8c6' : '#fff'
//                   }}
//                 >
//                   <div>{msg.text}</div>
//                   <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>

//             <div style={styles.inputRow}>
//               <input
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 style={styles.input}
//                 placeholder="Type your message..."
//               />
//               <button onClick={sendMessage} style={styles.button}>Send</button>
//             </div>
//           </>
//         ) : (
//           <p style={{ padding: '2rem' }}>Select a chat to begin.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

// // 🔧 Styles
// const styles = {
//   wrapper: {
//     display: 'flex',
//     height: '100vh'
//   },
//   sidebar: {
//     width: '30%',
//     borderRight: '1px solid #ccc',
//     padding: '1rem',
//     overflowY: 'auto'
//   },
//   list: {
//     listStyle: 'none',
//     padding: 0
//   },
//   listItem: {
//     padding: '0.5rem',
//     borderBottom: '1px solid #eee'
//   },
//   chatContainer: {
//     flex: 1,
//     padding: '1rem',
//     display: 'flex',
//     flexDirection: 'column'
//   },
//   chatBox: {
//     flex: 1,
//     overflowY: 'auto',
//     marginBottom: '1rem',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '0.5rem'
//   },
//   message: {
//     padding: '0.5rem 1rem',
//     borderRadius: '10px',
//     maxWidth: '70%'
//   },
//   inputRow: {
//     display: 'flex',
//     gap: '1rem',
//     marginBottom:'48px'
//   },
//   input: {
//     flex: 1,
//     padding: '0.5rem',
//     borderRadius: '50px',
//     border:'1px solid grey'
//   },
//   button: {
//     padding: '0.5rem 1rem',
//     background: 'orange',
//     border: 'none',
//     color: 'white',
//     cursor: 'pointer'
//   }
// };










































































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
