import React from 'react'

function Home() {
  const name = localStorage.getItem('userName') || 'Guest'

  return (
    <div>
      <h1>Welcome, {name}</h1>
    </div>
  )
}

export default Home
