import React, { useState } from "react";
import StocksLayout from "../../layout/StockLayouts/StocksLayout";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ErrorBoundary } from 'react-error-boundary';
import ReportLayout from "../../components/Reports/ReportLayout";
 
interface ErrorFallbackProps {
    error: Error
}

const ErrorFallback = ({ error }: ErrorFallbackProps) => (
    <div className="text-red-500 p-4">
        <h2>Something went wrong:</h2>
        <pre>{error.message}</pre>
    </div>
);

// Define report types
const REPORT_TYPES = [
    { id: 'spare_parts', name: 'Spare Parts Sales Report' },
    { id: 'supplier_purchase', name: 'Supplier Purchase Report' },
    { id: 'inventory', name: 'Inventory Report' }
];

// PDF styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        margin: 10,
        padding: 10,
    },
    text: {
        fontSize: 12,
        marginBottom: 5,
    },
    content: {
        marginTop: 20,
        padding: 10,
        borderRadius: 4,
    },
    tableHeader: {
        backgroundColor: '#f0f0f0',
        flexDirection: 'row',
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        padding: 8,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        padding: 8,
    },
    cell: {
        flex: 1,
        fontSize: 10,
    }
});

const AdminStockReportsManager: React.FC = () => {
    const [selectedReportType, setSelectedReportType] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showPDF, setShowPDF] = useState(false);
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const generateReport = async () => {
        setLoading(true);
        setError(null);
        if (!selectedReportType || !startDate || !endDate) {
            alert('Please select all required fields');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/reports/${selectedReportType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                }),
            });

            const data = await response.json();
            setReportData(data);
            setShowPDF(true);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to generate report');
            console.error('Error generating report:', error);
        } finally {
            setLoading(false);
        }
    };

    const ReportDocument = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <ReportLayout 
                    title={REPORT_TYPES.find(r => r.id === selectedReportType)?.name || ''}
                    pageNumber={1}
                >
                    <View style={styles.section}>
                        <Text style={styles.text}>Period: {startDate?.toDateString()} - {endDate?.toDateString()}</Text>
                        
                        {reportData && (
                            <View style={styles.content}>
                                {/* report data based on report type */}
                                {selectedReportType === 'spare_parts' && (
                                    <View>
                                        <Text style={styles.text}>Total Sales: {reportData.totalSales}</Text>
                                        <Text style={styles.text}>Items Sold: {reportData.itemsSold}</Text>
                                    </View>
                                )}
                                
                                {selectedReportType === 'supplier_purchase' && (
                                    <View>
                                        <Text style={styles.text}>Total Purchases: {reportData.totalPurchases}</Text>
                                        <Text style={styles.text}>Suppliers: {reportData.suppliersCount}</Text>
                                    </View>
                                )}
                                
                                {selectedReportType === 'inventory' && (
                                    <View>
                                        <Text style={styles.text}>Total Items: {reportData.totalItems}</Text>
                                        <Text style={styles.text}>Low Stock Items: {reportData.lowStockItems}</Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                </ReportLayout>
            </Page>
        </Document>
    );

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <StocksLayout>
                <div className="max-w-4xl mx-auto p-6">
                    <h2 className="text-2xl font-semibold mb-6">Generate Stock Reports</h2>
                    
                    {loading ? (
                        <div className="flex justify-center items-center mt-16">
                            <p className="text-lg text-gray-700">Generating Report...</p>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center mt-16">
                            <p className="text-lg text-red-500">{error}</p>
                        </div>
                    ) : (
                        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
                            {/* Report Type Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Report Type
                                </label>
                                <select
                                    value={selectedReportType}
                                    onChange={(e) => setSelectedReportType(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="">Select Report Type</option>
                                    {REPORT_TYPES.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Range Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date
                                    </label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date: Date | null) => setStartDate(date)}
                                        className="w-full p-2 border rounded-md"
                                        dateFormat="yyyy-MM-dd"
                                        maxDate={new Date()}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date
                                    </label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date: Date | null) => setEndDate(date)}
                                        className="w-full p-2 border rounded-md"
                                        dateFormat="yyyy-MM-dd"
                                        maxDate={new Date()}
                                        minDate={startDate || undefined}
                                    />
                                </div>
                            </div>

                            {/* Generate Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={generateReport}
                                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                                >
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PDF Viewer */}
                    {showPDF && reportData && (
                        <div className="mt-6 h-screen">
                            <PDFViewer width="100%" height="100%">
                                <ReportDocument />
                            </PDFViewer>
                        </div>
                    )}
                </div>
            </StocksLayout>
        </ErrorBoundary>
    );
};

export default AdminStockReportsManager;