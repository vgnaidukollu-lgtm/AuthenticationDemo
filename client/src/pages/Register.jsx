import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api'

export default function Register(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError('')
    setLoading(true)
    try{
      const res = await API.post('/auth/register', { email, password })
      localStorage.setItem('token', res.data.token)
      navigate('/demo')
    }catch(err){
      setError(err.response?.data?.error || 'Registration failed')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="container auth-container">
      <h2>Create account</h2>
      <form onSubmit={submit} className="form">
        {error && <div className="form-error">{error}</div>}
        <label>Email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label>
        <label>Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label>
        <div className="form-actions">
          <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
          <Link to="/demo">Back to demo</Link>
        </div>
      </form>
    </div>
  )
}


