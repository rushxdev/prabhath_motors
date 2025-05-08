import React, { useState } from "react";
import StocksLayout from "../../layout/StockLayouts/StocksLayout";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { ErrorBoundary } from 'react-error-boundary';
import ReportLayout from "../../components/Reports/ReportLayout";
import DateRangeParameters from "../../components/Reports/parameters/DateRangeParameters";
import InventoryParameters from "../../components/Reports/parameters/InventoryParameters";

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
    { id: 'sales summery', name: 'Sales summary Report' },
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
        padding: 4,
    },
    cellHeader: {
        flex: 1,
        fontSize: 10,
        fontWeight: 'bold',
        padding: 4,
    },
    summarySection: {
        marginTop: 15,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#000',
    },
    summaryText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
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
    
    // Additional parameters for specific reports
    const [showLowStock, setShowLowStock] = useState<boolean>(false);

    const generateReport = async () => {
        setLoading(true);
        setError(null);
        
        // Validate required fields based on report type
        if (!selectedReportType) {
            alert('Please select a report type');
            setLoading(false);
            return;
        }
        
        // Validate date range for reports that need it
        if (['sales summery', 'supplier_purchase'].includes(selectedReportType) && 
            (!startDate || !endDate)) {
            alert('Please select a date range');
            setLoading(false);
            return;
        }

        try {
            // Build request body based on report type
            const requestBody: any = {};
            
            // Add common parameters
            // Convert Date objects to LocalDate format strings (YYYY-MM-DD)
            if (startDate) requestBody.startDate = startDate.toISOString().split('T')[0]; // Just the date part
            if (endDate) requestBody.endDate = endDate.toISOString().split('T')[0]; // Just the date part
                        
            // Add report-specific parameters
            if (selectedReportType === 'inventory') {
                requestBody.showLowStockOnly = showLowStock;
            }

            const response = await fetch(`http://localhost:8081/reports/${selectedReportType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
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

    // Function to render the appropriate parameter form based on report type
    const renderParameterForm = () => {
        if (!selectedReportType) return null;
        
        switch (selectedReportType) {
            case 'sales summery':
            case 'supplier_purchase':
                return (
                    <DateRangeParameters
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                    />
                );
            case 'inventory':
                return (
                    <InventoryParameters
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        showLowStock={showLowStock}
                        setShowLowStock={setShowLowStock}
                    />
                );
            default:
                return null;
        }
    };

    // Function to format currency
    const formatCurrency = (value: number): string => {
        return `Rs. ${value.toFixed(2)}`;
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
                                {/* Sales Summary Report with Table */}
                                {selectedReportType === 'sales summery' && (
                                    <View>
                                        {/* Table Header */}
                                        <View style={styles.tableHeader}>
                                            <Text style={styles.cellHeader}>Item Name</Text>
                                            <Text style={styles.cellHeader}>Quantity</Text>
                                            <Text style={styles.cellHeader}>Purchase Price</Text>
                                            <Text style={styles.cellHeader}>Sold Price</Text>
                                            <Text style={styles.cellHeader}>Revenue</Text>
                                            <Text style={styles.cellHeader}>Expense</Text>
                                            <Text style={styles.cellHeader}>Profit</Text>
                                        </View>
                                        
                                        {/* Table Rows */}
                                        {reportData.salesDetails?.map((item: any, index: number) => (
                                            <View style={styles.tableRow} key={index}>
                                                <Text style={styles.cell}>{item.itemName}</Text>
                                                <Text style={styles.cell}>{item.soldQty}</Text>
                                                <Text style={styles.cell}>{formatCurrency(item.purchasePrice)}</Text>
                                                <Text style={styles.cell}>{formatCurrency(item.soldPrice)}</Text>
                                                <Text style={styles.cell}>{formatCurrency(item.revenue)}</Text>
                                                <Text style={styles.cell}>{formatCurrency(item.expense)}</Text>
                                                <Text style={styles.cell}>{formatCurrency(item.revenue - item.expense)}</Text>
                                            </View>
                                        ))}
                                        
                                        {/* Summary Section */}
                                        <View style={styles.summarySection}>
                                            <Text style={styles.summaryText}>Total Items Sold: {reportData.itemsSold}</Text>
                                            <Text style={styles.summaryText}>Total Sales: {formatCurrency(reportData.totalSales)}</Text>
                                            <Text style={styles.summaryText}>Total Expenses: {formatCurrency(reportData.totalExpenses)}</Text>
                                            <Text style={styles.summaryText}>Net Profit: {formatCurrency(reportData.totalSales - reportData.totalExpenses)}</Text>
                                        </View>
                                    </View>
                                )}
                                
                                {/* Supplier Purchase Report */}
                                {selectedReportType === 'supplier_purchase' && (
                                    <View>
                                        <Text style={styles.text}>Total Purchases: {reportData.totalPurchases}</Text>
                                        <Text style={styles.text}>Suppliers: {reportData.suppliersCount}</Text>
                                    </View>
                                )}
                                
                                {/* Inventory Report */}
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
                        <div className="space-y-6">
                            {/* Report Type Selection - First Section */}
                            <div className="bg-white p-6 rounded-lg shadow">
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

                            {/* Parameters Section - Second Section (Dynamic) */}
                            {selectedReportType && (
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-lg font-medium mb-4">
                                        {REPORT_TYPES.find(r => r.id === selectedReportType)?.name} Parameters
                                    </h3>
                                    {renderParameterForm()}
                                    
                                    {/* Generate Button */}
                                    <div className="flex justify-end mt-6">
                                        <button
                                            onClick={generateReport}
                                            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                                        >
                                            Generate Report
                                        </button>
                                    </div>
                                </div>
                            )}
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