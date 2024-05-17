import React from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Home from "../components/Home.jsx";
import Watch from '../components/Watch.jsx';
import Allanime from "../components/Allanime.jsx";
import User from "../components/User.jsx";
import News from "../components/News.jsx";
import Registration from "../components/Registration.jsx";
import Login from '../components/Login.jsx';
import Adminlogin from '../components/Adminlogin.jsx';
import Adminreg from '../components/Adminreg.jsx';
import Upload from '../components/Upload.jsx';
import Ads from "../components/ads.txt"

const Routing = () => {

  return (
    
  
        <Routes>
          <Route path='/' element={<Home />} exact  />
          <Route path='/watch/:name/:seo/:episode' element={<Watch />} />
          <Route path='/all/:type' element={<Allanime />} />
          <Route path='/user/:username' element={<User />} />
          <Route path='/news' element={<News />} />
          <Route path='/register' element={<Registration />} />
          <Route path='/login' element={<Login />} />
          <Route path='/adminlogin' element={<Adminlogin />} />
          <Route path='/adminreg' element={<Adminreg />} />
          <Route path='/upload' element={<Upload />} />
          <Route path='/ads.txt' element={<Ads />} />
          {/* Add more routes as needed */}
          {/* Redirect to 404 page for unknown routes */}
          <Route path='*' element={<Navigate to='/404' />} />
        </Routes>
   
    
    
  )
}

export default Routing
