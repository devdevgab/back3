import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Print from './Print';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import './css/TicketPopup.css'; // Import the CSS file
import './css/AdminTicket.css'
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
    DialogTitle,
    DialogContentText,
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

const AdminTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [open, setOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [popupMessage, setPopupMessage] = useState('');
    const [determineCloseOrOpen, setDetermineCloseOrOpen] = useState(null);
    const [openPop, setOpenPop] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');


    useEffect(() => {
        let isMounted = true; // Track whether the component is mounted

        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://localhost:8080/admin/tickets', { withCredentials: true });
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

        const fetchStatusTicket = async () => {
            try {
                const response = await axios.get('http://localhost:8080/ticket-status', { withCredentials: true });
                setDetermineCloseOrOpen(response.data.ticketStatus);

            } catch (error) {
                // console.error("Error Fetching ticket status")

            }
        };
        fetchStatusTicket()

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

    // useEffect(() => {
    //     tickets.forEach(ticket => console.log(ticket.ticketId)); // Log ticket IDs when tickets change
    // }, [tickets]);



    const handlePopClose = () => {
        setOpenPop(false);
    }
    const handlePopOpen = () => {
        setOpenPop(true);
    }
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
    const handlePopSuccess = () => {

    }

    // const TicketPopup = ({ message }) => {
    //     const [showPopup, setShowPopup] = useState(false);

    //     useEffect(() => {
    //         if (message) {
    //             setShowPopup(true);
    //             const timer = setTimeout(() => setShowPopup(true), 6000);
    //             return () => clearTimeout(timer);
    //         }
    //     }, [message]);

    //     return (
    //         showPopup && (
    //             <div className="popup-success">
    //                 <p>{message}</p>
    //             </div>
    //         )
    //     );
    // };
    const handleAccept = async (ticketId, ticketAuthorAccepted) => {
        try {
            const response = await fetch(`http://localhost:8080/accept-ticket/${ticketId}/${ticketAuthorAccepted}`, {
                method: 'PUT',
                credentials: 'include',
            }); 
            const updatedTicket = await response.json();

            // Remove the accepted ticket from the list
            // setTickets(prevTickets => prevTickets.filter(ticket => ticket.ticketId !== ticketId));

            setTickets(prevTickets =>
                prevTickets.map(ticket =>
                    ticket.ticketId === ticketId 
                    ? { 
                        ...ticket, 
                        ticketStatus: "1", 
                        ticketAuthorAccepted: [updatedTicket.ticketAuthor.firstName, " ", updatedTicket.ticketAuthor.lastName]
                    } 
                    : ticket
                )
            );

            handleClose();
        } catch (error) {
            console.error('Error accepting ticket:', error);
        }
    };
    const handleDecline = async (ticketId, ticketAuthorDeclined) => {
        try {
            const response = await fetch(`http://localhost:8080/decline-ticket/${ticketId}/${ticketAuthorDeclined}`, {
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
                    ticket.ticketId === ticketId 
                    ? { ...ticket,
                         ticketStatus: "0", 
                         ticketAuthorAccepted: [updatedTicket.ticketAuthor.firstName," ", updatedTicket.ticketAuthor.lastName]
                        } 
                        : ticket
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

    ///ICT ACCEPT
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


    const handleICTAccept = async (ticketId,ticketAuthorICTAccepted) => {
        try {
            const response = await fetch(`http://localhost:8080/accept-ticketICT/${ticketId}/${ticketAuthorICTAccepted}`, {
                method: 'PUT',
                credentials: 'include',
            });
            const updatedTicket = await response.json();

            // Remove the accepted ticket from the list
            // setTickets(prevTickets => prevTickets.filter(ticket => ticket.ticketId !== ticketId));

            setTickets(prevTickets =>
                prevTickets.map(ticket =>
                    ticket.ticketId === ticketId 
                    ? { 
                        ...ticket, 
                        ticketStatusICT: "1", 
                        ticketAuthorICTAccepted: [updatedTicket.ticketAuthor.firstName," ", updatedTicket.ticketAuthor.lastName]
                     } 
                        : ticket
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



    const handleICTDecline = async (ticketId, ticketAuthorICTDeclined) => {
        try {
            const response = await fetch(`http://localhost:8080/decline-ticketICT/${ticketId}/${ticketAuthorICTDeclined}`, {
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
                    ticket.ticketId === ticketId 
                    ? { 
                        ...ticket, 
                        ticketStatusICT: "0", 
                        ticketAuthorICTAccepted: [updatedTicket.ticketAuthor.firstName, updatedTicket.ticketAuthor.lastName]
                    } 
                    : ticket
                )
            );


            handleClose(); // Close the dialog
        } catch (error) {
            console.error('Error declining ticket:', error);
        }
    };






    const handleDeclineTicket = async () => {
        if (!selectedTicket) return;

        try {
            await handleDecline(selectedTicket.ticketId);
            setPopupMessage('Success! Ticket Declined.');
        } catch (error) {
            console.error('Error handling decline:', error);
        } finally {
            handleClose(); // Close the dialog
        }
    };
    // Define the color logic based on ticket status
    // const getStatusColor = (status) => {

    //     switch (status) {
    //         case '0':
    //             return 'red'; // Declined
    //         case '1':
    //             return 'green'; // Accepted
    //         case '2':
    //             return 'yellow'; // Pending
    //         default:
    //             return 'gray'; // Default for unknown statuses
    //     }
    // };

    // StatusBadge component to show the status with the respective color
    // const StatusBadge = ({ status }) => {
    //     // Map numeric statuses to descriptive text and colors
    //     determineCloseOrOpen 
    //     const statusMap = {
    //         '0': { label: 'Declined', color: 'red' },
    //         '1': { label: 'Accepted', color: 'green' },
    //         '2': { label: 'Pending', color: 'yellow' },
    //     };

    //     const { label, color } = statusMap[status] || { label: 'Unknown', color: 'gray' };

    //     return (
    //         <span style={{
    //             backgroundColor: color,
    //             color: 'white',
    //             padding: '4px 8px',
    //             borderRadius: '4px',
    //             fontWeight: 'bold'
    //         }}>
    //             {label}
    //         </span>
    //     );
    // };

    // const handlePrint = async (ticketId) => {
    //     try {
    //       const response = await fetch(`/api/print/${ticketId}`, {
    //         method: 'GET',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //       });
    //       if (response.ok) {
    //         const blob = await response.blob();
    //         const url = window.URL.createObjectURL(blob);
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = 'ticket_document.pdf'; // Adjust the filename as needed
    //         document.body.appendChild(a);
    //         a.click();
    //         a.remove();
    //       } else {
    //         alert('Failed to print the document.');
    //       }
    //     } catch (error) {
    //       console.error('Error:', error);
    //     }
    //   };


    // const handlePrint = () => {
    //     if (selectedTicket) {
    //       // Example: Print the ticket details (you can integrate the React-PDF logic here)
    //       console.log('Printing Ticket:', selectedTicket.ticketId);
    //       // You can pass selectedTicket to a Print/PDF generation component
    //     }
    //   };
    const handlePrint = async () => {
        if (!selectedTicket) {
            alert("No ticket selected. Please select a ticket first.");
            return;
        }

        try {
            const ticketId = selectedTicket.ticketId;

            // Create the new URL with the ticketId
            const ticketUrl = `/print?ticketId=${ticketId}`;

            // Open a new window with the ticketId in the URL
            const newWindow = window.open(ticketUrl, '_blank');
            if (!newWindow) {
                alert("Pop-up blocked! Please allow pop-ups for this site.");
                return;
            }

            // Generate the PDF Blob
            const blob = await pdf(<Print ticket={selectedTicket} />).toBlob();
            const url = URL.createObjectURL(blob);

            // Use the new window's JavaScript to embed the PDF
            newWindow.onload = () => {
                newWindow.document.body.innerHTML = `
                    <body style="margin:0">
                        <iframe src="${url}" frameborder="0" style="width:100%; height:100%;"></iframe>
                    </body>
                `;
            };
        } catch (error) {
            console.error("Error during print:", error);
        }
    };


    const handlePrintClick = () => {
        if (selectedTicket) {
            // Construct the URL manually
            const url = `/ticket/${selectedTicket.ticketId}`;

            if (selectedTicket.ticketStatus != '1' || selectedTicket.ticketStatusICT != '1') {
                setOpenPop(true);
                setAlertMessage('Tickets are needed to be approved before printing');


                console.log("running here");


            } else {
                // console.log("yep sakto ko 2 ", selectedTicket.ticketStatus, selectedTicket.ticketStatusICT)
                window.open(url, '_blank', 'noopener,noreferrer');

            }
            // Open the URL in a new tab
            // window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            alert("No ticket selected. Please select a ticket first.");
        }
    };

    // const handlePrint = () => {
    //     if (selectedTicket) {
    //         const ticketId = selectedTicket.ticketId; // Get the ticketId
    //         window.open(`/printPage?ticketId=${ticketId}`, '_blank'); // Open a new window
    //     }
    // };

    // const handlePrint = () => {
    //     if (selectedTicket) {
    //         const ticketId = selectedTicket.ticketId; // Extract ticketId
    //         localStorage.setItem('ticketId', ticketId); // Store in localStorage
    //         window.open('/printPage', '_blank'); // Open new window
    //     }
    // };








    return (

        <Container component="main" maxWidth="lg">
            <Paper elevation={6} style={{ padding: '16px', marginTop: '32px' }}>
                <Typography variant="h5" gutterBottom>
                    Admin Tickets (All Tickets)
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
                        Admin Tickets
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

                                            {selectedTicket.ticketStatusICT === "0" && (
                                                <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                    <span className="status-declined">
                                                        ICT Declined by {selectedTicket.ticketAuthorICTDeclined}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedTicket.ticketStatusICT === "1" && (
                                                <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                    <span className="status-accepted">
                                                        ICT Accepted by {selectedTicket.ticketAuthorICTAccepted}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedTicket.ticketStatusICT === "2" && (
                                                <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                    <span className="status-pending">
                                                        ICT Pending
                                                    </span>
                                                </div>
                                            )}

                                            {selectedTicket.ticketStatus === "0" && (
                                                <div style={{ marginBottom: '8px' }}>
                                                    <span className="status-declined">
                                                        Branch Manager Declined by {selectedTicket.ticketAuthorDeclined}
                                                    </span>
                                                </div>
                                            )}

                                            {selectedTicket.ticketStatus === "1" && (
                                                <div style={{ marginBottom: '8px' }}>
                                                    <span className="status-accepted">
                                                        Branch Manager Accepted by {selectedTicket.ticketAuthorAccepted}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedTicket.ticketStatus === "2" && (
                                                <div style={{ marginBottom: '8px' }}>
                                                    <span className="status-pending">
                                                        Branch Manager Pending
                                                    </span>
                                                </div>
                                            )}
                                            {selectedTicket.ticketStatus === "" && (
                                                <div style={{ marginBottom: '8px' }}>
                                                    <span className="status-pending">
                                                        Branch Manager Pending
                                                    </span>
                                                </div>
                                            )}
                                            {selectedTicket.ticketStatusICT === "" && (
                                                <div style={{ marginBottom: '8px' }}>
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
                    {userRole === 1 ? ( // Check if the user role is admin
                        <>
                            <Button onClick={handleAcceptCloseTicket} color="primary" variant="contained">Branch Manager Accept</Button>
                            <Button onClick={handleDeclineTicket} color="secondary" variant="contained">Branch Manager Decline</Button>
                            <Button color="inherit" onClick={handlePrintClick}> Print </Button>
                            {openPop && (
                                <Dialog open={openPop} onClose={handlePopClose}>
                                    <DialogTitle sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                                        Error
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText sx={{ fontSize: '1.1rem' }}>
                                            {alertMessage}
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button
                                            onClick={handlePopClose}
                                            sx={{
                                                color: '#ffffff',
                                                backgroundColor: '#d32f2f',
                                                '&:hover': { backgroundColor: '#b71c1c' }
                                            }}
                                        >
                                            OK
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            )}
                        </>
                    ) :
                        userRole === 2 && (
                            <>
                                <Button onClick={handleICTAcceptCloseTicket} color="primary" variant="contained">ICT Accept Ticket</Button>
                                <Button onClick={handleICTDeclineTicket} color="secondary" variant="contained">ICT Decline Ticket</Button>

                                {openPop && (
                                    <Dialog open={true} onClose={handlePopClose}>
                                        <DialogTitle>Error</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>{alertMessage}</DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handlePopClose} color="primary">
                                                OK
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                )}



                            </>

                        )


                    }
                    {userRole === 2 && (
                        <Button color="Green" onClick={handlePrintClick} variant="contained">Print</Button>

                    )}
                    <Button onClick={handleClose} color="default">Close</Button>
                </DialogActions>
            </CustomDialog>
        </Container>
    );
};

export default AdminTickets;
