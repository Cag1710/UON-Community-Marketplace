import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoggedOutHome from './pages/LoggedOutHome';
import LoggedInHome from './pages/LoggedInHome'; 
<<<<<<< Updated upstream
import ListingsPage from './pages/ListingsPage';
=======

>>>>>>> Stashed changes


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoggedOutHome />} />
        <Route path="/home" element={<LoggedInHome />} />
<<<<<<< Updated upstream
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="*" element={<div>404 - Not Found</div>} />
=======
>>>>>>> Stashed changes
      </Routes>
    </Router>
  );
}

export default App;
