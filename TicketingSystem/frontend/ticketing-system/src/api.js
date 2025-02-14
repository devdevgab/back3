import axios from 'axios';

export const checkLoginStatus = async () => {
    try {
        const response = await axios.get('http://192.168.10.245:8080/check-login', { withCredentials: true });
        return response.data; // Return the entire response containing loggedIn and role
    } catch (error) {
        console.error('Error checking login status:', error);
        return { loggedIn: false, role: null }; // Consider user as not logged in on error
    }
};