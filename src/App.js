import React, { useState } from 'react';
import './App.css';
import Home from './pages/components/home'
import Header from './pages/components/header'
import Login from './pages/login';
import Signup from './pages/signup';
import Assessment from './pages/assessment';
import Profile from './pages/profile'; 
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  return (
    <div className="App">
      <BrowserRouter>
        {isLoggedIn && <Header setIsLoggedIn={setIsLoggedIn}/>}
        <Routes>
          <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='/signup' element={<Signup setIsLoggedIn={setIsLoggedIn} />}/>
          <Route path='/assessment' element={isLoggedIn ? <Assessment/> : <Navigate to='login'/>}/>
          <Route path='/profile' element={isLoggedIn ? <Profile/> : <Navigate to='login'/>}/>
          <Route path='/' element={isLoggedIn ? <Home/> : <Navigate to='login'/> }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
