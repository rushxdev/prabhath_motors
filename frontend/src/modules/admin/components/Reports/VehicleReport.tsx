import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import ReportLayout from './ReportLayout';
import { Vehicle } from '../../../../types/Vehicle';

const styles = StyleSheet.create({
  section: {
    margin: 10,
    padding: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 12,
    marginBottom: 8,
    color: '#333',
  },
});

interface VehicleReportProps {
  vehicle: Vehicle;
}

const VehicleReport: React.FC<VehicleReportProps> = ({ vehicle }) => (
  <Document>
    <Page size="A4">
      <ReportLayout title="Vehicle Details Report" pageNumber={1}>
        <View style={styles.section}>
          <Text style={styles.label}>Registration No:</Text>
          <Text style={styles.value}>{vehicle.vehicleRegistrationNo}</Text>

          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{vehicle.vehicleType}</Text>

          <Text style={styles.label}>Owner Name:</Text>
          <Text style={styles.value}>{vehicle.ownerName}</Text>

          <Text style={styles.label}>Contact No:</Text>
          <Text style={styles.value}>{vehicle.contactNo}</Text>

          <Text style={styles.label}>Mileage:</Text>
          <Text style={styles.value}>{vehicle.mileage} KM</Text>

          <Text style={styles.label}>Last Updated Time:</Text>
          <Text style={styles.value}>{vehicle.lastUpdate}</Text>
        </View>
      </ReportLayout>
    </Page>
  </Document>
);

export default VehicleReport; 