import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Welcome(){
  const navigate = useNavigate()
  const storedUser = localStorage.getItem('user')
  let username = ''
  try {
    if (storedUser) {
      const user = JSON.parse(storedUser)
      username = user?.username || user?.email?.split('@')[0] || ''
    }
  } catch { /* ignore parse errors */ }

  return (
    <div className="container" style={{paddingTop: 24}}>
      <h1>Welcome to {username || 'User'}</h1>
      <div style={{marginTop: 16}}>
        <button onClick={() => {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          // Optionally notify server (no-op)
          fetch('http://localhost:4000/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' } }).finally(() => {
            navigate('/demo', { replace: true })
          })
        }}>Logout</button>
      </div>
    </div>
  )
}


