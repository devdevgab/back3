import React from 'react';
import './css/Footer.css'; // Optional: Add styles for the footer

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} AimCoop The Choice of The Filipino</p>
    </footer>
  );
};

export default Footer;