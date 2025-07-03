import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const RequestDashboard = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchRequests = async () => {
    const res = await fetch('https://foodmed-server2.onrender.com/requests')
    const data = await res.json()
    setRequests(data)
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const confirmRequest = async (id, email, phone) => {
    const now = new Date()
    const confirmation = {
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: 'Lagos Island',
      email,
      phone
    }

    setLoading(true)
    const res = await fetch(`https://foodmed-server2.onrender.com/request/update/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(confirmation)
    })
    const result = await res.json()
    alert(result.message)
    await fetchRequests()
    setLoading(false)
  }

  const deleteConfirmed = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this confirmed request?')
    if (!confirm) return

    const res = await fetch(`https://foodmed-server2.onrender.com/request/delete/${id}`, {
      method: 'DELETE'
    })
    const result = await res.json()
    alert(result.message)
    await fetchRequests()
  }

  return (
    <div style={{ padding: 20, marginBottom: 45}}>
      <h2>📦 Food Requests</h2>

      <AnimatePresence>
        {requests.map(req => (
          <motion.div
            key={req.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{
              margin: '10px 0',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#fafafa',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            {req.imageUrl && (
              <img
                src={`https://foodmed-server2.onrender.com${req.imageUrl}`}
                alt="Food"
                style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }}
              />
            )}
            <p><strong>🍽 Food:</strong> {req.foodName}</p>
            <p><strong>Status:</strong> {req.status}</p>

            {req.status === 'pending' && (
              <button
                onClick={() => confirmRequest(req.id, req.email, req.phone)}
                disabled={loading}
                style={{ marginRight: 10 }}
              >
                {loading ? 'Confirming...' : '✅ Confirm Request'}
              </button>
            )}

            {req.status === 'confirmed' && (
              <>
                <p style={{ color: 'green' }}>✅ Confirmed</p>
                <button
                  onClick={() => deleteConfirmed(req.id)}
                  style={{
                    backgroundColor: 'crimson',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '5px'
                  }}
                >
                  🗑 Delete
                </button>
              </>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default RequestDashboard
