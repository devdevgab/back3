import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const NewPrint = () => {
  const { id } = useParams(); // Get the ticket ID from the URL
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/tickets/${id}`, { withCredentials: true });
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

  const styles = {
    form: {
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      // border: "1px solid #ccc",
      width: "800px",
      margin: "auto",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    logo: {
      height: "80px",
    },
    title: {
      textAlign: "center",
    },
    ictCode: {
      textAlign: "right",
    },
    section: {
      marginTop: "20px",
      border: "1px solid #ccc",
      padding: "10px",
    },
    row: {
      display: "flex",
      marginBottom: "10px",
      alignItems: "center",
    },
    label: {
      fontWeight: "bold",
      padding: "10px",
      backgroundColor: "#f4f4f4",
      border: "1px solid #ccc",
      textAlign: "left",
      width: "30%", // Adjust label width
    },
    value: {
      padding: "10px",
      backgroundColor: "#f9f9f9",
      border: "1px solid #ccc",
      textAlign: "left",
      width: "70%", // Adjust value width
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "10px",
    },
    thtd: {
      border: "1px solid #ccc",
      padding: "5px",
      textAlign: "left",
    },
    note: {
      marginTop: "20px",
      fontStyle: "italic",
    },
    signatures: {
      marginTop: "20px",
    },
    signatureCell: {
      textAlign: "center",
      padding: "10px",
      border: "1px solid #ccc",
    },
    serviceDiv:{
      display: "flex",
      justifyContent: "center",
    },
    divHeader:{
      
    },
    divHeaderAim:{
      display:"flex",
      justifyContent:"center",
      textAlign:"center",
      flexDirection:"column"
    },
    divLogo:{
      display:"flex",
      justifyContent:"flex-start",
      width: "100%", // Adjust as per your layout
      maxHeight: "100px", // Restrict logo height
      marginBottom: "10px",

      
      
    },
    divID:{
      display:"flex",
      justifyContent:"flex-end"
     
    },
    sectionHeader: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#333",
    },
    subheader: {
      fontSize: "16px",
      fontWeight: "600",
      margin: "10px 0",
      color: "#555",
    },
    bodyICT:{
      textAlign:"left",
    },
    divFooter:{
      display:"flex",
      justifyContent:"center",

    }
    
  };

  return (
    // <div style={{ padding: '20px', fontFamily: 'Arial' }}>
    //   <h1>Ticket Details</h1>
    //   <p><strong>ID:</strong> {selectedTicket.ticketId}</p>
    //   <p><strong>Title:</strong> {selectedTicket.ticketTitle}</p>
    //   <p><strong>Description:</strong> {selectedTicket.ticketDesc}</p>
    //   <p><strong>Date:</strong> {selectedTicket.created}</p>
    //   {/* Add more fields as needed */}
    // </div>
    <div style={styles.form}>
      {/* Header Section */}
      <div style={styles.divHeader}>

        <div>

          <div style={styles.divID} >
            <p>ICT-{selectedTicket.ticketId}</p>
          </div>
            <img
              
              src="/images/header.jpg"
              style={styles.divLogo}
            />
        </div>

        <div style={styles.divHeaderAim}>
        <p>INFORMATION AND COMMUNICATIONS TECHNOLOGY DIVISION</p>
        <h2>SERVICE REQUEST FORM</h2>
          {/* <h1>AIMCoop</h1> */}
          {/* <p>"The Choice of the Filipino"</p> */}

         
        </div>
        
      </div>

      {/* Form Section */}
      <div style={styles.section}>
        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={styles.label}>DEPARTMENT / BRANCH:</td>
              <td style={styles.value}>{selectedTicket.ticketTitle || "N/A"}</td>
              <td style={styles.label}>DATE REQUESTED:</td>
              <td style={styles.value}>{selectedTicket.created || "N/A"}</td>
            </tr>
            <tr>
              <td style={styles.label}>DETAILS:</td>
              <td colSpan="3" style={styles.value}>{selectedTicket.ticketDesc || "N/A"}</td>
            </tr>
            <tr>
              <td style={styles.label}>REQUESTED BY:</td>
              <td style={styles.value}>{selectedTicket.ticketRequestedBy || "N/A"}</td>
              <td style={styles.label}>CONFIRMED BY:</td>
              <td style={styles.value}>{"Empty" || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ICT Section */}
      <div style={styles.section}>
          <h2 style={styles.sectionHeader}>To be accomplished by ICT:</h2>
          <div style={styles.serviceDiv}>
            <h3 style={styles.subheader}>Service Type: {selectedTicket.ticketServiceType || "N/A"}</h3>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.thtd}>Service For</th>
                <th style={styles.thtd}>Details or Recommendation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.thtd}>{selectedTicket.ticketServiceFor || "N/A"}</td>
                <td style={styles.thtd}>{"Pending Function"}</td>
              </tr>
            </tbody>
          </table>

        <div style={styles.section}>
          <h2 style={styles.sectionHeader}>Number of Computers and Users</h2>
          <table style={styles.table}>
            <tbody >
              <tr>
                <td style={{ ...styles.label, width: "25%" }}>Number of Computers:</td>
                <td style={{ ...styles.value, width: "25%" }}>{selectedTicket.ticketNumberOfComp || "N/A"}</td>
                <td style={{ ...styles.label, width: "25%" }}>Number of Users:</td>
                <td style={{ ...styles.value, width: "25%" }}>{selectedTicket.ticketNumberOfUsers || "N/A"}</td>
              </tr>
            </tbody>
          </table>
         </div>

        </div>

      {/* Note Section */}
      <p style={styles.note}>
        The above service has already been tested and delivered. After 7 days,
        if we do not receive feedback from the requesting party, ICT Div. will
        assume that the service is working and deemed accepted. Please inform us
        for further concerns. Feel free to contact us.
      </p>

      {/* Signatures Section */}
      <div style={styles.signatures}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.thtd}>PREPARED BY: </th>
              <th style={styles.thtd}>CONFIRMED BY: </th>
              <th style={styles.thtd}>ENDORSED TO OR RECORDED BY: </th>
              <th style={styles.thtd}>APPROVED BY: </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.signatureCell}>
                <p>{"function pending" || "N/A"}</p>
              </td>
              <td style={styles.signatureCell}>
                <p>{"function pending" || "N/A"}</p>
              </td>
              <td style={styles.signatureCell}>
                <p>{"function pending" || "N/A"}</p>
              </td>
              <td style={styles.signatureCell}>
                <p>FAITH T. MASANEGRA, RN, MBA</p>
                <p>CHIEF EXECUTIVE OFFICER</p>
              </td>
            </tr>
          </tbody>
        </table>


      </div>
      <div style={styles.divFooter}>

      <img
        src="/images/footer.jpg"
        style={styles.divLogo}
      />
      </div>
    </div>
  );
};






 
export default NewPrint;