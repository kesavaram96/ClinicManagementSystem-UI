import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Logout from './Pages/Logout';
import Home from './Pages/Home';
import SideMenu from './components/SideMenu';


function App() {
  return (

    <>
    <Router>
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home/*" element={<Home />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
