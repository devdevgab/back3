import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Paper, Alert, Dialog, DialogContent, DialogActions, Box, Popover, List, ListItem, ListItemButton } from '@mui/material';
import { useUser } from './UserContext';  
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/swiper-bundle.min.css';




const Ticketing = () => {
  // const { userFirstName } = useUser();
  const { userFirstName, setUserFirstName, userDepartment, setUserDepartment } = useUser();
 
  const [ticketData, setTicketData] = useState({
    TicketDepartment: '',
    BranchCode: '',
    TicketTitle: '',
    TicketDesc: '',
    TicketServiceType: '',
    TicketServiceFor: '',
    TicketRequestedBy: '',
    TicketStatus: '2', // Default value for Ticket Status
    NumOfComputers: '0',
    NumOfUsers: '0',
    TicketDeleteStatus: 0, // Default value for delete status
    TicketActiveStatus: 1,  // Default value for active status
    
  });
  



  const [branches, setBranches] = useState([]);
  const [success, setSuccess] = useState('');
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [error, setError] = useState('');
  
  const [anchorEl, setAnchorEl] = useState(null); 

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
      const response = await axios.post('http://192.168.10.245:8080/create-ticket', ticketData, { withCredentials: true });
      setSuccess(response.data.message);

      // Reset the form after submission
      setTicketData({
        TicketDepartment: '',
        BranchCode: '',
        TicketTitle: '',
        TicketRequestedBy:'', 
        TicketDesc: '',
        TicketServiceType: '',
        TicketServiceFor: '',
        TicketStatus: '1',
        TicketStatusICT: '1', // Reset to default value
        NumOfComputers: '0',
        NumOfUsers: '0',
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
  const handleBranchClick = (branchCode) => {
    setTicketData({ BranchCode: branchCode });
  };
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const handleBranchSelect = (branchCode, branchName) => {
    setTicketData((prevState) => ({
      ...prevState, // Preserve all existing fields
      BranchCode: `${branchCode} - ${branchName}`, // Update only the BranchCode field
    }));
    handlePopoverClose(); // Close the popover after selection
  };
  const open = Boolean(anchorEl);

  useEffect(() => {
    // Fetch the session data on component mount
    const fetchSessionData = async () => {
      try {
        const response = await axios.get('http://192.168.10.245:8080/get-session', { withCredentials: true });
        const { userFirstName } = response.data;
        // Set the first name in the ticket data
        setTicketData(prevData => ({
          ...prevData,
          TicketRequestedBy: userFirstName,
          TicketDepartment: response.data.userDepartment
        }));
      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    };

    const fetchBranches = async () => {
      try {
        const response = await axios.get('http://192.168.10.245:8080/get-branches');
        setBranches(response.data);
        // if (response.data.length > 0) {
        //   setTicketData({ BranchCode: response.data[0].branchCode }); // Set default value
        // }
      } catch (err) {
        console.error('Error fetching branches:', err);
      }
    };

    fetchBranches();
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
            label="Department"
            name="TicketDepartment"
            // value={ticketData.TicketDepartment || ""}
            value={ticketData.TicketDepartment || ""}
            placeholder={ticketData.TicketDepartment || ""}
            
            onChange={handleChange}
            InputProps={{
              readOnly: true,  // Makes the field not editable
            }}
          />


            {/* <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Branch Code"
            name="BranchCode"
            value={ticketData.BranchCode || ""}
            placeholder = {ticketData.BranchCode}
            onChange={handleChange}
          /> */}


          <Box>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Branch Code"
            name="BranchCode" 
            value={ticketData.BranchCode || ""}
            placeholder="Select a branch"
            onClick={handlePopoverOpen} // Open the popover when TextField is clicked
            onChange={(e) =>
              setTicketData((prevState) => ({
                ...prevState, // Preserve existing ticket data
                BranchCode: e.target.value, // Update only BranchCode
              }))
            } // Allow manual input
          />
            {/* Popover for branch selection */}
           
             </Box>

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Ticket Title"
            name="TicketTitle"
            value={ticketData.TicketTitle || ""}
        
            placeholder = "Brief Information of the concern"
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Client / Name"
            name="TicketRequestedBy"
            value={ticketData.TicketRequestedBy || ""}
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
            value={ticketData.TicketDesc || ""}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Service Types"
            name="TicketServiceType"
            value={ticketData.TicketServiceType || ""}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Service For"
            name="TicketServiceFor"
            value={ticketData.TicketServiceFor || ""}
            placeholder={"Device Brand or Device Bar Code"}
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
            value={ticketData.NumOfComputers || ""}
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
            value={ticketData.NumOfUsers || ""}
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


      <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >

              <Box p={2}>
                <Typography variant="h6" gutterBottom>
                  Select a Branch
                </Typography>
                <List>
                  {branches.map((branch) => (
                    <ListItem key={branch.branchDB_ID} disablePadding>
                      <ListItemButton onClick={() => handleBranchSelect(branch.branchCode, branch.branchName)}>
                        {branch.branchCode} - {branch.branchName}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
             </Popover>

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
