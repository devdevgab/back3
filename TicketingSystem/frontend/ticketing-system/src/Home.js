import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Print from './Print';
import {PDFViewer, pdf} from '@react-pdf/renderer';
import { useNavigate } from 'react-router-dom';
import TicketButton from './TicketButton';
import { PrintPage } from './PrintPage';
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
    const [popupMessage, setPopupMessage] = useState('');
    // const history = useHistory();
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true; // Track whether the component is mounted
    


        // const handleOpenDialog = (ticket) => {
        //     setSelectedTicket(ticket);
        //     setOpen(true); // Open the dialog
        //   };


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

    const handlePrint = async () => {
        
        if (!selectedTicket) {
            alert("No ticket selected. Please select a ticket first.");
            return;
        }
    
        try {
            const ticketId = selectedTicket.ticketId;
    
            // Open the new window early, but without content yet
            const newWindow = window.open('', '_blank');
            if (!newWindow) {
                alert("Pop-up blocked! Please allow pop-ups for this site.");
                return;
            }
    
            // Generate the PDF Blob
            const blob = await pdf(<Print ticket={selectedTicket} />).toBlob();
            const url = URL.createObjectURL(blob);
            console.log("Generated Blob URL:", url);
            // Write the content into the new window
            newWindow.document.write(`
                <html>
                    <title>Print Ticket</title>
                    <body style="margin:0">
                        <iframe src="${url}" frameborder="0" style="width:100%; height:100%;"></iframe>
                    </body>
                </html>
            `);
            newWindow.document.close();
        } catch (error) {
            console.error("Error during print:", error);
        }
    };

    const handleClose = () => {
        setSelectedTicket(null);
        // setSelectedTicket.ticketId(null);
        setOpen(false);
       
        
    };

    // const handleAccept = async (ticketId) => {
    //     try {
    //         const response = await fetch(`http://localhost:8080/accept-ticket/${ticketId}`, {
    //             method: 'PUT',
    //             credentials: 'include',
    //         });
    //         const updatedTicket = await response.json();
    
    //         // Remove the accepted ticket from the list
    //         setTickets(prevTickets => prevTickets.filter(ticket => ticket.ticketId !== ticketId));
    
    //         handleClose();
    //     } catch (error) {
    //         console.error('Error accepting ticket:', error);
    //     }
    // };


    const handleAccept = async (ticketId) => {
        try {
            const response = await fetch(`http://localhost:8080/accept-ticket/${ticketId}`, {
                method: 'PUT',
                credentials: 'include',
            });
            const updatedTicket = await response.json();
    
            // Remove the accepted ticket from the list
            // setTickets(prevTickets => prevTickets.filter(ticket => ticket.ticketId !== ticketId));
         
            setTickets(prevTickets => 
                prevTickets.map(ticket => 
                    ticket.ticketId === ticketId ? { ...ticket, ticketStatus: "1" } : ticket
                )
            );
    
            handleClose();
        } catch (error) {
            console.error('Error accepting ticket:', error);
        }
    };
    // const handleDecline = async (ticketId) => {
    //     try {
    //         const response = await fetch(`http://localhost:8080/decline-ticket/${ticketId}`, {
    //             method: 'PUT',
    //             credentials: 'include',
    //         });
            
    //         if (!response.ok) {
    //             throw new Error('Failed to decline ticket');
    //         }
    
    //         const updatedTicket = await response.json();
    
    //         // Update the local state with the declined ticket, setting its status to 0
    //         setTickets(prevTickets => 
    //             prevTickets.map(ticket => 
    //                 ticket.ticketId === ticketId ? { ...ticket, ticketStatus: 0 } : ticket
    //             )
    //         );
    
    //         handleClose(); // Close the dialog
    //     } catch (error) {
    //         console.error('Error declining ticket:', error);
    //     }
    // };

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
                    ticket.ticketId === ticketId ? { ...ticket, ticketStatus: "0" } : ticket
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
            // setPopupMessage('Success! Ticket Declined.');
        } catch (error) {
            console.error('Error handling decline:', error);
        } finally {
            handleClose(); // Close the dialog
        }
    };
    
    



      const handleICTAcceptCloseTicket = async () => {
        if (!selectedTicket) return;
    
        try {
            const updatedTicket = await handleICTAccept(selectedTicket.ticketId);
            if (updatedTicket) {
                setTickets(prevTickets =>
                    prevTickets.map(ticket =>
                        ticket.ticketId === updatedTicket.ticketId ? updatedTicket : ticket
                    )
                );
                setPopupMessage('Success! Ticket Accepted.');
            }
        } catch (error) {
            console.error('Error accepting ticket:', error);
        } finally {
            handleClose(); // Close the dialog
        }
    };
    
    
    const handleICTAccept = async (ticketId) => {
        try {
            const response = await fetch(`http://localhost:8080/accept-ticketICT/${ticketId}`, {
                method: 'PUT',
                credentials: 'include',
            });
            const updatedTicket = await response.json();
    
            // Remove the accepted ticket from the list
            // setTickets(prevTickets => prevTickets.filter(ticket => ticket.ticketId !== ticketId));
         
            setTickets(prevTickets => 
                prevTickets.map(ticket => 
                    ticket.ticketId === ticketId ? { ...ticket, ticketStatusICT: "1" } : ticket
                )
            );
    
            handleClose();
        } catch (error) {
            console.error('Error accepting ticket:', error);
        }
    };
    
    
    
    ///ICT DECLINE
    
    
    const handleICTDeclineTicket = async () => {
        if (!selectedTicket) return;
    
        try {
            await handleICTDecline(selectedTicket.ticketId);
            setPopupMessage('Success! Ticket Declined.');
        } catch (error) {
            console.error('Error handling decline:', error);
        } finally {
            handleClose(); // Close the dialog
        }
    };
    
    
    
    const handleICTDecline = async (ticketId) => {
        try {
            const response = await fetch(`http://localhost:8080/decline-ticketICT/${ticketId}`, {
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
                    ticket.ticketId === ticketId ? { ...ticket, ticketStatusICT: "0" } : ticket
                )
            );
        
    
            handleClose(); // Close the dialog
        } catch (error) {
            console.error('Error declining ticket:', error);
        }
    };
    // const handlePrintNew = () => {
    //     if (selectedTicket) {
    //       const ticketId = selectedTicket.id; // Use selected ticket ID
    //       window.open(`/print?ticketId=${ticketId}`, '_blank');
    //     } else {
    //       alert("Ticket not found");
    //     }
    //   };
    
    //   if (!selectedTicket) {
    //     return <p>Ticket not found</p>;
    //   }

    // const handlePrintNew = () => {
    //     if (selectedTicket) {
    //       const ticketId = selectedTicket.id; // Use selected ticket ID
    //       window.open(`/print?ticketId=${ticketId}`, '_blank');
    //     } else {
    //       alert("Ticket not found");
    //     }
    //   };
    
    //   if (!selectedTicket) {
    //     return <p>Ticket not found</p>;
    //   }
    // const handlePrintClick = () => {
    //     if (selectedTicket) {
    //         navigate(`/print/${selectedTicket.ticketId}`); // Navigate to the NewPrint route with the ticket ID
    //     } else {
    //         alert("No ticket selected. Please select a ticket first.");
    //     }
    // };

    const handlePrintClick = () => {
        if (selectedTicket) {
            // Construct the URL manually
            const url = `/ticket/${selectedTicket.ticketId}`;
            // Open the URL in a new tab
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            alert("No ticket selected. Please select a ticket first.");
        }
    };
    
    

    return (
        <Container component="main" maxWidth="lg">
            <Paper elevation={6} style={{ padding: '16px', marginTop: '32px' }}>
                <Typography variant="h5" gutterBottom>
                    My Tickets
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <TableContainer style={{
                        width: '100%',
                       
                    }}>
                    <Table style={{ width: '100%' }}>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Ticket ID</StyledTableCell>
                                <StyledTableCell>Title</StyledTableCell>
                                <StyledTableCell>Description</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tickets.sort((a, b) => new Date(b.created) - new Date(a.created))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map(ticket => (
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
                                    <TableRow >
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

                                        {selectedTicket.ticketStatusICT === "0" && (
                                            <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                <span className="status-declined">
                                                    ICT Declined
                                                </span>
                                            </div>
                                        )}
                                        {selectedTicket.ticketStatusICT === "1" && (
                                            <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                <span className="status-accepted">
                                                    ICT Accepted
                                                </span>
                                            </div>
                                        )}
                                        {selectedTicket.ticketStatusICT === "2" &&( 
                                            <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                <span className="status-pending">
                                                    ICT Pending
                                                </span>
                                            </div>
                                        )}

                                        {selectedTicket.ticketStatus === "0" && (
                                          <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                <span className="status-declined">
                                                    Branch Manager Declined
                                                </span>
                                            </div>
                                        )}

                                        {selectedTicket.ticketStatus === "1" && (
                                            <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                <span className="status-accepted">
                                                    Branch Manager Accepted
                                                </span>
                                            </div>
                                        )}
                                        {selectedTicket.ticketStatus === "2" &&(
                                           <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                <span className="status-pending">
                                                    Branch Manager Pending
                                                </span>
                                            </div>
                                        )}
                                         {selectedTicket.ticketStatus === "" &&(
                                            <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                <span className="status-pending">
                                                    Branch Manager Pending
                                                </span>
                                            </div>
                                        )}
                                         {selectedTicket.ticketStatusICT === "" &&(
                                            <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                <span className="status-pending">
                                                    ICT Pending
                                                </span>
                                            </div>
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
                    {userRole === 2 && ( // Check if the user role is ICT
                        <>
                            <Button onClick={handleICTAcceptCloseTicket} color="primary" variant="contained">ICT Accept Ticket</Button>
                            <Button onClick={handleICTDeclineTicket} color="secondary" variant="contained">ICT Decline Ticket</Button>
                            <Button color="inherit" onClick={handlePrintClick}>Print</Button>
                            {/* <TicketButton ticketId={selectedTicket.ticketId} />  */}
                        </>
                    )}
                    <Button onClick={handleClose} color="default">Close</Button>
                </DialogActions>
            </CustomDialog>
        </Container>
    );
};

export default Home;
