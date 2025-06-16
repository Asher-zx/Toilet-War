
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { About } from './pages/About'
/* import { Home } from './pages/Home' */
import { Landing } from './pages/Landing'
import { ReadBlog } from './pages/ReadBlog'
import { Navbar } from './component/Navbar.jsx'
import { Layout } from './component/layout.jsx'
import { Profile } from './pages/Profile.jsx'
import  {useEffect } from 'react'
import axios from 'axios'

import { ToiletWar } from './pages/ToiletWar.jsx'
import './pages/ToiletWar.css'

function App() {

useEffect(() => {
  let token = sessionStorage.getItem('User')
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}, [])

  //http://localhost:3002/landing
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/toilet-war" element={<ToiletWar />} />
          <Route path="/about" element={<About />} />
          <Route path="/readblog/:id" element={<ReadBlog />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/landing" element={<Landing />}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
