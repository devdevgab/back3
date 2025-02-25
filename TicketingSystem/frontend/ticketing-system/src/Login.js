import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { setUserFirstName } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://192.168.10.245:8080/login', {
         Username: username,
         Password: password,
         role: role,
      }, { withCredentials: true }); // Enable session cookies


       if (response.data.userFirstName) {
        setUserFirstName(response.data.userFirstName);  // Set the userFirstName in context
        console.log('User First Name:', response.data.userFirstName);
        
      }
      if(response.data.user.role == 3){
        setSuccess(response.data.message);
        
        navigate('/pls-view');  // Redirect to Ticketing
        
      }else{
        console.log("ROLE: ", response.data.user.role);
        setSuccess(response.data.message);
        navigate('/home');  // Redirect to Ticketing
      }

      
   } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
   }
   
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} style={{ padding: '16px', marginTop: '32px' }}>
        <Typography variant="h5" sx={{display:'flex', justifyContent: 'center' }}>Login</Typography>
        <form onSubmit={handleLogin} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Button type="submit" fullWidth variant="contained" color="primary">
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;