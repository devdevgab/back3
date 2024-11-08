import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Paper, Alert, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  position: 'sticky', // Fix header position
  top: 0, // Stick to the top of the table
  zIndex: 1, // Ensure it's above the table rows
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const AdminDashboard = () => {
  const [userData, setUserData] = useState({
    FirstName: '',
    LastName: '',
    Username: '',
    Password: '',
    Email: '',
    Phone: '',
    Department: '',
  });
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  // const sessionRole = req.session.role; 

  useEffect(() => {
    const fetchUsers = async () => {

      try {
        // console.log("this is the role in admin Dashboard",sessionRole)
        const response = await axios.get('http://localhost:8080/admin-all-users', { withCredentials: true });
        setUsers(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch users');
      }
    };
    fetchUsers();
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8080/create', userData, { withCredentials: true });
      setSuccess('User added successfully');
      setUserData({
        FirstName: '',
        LastName: '',
        Username: '',
        Password: '',
        Email: '',
        Phone: '',
        Department: '',
      }); // Reset form
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleRoleChange = async (username, currentRole, userId) => {
    try {
      // Check the current role and send the appropriate request
      const route = currentRole === 0 ? `/make-user/${userId}` : `/make-admin/${userId}`;  // Toggle the role and include userId in the URL
  
      const response = await axios.put(`http://localhost:8080${route}`, {}, { withCredentials: true });  // Send empty object if no body needed
  
      setSuccess(response.data.message);  // Show success message
  
      // Update the users state to reflect the role change
      setUsers(users.map((user) => 
        user.username === username ? { ...user, role: currentRole === 1 ? 0 : 1 } : user
      ));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user role');
    }
  };
  
  return (
    <Container 
      component="main" 
      maxWidth="lg" 
      sx={{ 
        display: 'flex', 
        gap: '32px', 
        marginTop: '32px', 
        minHeight: '100vh', // Ensure it takes full height
        paddingBottom: '32px', // Ensure space at the bottom
        flexDirection: 'row', // Align items horizontally
        justifyContent: 'space-between', // Add space between the form and table
      }}
    >
      {/* Left Box - Form */}
      <Box sx={{ flex: 0.5 }}>
        <Paper elevation={6} style={{ padding: '16px' }}>
          <Typography variant="h5" gutterBottom>Create User</Typography>
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="First Name"
              name="FirstName"
              value={userData.FirstName}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Last Name"
              name="LastName"
              value={userData.LastName}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Username"
              name="Username"
              value={userData.Username}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              name="Password"
              type="password"
              value={userData.Password}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email"
              name="Email"
              type="email"
              value={userData.Email}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Phone"
              name="Phone"
              type="number"
              value={userData.Phone}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Department"
              name="Department"
              value={userData.Department}
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
              Create User
            </Button>
          </form>
        </Paper>
      </Box>
    
      {/* Right Box - User List Table */}
      <Box sx={{ flex: 1 }}>
        <Paper elevation={6} style={{ padding: '16px' }}>
          <Typography variant="h5" gutterBottom>User List</Typography>
          <TableContainer sx={{ maxHeight: 400, overflowY: 'auto' }}> {/* Added scrollable height */}
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{ textAlign: 'center' }}>Username</StyledTableCell>
                  <StyledTableCell sx={{ textAlign: 'center' }}>Email</StyledTableCell>
                  <StyledTableCell sx={{ textAlign: 'center' }}>Phone</StyledTableCell>
                  <StyledTableCell sx={{ textAlign: 'center' }}>Department</StyledTableCell>
                  <StyledTableCell sx={{ textAlign: 'center' }}>Role</StyledTableCell>
                  <StyledTableCell sx={{ textAlign: 'center' }}>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <StyledTableRow key={user.userId}> 
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.userEmail}</TableCell>
                    <TableCell>{user.userPhone}</TableCell>
                    <TableCell>{user.departmentName}</TableCell>
                    <TableCell>{user.role === 1 ? 'Admin' : 'User'}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color={user.role === 1 ? 'secondary' : 'primary'}
                        onClick={() => handleRoleChange(user.username, user.role === 1 ? 0 : 1, user.userId)}
                      >
                        Make {user.role === 1 ? 'User' : 'Admin'}
                      </Button>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
