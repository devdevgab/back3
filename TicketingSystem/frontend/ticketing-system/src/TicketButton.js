// TicketButton.js
import React from 'react';

const TicketButton = ({ ticketId }) => {
    const openTicket = (id) => {
        window.open(`http://192.168.10.245:8080/tickets/${id}`, '_blank');
    };

    return (
        <button onClick={() => openTicket(ticketId)}>
            Open Ticket {ticketId}
        </button>
    );
};

export default TicketButton;