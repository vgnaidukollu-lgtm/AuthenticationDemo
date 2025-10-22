import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import TodoList from './pages/TodoList'
import TodoForm from './pages/TodoForm'
import './index.css'
import { FiBook } from 'react-icons/fi'

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <header>
          <h1><span className="logo"><FiBook size={20} /></span>Simple CRUD (React + Node + MySQL)</h1>
          <nav>
            <Link to="/">Todos</Link> | <Link to="/new">New Todo</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<TodoList />} />
            <Route path="/new" element={<TodoForm />} />
            <Route path="/edit/:id" element={<TodoForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
