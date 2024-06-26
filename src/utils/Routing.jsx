import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from "../components/Home.jsx";
import Watch from '../components/Watch.jsx';
import Allanime from '../components/Allanime.jsx';
import User from '../components/User.jsx';
import News from '../components/News.jsx';
import Registration from '../components/Registration.jsx';
import Login from '../components/Login.jsx';
import Adminlogin from '../components/Adminlogin.jsx';
import Adminreg from '../components/Adminreg.jsx';
import Upload from '../components/Upload.jsx';
import Ads from "../components/ads.txt";
import Allpopular from "../components/Allpopular.jsx";
import DecodedToken from '../components/DecodeToken.jsx';
import Edituser from '../components/Edituser.jsx';
import Loding from '../components/Loding.jsx';
import Notfound from '../components/Notfound.jsx';
import Download from '../components/Download.jsx';

const Routing = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/loading' element={<Loding />} />
      <Route path='/watch/:name/:seo/:episode' element={<Watch />} />
      <Route path='/watch/:name/:seo/:episode/register' element={<Registration />} />
      <Route path='/watch/:name/:seo/:episode/Login' element={<Login />} />
      <Route path='/watch/:name/:seo/:episode/download' element={<Download/>} />
      <Route path='/watch/:name/:seo/:episode' element={<Watch />} />
      <Route path='/watch/:name/:seo/:episode' element={<Watch />} />
      <Route path='/all/trending' element={<Allanime />} />
      <Route path='/all/trending/register' element={<Registration />} />
      <Route path='/all/trending/login' element={<Login />} />
      <Route path='/all/popular' element={<Allpopular />} />
      <Route path='/all/popular/register' element={<Registration />} />
      <Route path='/all/popular/login' element={<Login />} />
      <Route path='/user/:username' element={<User />} />
      <Route path='/edit/:username' element={<Edituser />} />
      <Route path='/news' element={<News />} />
      <Route path='/register' element={<Registration />} />
      <Route path='/login' element={<Login />} />
      <Route path='/adminlogin' element={<Adminlogin />} />
      <Route path='/adminreg' element={<Adminreg />} />
      <Route path='/upload' element={<Upload />} />
      <Route path='/ads.txt' element={<Ads />} />
      <Route path='/decode' element={<DecodedToken />} />
      {/* Add a fallback route for unknown paths */}
      <Route path='*' element={<Notfound/>} />
    </Routes>
  );
}

export default Routing;