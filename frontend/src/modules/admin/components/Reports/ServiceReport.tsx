import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import ReportLayout from './ReportLayout';
import { Job } from '../../../../types/Job';
import { Task } from '../../../../types/Task';
import { StockItem } from '../../../../types/Stock';

// PDF styles
const styles = StyleSheet.create({
    section: {
        margin: 10,
        padding: 10,
    },
    text: {
        fontSize: 12,
        marginBottom: 5,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    table: {
        display: 'flex',
        width: 'auto',
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        borderBottomStyle: 'solid',
        alignItems: 'center',
        padding: 5,
    },
    tableHeader: {
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
    },
    tableCell: {
        flex: 1,
        fontSize: 10,
    },
    totalCost: {
        marginTop: 20,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'right',
    },
});

interface ServiceReportProps {
    job: Job;
    tasks: Task[];
    spareParts: StockItem[];
}

const ServiceReport: React.FC<ServiceReportProps> = ({ job, tasks, spareParts }) => {
    const totalCost = tasks.reduce((sum, task) => sum + task.cost, 0) +
                     spareParts.reduce((sum, part) => sum + (part.qtyAvailable * part.unitPrice), 0);

    return (
        <Document>
            <Page size="A4">
                <ReportLayout title="Service Report" pageNumber={1}>
                    <View style={styles.section}>
                        {/* Vehicle Details */}
                        <Text style={styles.label}>Vehicle Details</Text>
                        <Text style={styles.text}>Registration Number: {job.vehicleRegistrationNumber}</Text>
                        <Text style={styles.text}>Owner Name: {job.ownerName}</Text>
                        <Text style={styles.text}>Contact Number: {job.contactNo}</Text>

                        {/* Job Details */}
                        <Text style={[styles.label, { marginTop: 10 }]}>Job Details</Text>
                        <Text style={styles.text}>Job ID: {job.jobId}</Text>
                        <Text style={styles.text}>Service Section: {job.serviceSection}</Text>
                        <Text style={styles.text}>Assigned Employee: {job.assignedEmployee}</Text>
                        <Text style={styles.text}>Status: {job.status}</Text>

                        {/* Tasks */}
                        <Text style={[styles.label, { marginTop: 10 }]}>Tasks</Text>
                        <View style={styles.table}>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={styles.tableCell}>Description</Text>
                                <Text style={styles.tableCell}>Cost (Rs.)</Text>
                            </View>
                            {tasks.map((task, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{task.description}</Text>
                                    <Text style={styles.tableCell}>{task.cost.toFixed(2)}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Spare Parts */}
                        <Text style={[styles.label, { marginTop: 10 }]}>Spare Parts</Text>
                        <View style={styles.table}>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={styles.tableCell}>Item Name</Text>
                                <Text style={styles.tableCell}>Quantity</Text>
                                <Text style={styles.tableCell}>Unit Price (Rs.)</Text>
                                <Text style={styles.tableCell}>Total (Rs.)</Text>
                            </View>
                            {spareParts.map((part, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{part.itemName}</Text>
                                    <Text style={styles.tableCell}>{part.qtyAvailable}</Text>
                                    <Text style={styles.tableCell}>{part.unitPrice.toFixed(2)}</Text>
                                    <Text style={styles.tableCell}>{(part.qtyAvailable * part.unitPrice).toFixed(2)}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Total Cost */}
                        <Text style={styles.totalCost}>
                            Total Cost: Rs. {totalCost.toFixed(2)}
                        </Text>
                    </View>
                </ReportLayout>
            </Page>
        </Document>
    );
};

export default ServiceReport; 