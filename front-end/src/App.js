import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoggedOutHome from './pages/LoggedOutHome';
import LoggedInHome from './pages/LoggedInHome'; 
import ListingsPage from './pages/ListingsPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoggedOutHome />} />
        <Route path="/home" element={<LoggedInHome />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="*" element={<div>404 - Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
