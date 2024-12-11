import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Paper, Alert, Dialog, DialogContent, DialogActions } from '@mui/material';
import { useUser } from './UserContext';  




const Ticketing = () => {
  const { userFirstName } = useUser();
  const [ticketData, setTicketData] = useState({
    TicketTitle: '',
    TicketDesc: '',
    TicketServiceType: '',
    TicketServiceFor: '',
    TicketRequestedBy: '',
    TicketStatus: '2', // Default value for Ticket Status
    NumOfComputers: '',
    NumOfUsers: '',
    TicketDeleteStatus: 0, // Default value for delete status
    TicketDepartment: '',
    TicketActiveStatus: 1,  // Default value for active status
  });
  




  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loginPrompt, setLoginPrompt] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData({ ...ticketData, [name]: value });
  };


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Making the POST request with credentials
      const response = await axios.post('http://localhost:8080/create-ticket', ticketData, { withCredentials: true });
      setSuccess(response.data.message);

      // Reset the form after submission
      setTicketData({
        TicketDepartment: '',
        TicketTitle: '',
        TicketDesc: '',
        TicketRequestedBy:'',
        TicketServiceType: '',
        TicketServiceFor: '',
        TicketStatus: '1',
        TicketStatusICT: '1', // Reset to default value
        NumOfComputers: '',
        NumOfUsers: '',
        TicketDeleteStatus: 0, // Reset to default value
        TicketActiveStatus: 1,   // Reset to default value
        
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // If user is not logged in, show login prompt
        setLoginPrompt(true);
      } else {
        setError(error.response?.data?.message || 'Error creating ticket');
      }
    }
  };

  const handleLoginRedirect = () => {
    setLoginPrompt(false);
    window.location.href = '/login'; // Redirect to login page
  };

  const handleClosePrompt = () => {
    setLoginPrompt(false);
  };
  


  useEffect(() => {
    // Fetch the session data on component mount
    const fetchSessionData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/get-session', { withCredentials: true });
        const { userFirstName } = response.data;
        // Set the first name in the ticket data
        setTicketData(prevData => ({
          ...prevData,
          TicketRequestedBy: userFirstName,
        }));
      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    };

    fetchSessionData();
  }, []);

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={6} style={{ padding: '16px', marginTop: '32px' }}>
        <Typography variant="h5" gutterBottom>
          Ticketing System
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Department / Branch Code"
            name="TicketDepartment"
            value={ticketData.TicketDepartment}
            placeholder = "ex: ICT Main Office"
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Ticket Title"
            name="TicketTitle"
            value={ticketData.TicketTitle}
            placeholder = ""
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Client / Name"
            name="TicketRequestedBy"
            value={ticketData.TicketRequestedBy}
            placeholder={ticketData.TicketRequestedBy || ""}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Ticket Description"
            name="TicketDesc"
            value={ticketData.TicketDesc}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Service Types"
            name="TicketServiceType"
            value={ticketData.TicketServiceType}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Service For"
            name="TicketServiceFor"
            value={ticketData.TicketServiceFor}
            placeholder={""}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Number of Computers"
            name="NumOfComputers"
            type="number"
            value={ticketData.NumOfComputers}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Number of Users"
            name="NumOfUsers"
            type="number"
            value={ticketData.NumOfUsers}
            onChange={handleChange}
          />
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '16px' }}
          >
            Submit Ticket
          </Button>
        </form>
      </Paper>

      {/* Login Prompt Modal */}
      <Dialog open={loginPrompt} onClose={handleClosePrompt}>
        <DialogContent>
          <Typography variant="h6" color="error">
            Please log in to continue
          </Typography>
          <Typography variant="body2">
            You must be logged in to submit a ticket. Click below to go to the login page.
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
    </Container>
  );
};

export default Ticketing;
