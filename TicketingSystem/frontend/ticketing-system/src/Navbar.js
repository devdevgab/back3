import React, { useState } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, Box, Dialog, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { checkLoginStatus } from './api'; // Import from api.js
const Navbar = () => {
  const navigate = useNavigate();
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // New state for admin check
  const [userRole, setUserRole] = useState(null);

  const handleNavigation = async (path) => {
    const { loggedIn, role } = await checkLoginStatus(); // Use the imported function
    if (loggedIn) {
      setIsAdmin(role === 'admin'); // Set admin state
      navigate(path); // Navigate to the desired path if logged in
    } else {
      setLoginPrompt(true); // Show login prompt if not logged in
    }
  };

  const handleLoginRedirect = () => {
    setLoginPrompt(false); // Close the prompt
    navigate('/login'); // Redirect to the login page
  };

  const handleClosePrompt = () => {
    setLoginPrompt(false); // Close the prompt
  };

  const handleLogout = async () => {
    try {
        await axios.post('http://localhost:8080/logout', {}, { withCredentials: true });
        setIsAdmin(false); // Reset admin state on logout
        navigate('/'); // Redirect to login or homepage after logout
        window.location.reload(); // Reload the page
    } catch (error) {
        console.error("Error logging out:", error);
    }
};
  const fetchUserRole = async () => {
    try {
        const response = await axios.get('http://localhost:8080/check-role', { withCredentials: true });
        setUserRole(response.data.role); // Set user role from response
    } catch (error) {
        console.error('Error fetching user role:', error);
    }
};

fetchUserRole();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Ticketing System
          </Typography>
          <Box>
            <Button color="inherit" onClick={() => handleNavigation('/home')}>Home</Button>
            {/* Conditional rendering based on isAdmin state */}
            {userRole === 1 ? (
              <>
                <Button color="inherit" onClick={() => handleNavigation('/ticketing')}>Create Ticket</Button>
                <Button color="inherit" onClick={() => handleNavigation('/admin/dashboard')}>Admin Dashboard</Button>
                <Button color="inherit" onClick={() => handleNavigation('/admin/tickets')}>All Tickets</Button>
              </>
            ) : (
              <Button color="inherit" onClick={() => handleNavigation('/ticketing')}>Create Ticket</Button>
            )}
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Login Prompt Modal */}
      <Dialog open={loginPrompt} onClose={handleClosePrompt}>
        <DialogContent>
          <Typography variant="h6" color="error">
            Please log in to continue
          </Typography>
          <Typography variant="body2">
            You must be logged in to access the tickets page. Click below to go to the login page.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoginRedirect} color="primary" variant="contained">
            Login
          </Button>
          <Button onClick={handleClosePrompt} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
