import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Ensure valid font registration
Font.register({
  family: 'Arial',
  src: 'https://example.com/path/to/arial.ttf', // Replace with the correct path to your .ttf font
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
  box: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 5,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 5,
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 9,
  },
  signatureBox: {
    width: '23%',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    textAlign: 'center',
  },
});

const Print = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={{ fontSize: 16, fontFamily: 'Arial-Bold' }}>AIMCoop</Text>
        <Text>"The Choice of the Filipino"</Text>
        <Text style={{ fontFamily: 'Arial-Bold', marginTop: 5 }}>
          INFORMATION AND COMMUNICATIONS TECHNOLOGY DIVISION
        </Text>
        <Text style={{ fontSize: 14 }}>SERVICE REQUEST FORM</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.box, { width: '70%' }]}>
          <Text>DEPARTMENT / BRANCH:</Text>
        </View>
        <View style={[styles.box, { width: '30%' }]}>
          <Text>DATE REQUESTED:</Text>
        </View>
      </View>

      <View style={styles.box}>
        <Text>DETAILS:</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.box, { width: '50%' }]}>
          <Text>REQUESTED BY:</Text>
        </View>
        <View style={[styles.box, { width: '50%' }]}>
          <Text>CONFIRMED BY:</Text>
        </View>
      </View>

      <Text>To be accomplished by ICT:</Text>
      <View style={styles.box}>
        {[
          'Computer',
          'Monitor',
          'Bill Counter',
          'Switch',
          'CISCO',
          'Globe Router',
          'PLDT Router',
          'PLDT VPNx Router',
          'Smart Modem',
          'NComputing',
          'Printer',
          'Others',
        ].map((service) => (
          <View style={styles.checkboxRow} key={service}>
            <View style={styles.checkbox}></View>
            <Text>{service}</Text>
          </View>
        ))}
      </View>

      <View style={styles.row}>
        <View style={[styles.box, { width: '50%' }]}>
          <Text>Number of Computers:</Text>
        </View>
        <View style={[styles.box, { width: '50%' }]}>
          <Text>Number of Users:</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        The above service has already been tested and delivered. After 7 days...
      </Text>

      <View style={styles.row}>
        {['PREPARED BY:', 'CONFIRMED BY:', 'ENDORSED TO OR RECORDED BY:', 'APPROVED BY:'].map((title) => (
          <View style={styles.signatureBox} key={title}>
            <Text>{title}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default Print;