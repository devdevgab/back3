import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Styled Table Cell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  position: 'sticky',
  top: 0,
  zIndex: 1,
}));

// Styled Table Row
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const AdminDashboard = () => {
  // State Variables
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
  const [searchQuery, setSearchQuery] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Fetch Users on Component Mount or Success Change
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin-all-users', {
          withCredentials: true,
        });
        setUsers(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch users');
      }
    };
    fetchUsers();
  }, [success]);

  // Auto-clear Alerts after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Handle Form Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Handle User Creation Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:8080/create', userData, { withCredentials: true });
      setSuccess('User added successfully');
      setUserData({
        FirstName: '',
        LastName: '',
        Username: '',
        Password: '',
        Email: '',
        Phone: '',
        Department: '',
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create user');
    }
  };

  // Handle Role Change
  const handleRoleChange = async (username, currentRole, userId) => {
    try {
      const route = currentRole === 0 ? `/make-user/${userId}` : `/make-admin/${userId}`;
      const response = await axios.put(`http://localhost:8080${route}`, {}, { withCredentials: true });

      setSuccess(response.data.message);
      setUsers(
        users.map((user) =>
          user.username === username ? { ...user, role: currentRole === 1 ? 0 : 1 } : user
        )
      );
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user role');
    }
  };

  // Handle Search Query
  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };
  
  // Filter Users Based on Search Query
  const filteredUsers = users.filter((user) => {
    const username = user.username || ''; // Default to empty string if undefined
    const email = user.userEmail || ''; // Default to empty string if undefined
    const phone = user.userPhone || ''; // Default to empty string if undefined
    const department = user.department || ''; // Default to empty string if undefined
  
    return (
      username.toLowerCase().includes(searchQuery) ||
      email.toLowerCase().includes(searchQuery) ||
      phone.includes(searchQuery) ||
      department.toLowerCase().includes(searchQuery)
    );
  });

  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{
        display: 'flex',
        gap: '32px',
        marginTop: '32px',
        minHeight: '100vh',
        paddingBottom: '32px',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      {/* Left Box - Form */}
      <Box sx={{ flex: 0.5 }}>
        <Paper elevation={6} style={{ padding: '16px' }}>
          <Typography variant="h5" gutterBottom>
            Create User
          </Typography>
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
              type={showPassword ? 'text' : 'password'}
              value={userData.Password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="16px">
            <Typography variant="h5" gutterBottom>
              User List
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              onChange={handleSearch}
              style={{ maxWidth: '250px' }}
            />
          </Box>
          <TableContainer sx={{ maxHeight: 400, overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Username</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Phone</StyledTableCell>
                  <StyledTableCell>Department</StyledTableCell>
                  <StyledTableCell>Role</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <StyledTableRow key={user.userId}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.userEmail}</TableCell>
                    <TableCell>{user.userPhone}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{user.role === 1 ? 'Branch Manager' : user.role === 2 ? 'Admin ' : 'User'}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color={user.role === 1 ? 'secondary' : 'primary'}
                        onClick={() =>
                          handleRoleChange(user.username, user.role === 1 ? 0 : 1, user.userId)
                        }
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
