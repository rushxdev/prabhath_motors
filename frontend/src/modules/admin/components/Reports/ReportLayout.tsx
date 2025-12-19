import React from 'react';
import { View, Text, StyleSheet, Image } from '@react-pdf/renderer';

// PDF styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        position: 'relative',
        minHeight: '100%',
    },
    header: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    titleSection: {
        marginBottom: 20,
        bordeBottomWidth: 1,
        borderBottomColor: '#666',
        padding: 8,
        display: 'flex',
        flexDirection: 'row',
    },
    titleText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    logo: {
        width: 100,
        marginBottom: 8,
    },
    companyNameLogoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    companyNameContainer: {
        flexGrow: 1,
        textAlign: 'center',
    },
    companyName: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    headerText: {
        fontSize: 14,
        color: '#333',
        marginTop: 4,
    },
    companyInfoContainer: {
        width: 200,
        textAlign: 'right',
        fontSize: 8,
        color: '#444',
        lineHeight: 1.4,
        marginBottom: 'auto',
    },
    companyInfoText: {
        fontSize: 8,
        marginBottom: 2,
    },
    content: {
        marginBottom: 30,
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 10,
        color: '#666',
        borderTopWidth: 1,
        borderTopColor: '#eaeaea',
        paddingTop: 10,
    },
    pageNumber: {
        position: 'absolute',
        bottom: 20,
        right: 30,
        fontSize: 10,
        color: '#666',
    },
});

interface ReportLayoutProps {
    children: React.ReactNode;
    title: string;
    pageNumber: number;
}

const ReportLayout: React.FC<ReportLayoutProps> = ({ children, title, pageNumber }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.companyNameLogoContainer}>
                    <Image style={styles.logo} src="/assets/images/logo.png" />
                    <View style={styles.companyNameContainer}>
                        <Text style={styles.companyName}>Prabhath Motors</Text>
                    </View>
                </View>
                <View style={styles.companyInfoContainer}>
                    <Text style={styles.companyInfoText}>No: 188/1/A, Edithland, Wilimbula</Text>
                    <Text style={styles.companyInfoText}>Henegama, 11715</Text>
                    <Text style={styles.companyInfoText}>Tel: +94 76 190 3423, +94 76 094 1533</Text>
                    <Text style={styles.companyInfoText}>Email: info@prabathmotors.com</Text>
                    <Text style={styles.companyInfoText}>Web: www.prabathmotors.com</Text>
                </View>
            </View>

            {/* Separate section for dynamic title with its own border */}
            <View style={styles.titleSection}>
                <Text style={styles.titleText}>{title}</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>{children}</View>

            {/* Fixed footer elements */}
            <Text fixed style={styles.footer}>
                Generated on {new Date().toLocaleDateString()}
            </Text>
            <Text fixed style={styles.pageNumber}>
                Page {pageNumber}
            </Text>
        </View>
    );
};

export default ReportLayout;
