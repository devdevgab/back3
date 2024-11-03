import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Ticketing from './Ticketing'; 
import Home from './Home';
import Navbar from './Navbar';
import AdminTickets from './AdminTickets'
const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/ticketing" element={<Ticketing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/admin/dashboard" element={<Home />} />
          <Route path="/admin/tickets" element={<AdminTickets />} />
          {/* Redirect any unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;