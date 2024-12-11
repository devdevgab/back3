
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Use this if using React Router


// Define styles


Font.register({
    family: 'Arial',
    src: 'https://fonts.gstatic.com/s/arial/v11/kFOmCnqEu92Fr1Mu4mxMKTU1Kvnz.woff2', // Replace with a valid font URL
    fontStyle: 'normal',
    fontWeight: 'normal',
  });

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    flexDirection: 'column',
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  box: {
    border: '1px solid black',
    padding: 5,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
    width: '48%',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkbox: {
    width: 10,
    height: 10,
    border: '1px solid black',
    marginRight: 5,
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 9,
  },
  signatureSection: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '23%',
    border: '1px solid black',
    padding: 10,
    textAlign: 'center',
  },
});



// (Your existing font registration and styles)

const Print = () => {
    const [ticketDetails, setTicketDetails] = useState(null);

    // Extract ticketId from the URL
    const query = new URLSearchParams(useLocation().search);
    const ticketId = query.get('ticketId');

    useEffect(() => {
        // Fetch ticket details using the ticketId
        if (ticketId) {
            fetch(`/api/tickets/${ticketId}`) // Replace with your API endpoint
                .then((response) => response.json())
                .then((data) => setTicketDetails(data))
                .catch((error) => console.error('Error fetching ticket details:', error));
        }
    }, [ticketId]);

    if (!ticketDetails) {
        return <Text>Loading...</Text>;
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>AIMCoop</Text>
                    <Text>"The Choice of the Filipino"</Text>
                    <Text style={{ fontWeight: 'bold', marginTop: 5 }}>
                        INFORMATION AND COMMUNICATIONS TECHNOLOGY DIVISION
                    </Text>
                    <Text style={{ fontSize: 14 }}>SERVICE REQUEST FORM</Text>
                </View>

                <View style={[styles.row, styles.box]}>
                    <View style={{ width: '70%' }}>
                        <Text>DEPARTMENT / BRANCH: {ticketDetails.department}</Text>
                    </View>
                    <View style={{ width: '30%' }}>
                        <Text>DATE REQUESTED: {ticketDetails.dateRequested}</Text>
                    </View>
                </View>

                <View style={styles.box}>
                    <Text>DETAILS: {ticketDetails.details}</Text>
                </View>

                {/* Add more ticket-specific information */}
                <View style={styles.footer}>
                    <Text>Ticket ID: {ticketDetails.ticketId}</Text>
                </View>
            </Page>
        </Document>
    );
};

export default Print;
