import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    styled,
    TablePagination,
    Dialog,
    DialogContent,
    DialogActions,
    IconButton,
    Box,
    Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
    },
}));

const DetailTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: '500',
    color: theme.palette.text.primary,
    border: '1px solid #ddd',
}));

const DescriptionCell = styled(TableCell)(({ theme }) => ({
    fontWeight: '500',
    color: theme.palette.text.primary,
    border: '1px solid #ddd',
    whiteSpace: 'pre-line',
    wordWrap: 'break-word',
    maxWidth: '400px',
}));

const DialogHeader = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
}));

const CustomDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: '12px',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
    },
}));

const Home = () => {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [open, setOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [determineCloseOrOpen, setDetermineCloseOrOpen] = useState(null);

    useEffect(() => {
        let isMounted = true; // Track whether the component is mounted
    
        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://localhost:8080/tickets', { withCredentials: true });
                if (isMounted) {
                    setTickets(response.data);
                    console.log('Fetched Tickets:', response.data);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.response?.data?.message || 'Error fetching tickets');
                }
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
        fetchTickets();
        return () => {
            isMounted = false; // Set to false when unmounted
        };
    }, []);

    // const fetchStatusTicket = async () =>{
    //     try{
    //         const response = await axios.get('http://localhost:8080/ticket-status',{ withCredentials: true});
    //         setDetermineCloseOrOpen(response.data.ticketStatus);

    //     }catch (error){
    //         console.error("Error Fetching ticket status")

    //     }
    // };
    // fetchStatusTicket()




    // useEffect(() => {
    //     tickets.forEach(ticket => console.log(ticket.ticketId)); // Log ticket IDs when tickets change
    // }, [tickets]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (ticket) => {
        setSelectedTicket(ticket);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedTicket(null);
    };

    const handleAccept = async (ticketId) => {
        try {
            const response = await fetch(`http://localhost:8080/accept-ticket/${ticketId}`, {
                method: 'PUT',
                credentials: 'include',
            });
            const updatedTicket = await response.json();
    
            // Remove the accepted ticket from the list
            setTickets(prevTickets => prevTickets.filter(ticket => ticket.ticketId !== ticketId));
    
            handleClose();
        } catch (error) {
            console.error('Error accepting ticket:', error);
        }
    };
    const handleDecline = async (ticketId) => {
        try {
            const response = await fetch(`http://localhost:8080/decline-ticket/${ticketId}`, {
                method: 'PUT',
                credentials: 'include',
            });
            
            if (!response.ok) {
                throw new Error('Failed to decline ticket');
            }
    
            const updatedTicket = await response.json();
    
            // Update the local state with the declined ticket, setting its status to 0
            setTickets(prevTickets => 
                prevTickets.map(ticket => 
                    ticket.ticketId === ticketId ? { ...ticket, ticketStatus: 0 } : ticket
                )
            );
    
            handleClose(); // Close the dialog
        } catch (error) {
            console.error('Error declining ticket:', error);
        }
    };
    const handleAcceptCloseTicket = async () => {
        if (!selectedTicket) return;
    
        try {
            const updatedTicket = await handleAccept(selectedTicket.ticketId);
            if (updatedTicket) {
                // Update the local state with the accepted ticket
                setTickets(prevTickets => 
                    prevTickets.map(ticket => 
                        ticket.ticketId === updatedTicket.ticketId ? updatedTicket : ticket
                    )
                );
            }
        } catch (error) {
            console.error('Error accepting ticket:', error);
        } finally {
            handleClose(); // Close the dialog
        }
    }; 
    const handleDeclineTicket = async () => {
        if (!selectedTicket) return;
    
        try {
            await handleDecline(selectedTicket.ticketId);
        } catch (error) {
            console.error('Error handling decline:', error);
        } finally {
            handleClose(); // Close the dialog after attempting to decline
        }
    };

    


    return (
        <Container component="main" maxWidth="lg">
            <Paper elevation={6} style={{ padding: '16px', marginTop: '32px' }}>
                <Typography variant="h5" gutterBottom>
                    My Tickets
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <TableContainer style={{ width: '100%' }}>
                    <Table style={{ width: '100%' }}>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Ticket ID</StyledTableCell>
                                <StyledTableCell>Title</StyledTableCell>
                                <StyledTableCell>Description</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(ticket => (
                                <StyledTableRow key={ticket.ticketId} onClick={() => handleRowClick(ticket)}>
                                    <TableCell>{ticket.ticketId}</TableCell>
                                    <TableCell>{ticket.ticketTitle}</TableCell>
                                    <TableCell>{ticket.ticketDesc}</TableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={tickets.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Modern Dialog for Ticket Details */}
            <CustomDialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogHeader>
                    <Typography variant="h6">
                        Ticket Details
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon style={{ color: '#fff' }} />
                    </IconButton>
                </DialogHeader>
                <DialogContent style={{ padding: 0 }}>
                    <Table>
                        <TableBody>
                            {selectedTicket && (
                                <>
                                    <TableRow>
                                        <DetailTableCell><strong>Ticket ID</strong></DetailTableCell>
                                        <DetailTableCell>{selectedTicket.ticketId}</DetailTableCell>
                                    </TableRow>
                                    <TableRow>
                                        <DetailTableCell><strong>Title</strong></DetailTableCell>
                                        <DetailTableCell>{selectedTicket.ticketTitle}</DetailTableCell>
                                    </TableRow>
                                    <TableRow>
                                        <DetailTableCell><strong>Description</strong></DetailTableCell>
                                        <DescriptionCell>{selectedTicket.ticketDesc}</DescriptionCell>
                                    </TableRow>
                                    <TableRow>
                                        <DetailTableCell><strong>Status</strong></DetailTableCell>
                                        <DetailTableCell>

                                        {selectedTicket.ticketStatus === "0" && (
                                            <>
                                                <span className="status-declined">
                                                    Declined
                                                </span>
                                            </>
                                        )}
                                        {selectedTicket.ticketStatus === "1" && (
                                            <>
                                                <span className="status-accepted">
                                                    Accepted
                                                </span>
                                            </>
                                        )}
                                        {selectedTicket.ticketStatus === "2" && (
                                            <>
                                                <span className="status-pending">
                                                    Pending
                                                </span>
                                            </>
                                        )}
                                                                                {/* {selectedTicket.ticketStatus === '0' ? 
                                        'Declined' : selectedTicket.ticketStatus === '1' ? 
                                        'Accepted' : selectedTicket.ticketStatus === '2' ? 
                                        'Pending' : 'Unknown'}  */}

                                       


                                        
                                        </DetailTableCell>
                                    </TableRow>

                                    {/* <TableRow>
                                        <DetailTableCell><strong>Status</strong></DetailTableCell>
                                        <DetailTableCell>{determineCloseOrOpen === 0 ? 'Open' : 'Closed'}</DetailTableCell>
                                    </TableRow> */}
                                    <TableRow>
                                        <DetailTableCell><strong>Service Type</strong></DetailTableCell>
                                        <DetailTableCell>{selectedTicket.ticketServiceType}</DetailTableCell>
                                    </TableRow>
                                    <TableRow>
                                        <DetailTableCell><strong>Service For</strong></DetailTableCell>
                                        <DetailTableCell>{selectedTicket.ticketServiceFor}</DetailTableCell>
                                    </TableRow>
                                    <TableRow>
                                        <DetailTableCell><strong>Number of Computers</strong></DetailTableCell>
                                        <DetailTableCell>{selectedTicket.ticketNumberOfComp}</DetailTableCell>
                                    </TableRow>
                                    <TableRow>
                                        <DetailTableCell><strong>Number of Users</strong></DetailTableCell>
                                        <DetailTableCell>{selectedTicket.ticketNumberOfUsers}</DetailTableCell>
                                    </TableRow>
                                </>
                            )}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    {userRole === 1 && ( // Check if the user role is admin
                        <>
                            <Button onClick={handleAcceptCloseTicket} color="primary" variant="contained">Accept Ticket</Button>
                            <Button onClick={handleDeclineTicket} color="secondary" variant="contained">Decline Ticket</Button>
                        </>
                    )}
                    <Button onClick={handleClose} color="default">Close</Button>
                </DialogActions>
            </CustomDialog>
        </Container>
    );
};

export default Home;
