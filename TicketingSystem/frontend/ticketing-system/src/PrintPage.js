// PrintPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PrintPage = () => {
  const { id } = useParams(); // Get the ticket ID from the URL
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`http://192.168.10.245:8080/tickets/${id}`, { withCredentials: true });
        setSelectedTicket(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching ticket');
      }
    };

    fetchTicket();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!selectedTicket) {
    return <p>Ticket not found</p>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Ticket Details</h1>
      <p><strong>ID:</strong> {selectedTicket.ticketId}</p>
      <p><strong>Title:</strong> {selectedTicket.ticketTitle}</p>
      <p><strong>Description:</strong> {selectedTicket.ticketDesc}</p>
      <p><strong>Date:</strong> {selectedTicket.created}</p>
      {/* Add more fields as needed */}
    </div>
  );
};

export default PrintPage;