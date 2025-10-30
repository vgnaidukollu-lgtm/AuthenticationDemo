import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api'

export default function DemoAuth(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function doLogin(e){
    e.preventDefault()
    setLoading(true)
    setOutput('')
    try{
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      if (res.data?.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user))
      }
      setOutput(`Logged in as ${res.data.user.email}`)
      navigate('/welcome', { replace: true })
    }catch(err){
      setOutput(`Login failed: ${err.response?.data?.error || err.message}`)
    }finally{
      setLoading(false)
    }
  }

  // removed callProtected for minimal demo

  // Logout moved to Welcome page

  return (
    <div className="container" style={{maxWidth: 480}}>
      <h2>Minimal Auth Demo</h2>
      <form onSubmit={doLogin} className="form">
        <label>Email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label>
        <label>Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label>
        <div className="form-actions">
          <button type="submit" disabled={loading}>{loading ? 'Working...' : 'Login'}</button>
        </div>
      </form>
      {output && <pre style={{marginTop: 16, background:'#f6f8fa', padding:12}}>{output}</pre>}
      <p style={{marginTop:16}}>
        New user? <Link to="/register">Register here</Link>
      </p>
    </div>
  )
}


