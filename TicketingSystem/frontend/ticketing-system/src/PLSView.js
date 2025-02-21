import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Print from './Print';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import { useNavigate } from 'react-router-dom';
import TicketButton from './TicketButton';
import { PrintPage } from './PrintPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
// import {UserContext} from './UserContext';
// import {UserProvider, useUser} from './UserContext';
// import { UserContext } from './UserContext';
import { UserProvider } from './UserContext';
// import MuiAlert from '@mui/material/Alert';
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

    // Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


// const Alert = React.forwardRef(function Alert(props, ref) {
//     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
//   });

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

const PLSView = () => {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [open, setOpen] = useState(false);
    const [openSecondModal, setOpenSecondModal] = useState(false);
    const [openPop, setOpenPop] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [determineCloseOrOpen, setDetermineCloseOrOpen] = useState(null);
    const [popupMessage, setPopupMessage] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    // const { userFirstName } = useContext(UserProvider)
    // const history = useHistory();
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true; // Track whether the component is mounted



        


        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://192.168.10.245:8080/Atickets', { withCredentials: true });
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

       
        fetchTickets();
        // const interval = setInterval(fetchTickets, 1000); // Refresh every 5 seconds

        // return () => clearInterval(interval); // Cleanup on unmount
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
        setSelectedTicket(null);
        // setSelectedTicket.ticketId(null);
        setOpen(false);


    };
    const handlePopClose = () => {
        setOpenPop(false);
    }
    const handlePopOpen = () => {
        setOpenPop(true);
    }
   


   
   

    
   

  

    return (



        <Container component="main" maxWidth="lg">
            <Paper elevation={6} style={{ padding: '16px', marginTop: '32px' }}>
                <Typography variant="h5" gutterBottom>
                    Service Tickets
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
                                <StyledTableCell>Status</StyledTableCell>

                                
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
                                        <TableCell>{ticket.ticketResolved == 0 && (
                                                <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                    <span className="status-accepted">
                                                        Open
                                                    </span>
                                                </div>
                                            )}
                                        {ticket.ticketResolved == null && (
                                                <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                    <span className="status-accepted">
                                                        Open 
                                                    </span>
                                                </div>
                                            )}
                                        {ticket.ticketResolved == 1 && (
                                                <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                    <span className="status-in-progress">
                                                        In Progress
                                                    </span>
                                                </div>
                                            )}

                                        {ticket.ticketResolved == 2 && (
                                                <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                    <span className="status-declined">
                                                        Closed
                                                    </span>
                                                </div>
                                            )}
                                        {ticket.ticketResolved == 3 && (
                                                <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                    <span className="status-pls">
                                                        Sent to PLS
                                                    </span>
                                                </div>
                                            )}</TableCell>
                                        

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
                        {/* {error && <Typography color="white">{error}</Typography>} */}
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
                                        <DetailTableCell><strong>User</strong></DetailTableCell>
                                        <DescriptionCell>{selectedTicket.ticketRequestedBy}</DescriptionCell>
                                    </TableRow>
                                    <TableRow>
                                        <DetailTableCell><strong>Branch Code</strong></DetailTableCell>
                                        <DescriptionCell>{selectedTicket.branchCode}</DescriptionCell>
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
                                                <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                    <span className="status-declined">
                                                        Branch Manager Declined by {selectedTicket.ticketAuthorDeclined}
                                                    </span>
                                                </div>
                                            )}

                                            {selectedTicket.ticketStatus === "1" && (
                                                <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                    <span className="status-accepted">
                                                        Branch Manager Accepted by {selectedTicket.ticketAuthorAccepted}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedTicket.ticketStatus === "2" && (
                                                <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                    <span className="status-pending">
                                                        Branch Manager Pending
                                                    </span>
                                                </div>
                                            )}
                                            {selectedTicket.ticketStatus === "" && (
                                                <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                    <span className="status-pending">
                                                        Branch Manager Pending
                                                    </span>
                                                </div>
                                            )}
                                            {selectedTicket.ticketStatusICT === "" && (
                                                <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                    <span className="status-pending">
                                                        ICT Pending
                                                    </span>
                                                </div>
                                            )}
                                            {selectedTicket.ticketStatusICT === null && (
                                                <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                    <span className="status-pending">
                                                        ICT Pending
                                                    </span>
                                                </div>
                                            )}
                                            {selectedTicket.ticketResolved == 2  && (
                                                <div style={{ marginBottom: '8px' }}> {/* Adjust the margin as needed */}
                                                    <span className="status-declined">
                                                        Marked as closed 
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
               
            </CustomDialog>

            
        </Container>
    );
};

export default PLSView;
