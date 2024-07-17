import React from 'react'
import {BrowserRouter as Router, Route, Routes, Switch, BrowserRouter} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import SetAvatar from './pages/SetAvatar'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/setAvatar' element={<SetAvatar />}></Route>
        <Route path="/" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App