import React, { useEffect, useState } from 'react';     
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { UserProvider } from './UserContext';
import Login from './Login';
import Ticketing from './Ticketing'; 
import Home from './Home';
import Navbar from './Navbar';
import Print from './Print';
import AdminTickets from './AdminTickets';
import AdminDashboard from './AdminDashboard';
import NewPrint from './NewPrint';
import PrintPage from './PrintPage';
import './App.css';

const AppContent = () => {
  const [isLoading, setIsLoading] = useState (true);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation(); // Get the current location
  const isNewPrintPage = location.pathname.startsWith('/ticket/');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);

    }, 2000);
    return () => clearTimeout(timer);

  

    // Fetch tickets from your API
    const fetchTickets = async () => {
      try {
        const response = await fetch('/tickets'); // Adjust the API endpoint as needed
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    

    <div className="App">
      {!isNewPrintPage && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/ticketing" element={<Ticketing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/tickets" element={<AdminTickets />} />
        <Route path="/print" element={<Print />} />
        <Route path="/ticket/:id" element={<NewPrint tickets={tickets} />} />
        <Route path="/print/:id" element={<PrintPage />} />
        {/* Redirect any unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
   

   </div>
  );
};

const App = () => (
  <UserProvider>
    <Router>
      <AppContent />
    </Router>
  </UserProvider>
);

export default App;
