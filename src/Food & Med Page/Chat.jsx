// src/pages/ChatPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import ProfileModal from '../Pages/ProfileModal/ProfileModal';

const socket = io('https://foodmed-server3.onrender.com');
let typingTimeout;

const emitTyping = (socket, userId, recipientId) => {
  socket.emit('typing', { senderId: userId, recipientId });
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('stopTyping', { senderId: userId, recipientId });
  }, 3000); // stop typing after 3s
};

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
  const [userProfile, setUserProfile] = useState(null); //this is for profile picture of users
  const [recipientProfile, setRecipientProfile] = useState(null); 
  const [showProfileModal, setShowProfileModal] = useState(false); 
  const [profileModalType, setProfileModalType] = useState(null);

    const location = useLocation();
    useEffect(() => {
      if (location.pathname === '/user-profile') {
        setProfileModalType('self');
        setShowProfileModal(true);
      } else {
        setShowProfileModal(false); // Close modal on route change
      }
    }, [location]);

 



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

  //for User profileImage 
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`https://foodmed-firstserver-backup.onrender.com/user-profile?email=${email}`);
        const data = await res.json();
        setUserProfile(data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    if (email) {
      fetchUserProfile();
    }
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
        const res = await fetch(`https://foodmed-server3.onrender.com/requests?role=${role}&id=${id}`);
        const data = await res.json();
        console.log('🔍 Fetching contacts for:', { role, id });


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
      
          useEffect(() => {
          const savedContact = localStorage.getItem("lastSelectedContact");
          if (savedContact && contacts.length > 0) {
            const parsed = JSON.parse(savedContact);
            const match = contacts.find(c => c.id === parsed.id);
            if (match) {
              setSelectedContact(match);
            }
          }
        }, [contacts]);


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
                `https://foodmed-server3.onrender.com/messages?senderId=${userId}&recipientId=${selectedContact.id}`
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
      const savedContact = localStorage.getItem("lastSelectedContact");
      if (savedContact && contacts.length > 0) {
        const parsed = JSON.parse(savedContact);
        const match = contacts.find(c => c.id === parsed.id);
        if (match) {
          setSelectedContact(match);
        }
      }
    }, [contacts]);


    useEffect(() => {
      let found = null;
      if (recipientId && contacts.length > 0) {
        found = contacts.find(c => c.id === recipientId);
        if (found) {
          setSelectedContact(found);
          localStorage.setItem("lastSelectedContact", JSON.stringify(found));
          localStorage.setItem("lastRecipientId", found.id);
        }
      }
    }, [recipientId, contacts]);


  useEffect(() => {
    if (!selectedContact || !userId) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `https://foodmed-server3.onrender.com/messages?senderId=${userId}&recipientId=${selectedContact.id}`
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

      setText('');
    };


  //handle change of text in the input field and showing typing while user is typing
  const handleTextChange = (e) => {
    setText(e.target.value);
    if (selectedContact) {
      emitTyping(socket, userId, selectedContact.id);
    }
  };

 
    //listening to typing
    useEffect(() => {
      const handleTyping = ({ senderId }) => {
        if (senderId === selectedContact?.id) {
          setIsTyping(true);
        }
      };

      const handleStopTyping = ({ senderId }) => {
        if (senderId === selectedContact?.id) {
          setIsTyping(false);
        }
      };

      socket.on('typing', handleTyping);
      socket.on('stopTyping', handleStopTyping);

      return () => {
        socket.off('typing', handleTyping);
        socket.off('stopTyping', handleStopTyping);
      };
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

      //For recipient profile image
        useEffect(() => {
          const fetchRecipientProfile = async () => {
            if (selectedContact?.id) {
              try {
                const res = await fetch(`https://foodmed-firstserver-backup.onrender.com/user-profile?email=${selectedContact.id}`);
                const data = await res.json();
                setRecipientProfile(data);
              } catch (err) {
                console.error('Error fetching recipient profile:', err);
              }
            }
          };

          fetchRecipientProfile();
        }, [selectedContact]);


  return (
    <>
    <div style={styles.container}>
            {/* ✅ USER (SELF) PROFILE IMAGE */}
      {userProfile?.profileImage && (
        <img
          src={userProfile.profileImage}
          alt="My Profile"
          style={{
            position: 'absolute',
            top: '18px',
            right: '10px',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 0 5px rgba(0,0,0,0.2)',
            cursor: 'pointer'
          }}
          onClick={() => {
            setProfileModalType('self'); // ✅ Opens modal for self
            setShowProfileModal(true);
          }}
        />
      )}
  
      <div style={styles.sidebar}>
        <h3>Contacts</h3>
        {contacts.map((contact, idx) => (
          <div
            key={idx}
            style={{
              ...styles.contactItem,
              backgroundColor: selectedContact?.id === contact.id ? '#ddd' : '#fff'
            }}
            onClick={() => {
                      setSelectedContact(contact);
                      localStorage.setItem("lastSelectedContact", JSON.stringify(contact));
                      localStorage.setItem("lastRecipientId", contact.id);
                    }}
                    >
            {contact.name} {onlineUsers.includes(contact.id) ? '🟢' : '🔴'}
          </div>
        ))}
      </div>

      <div style={styles.chatArea}>
        {selectedContact ? (
          <>
          {/* ✅ RECIPIENT PROFILE IMAGE */}
          {recipientProfile?.profileImage && (
            <img
              src={recipientProfile.profileImage}
              alt="Recipient"
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '0.5rem',
                cursor: 'pointer'
              }}
              onClick={() => {
                setProfileModalType('recipient'); // ✅ Opens modal for recipient
                setShowProfileModal(true);
              }}
            />
          )}
        {/* 👆 IT ENDS THERE */}
            <h4>Chat with {selectedContact.name}</h4>
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
                {/* Chat indicator */}
               {isTyping && <div style={styles.typingIndicator}>{selectedContact.name} is typing...</div>}

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
       {/* ✅ SINGLE SHARED PROFILE MODAL COMPONENT */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profileData={profileModalType === 'self' ? userProfile : recipientProfile}
      />
    </>
  );
};

const styles = {
  container: { display: 'flex', height: '80vh', position: 'relative', },

  sidebar: { width: '30%', borderRight: '1px solid #ccc', padding: '1rem', overflowY: 'auto' },

  chatArea: { flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem' },

  contactItem: { padding: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer', borderRadius: '5px' },

  typingIndicator: { fontStyle: 'italic', color: '#888', marginBottom: '0.8rem', marginTop:'1.2rem' }, 

  messages: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' },

  message: { padding: '0.5rem 1rem', borderRadius: '10px', maxWidth: '60%' },

  timestamp: { fontSize: '0.75rem', color: '#666', marginTop: 4, textAlign: 'right' },

  inputRow: { display: 'flex', gap: '0.5rem', marginBottom: -70 },

  input: { flex: 1, padding: '0.5rem', borderRadius: '20px', border: '1px solid #ccc' },

  button: { padding: '0.5rem 1rem', borderRadius: '20px', backgroundColor: 'orange', color: 'white', border: 'none' }
};

export default ChatPage;

























































































































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
