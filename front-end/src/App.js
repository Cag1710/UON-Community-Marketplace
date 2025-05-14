import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoggedOutHome from './pages/LoggedOutHome';
import LoggedInHome from './pages/LoggedInHome'; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoggedOutHome />} />
        <Route path="/home" element={<LoggedInHome />} />
      </Routes>
    </Router>
  );
}

export default App;
