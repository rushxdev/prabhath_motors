import React, { useState } from "react";
import StocksLayout from "../../layout/StockLayouts/StocksLayout";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { ErrorBoundary } from 'react-error-boundary';
import ReportLayout from "../../components/Reports/ReportLayout";
import DateRangeParameters from "../../components/Reports/parameters/DateRangeParameters";
import InventoryParameters from "../../components/Reports/parameters/InventoryParameters";
import ItemPurchaseHistoryParameters from "../../components/Reports/parameters/ItemPurchaseHistoryParameters";
import apiClient from "../../../../axios.config";

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
    { id: 'item_purchase_history', name: 'Item Purchase History Report' },
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
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<string>("stockLevel");
    const [showChart, setShowChart] = useState<boolean>(true);

    // Add state to track original values
    const [originalSettings, setOriginalSettings] = useState({
        reportType: '',
        startDate: null as Date | null,
        endDate: null as Date | null,
        showLowStock: false,
        selectedItemId: null as number | null,
        sortBy: 'stockLevel',
        showChart: true
    });
    
    // Handler for report type changes
    const handleReportTypeChange = (newReportType: string) => {
        if (showPDF) {
            if (window.confirm('Changing the report type will reset current report. Do you want to continue?')) {
                setSelectedReportType(newReportType);
                setShowPDF(false);
                setReportData(null);
            }
        } else {
            setSelectedReportType(newReportType);
        }
    };
    
    // Handler for date changes
    const handleDateChange = (type: 'start' | 'end', newDate: Date | null) => {
        if (showPDF) {
            if (window.confirm('Changing the date range will reset current report. Do you want to continue?')) {
                if (type === 'start') {
                    setStartDate(newDate);
                } else {
                    setEndDate(newDate);
                }
                setShowPDF(false);
                setReportData(null);
            }
        } else {
            if (type === 'start') {
                setStartDate(newDate);
            } else {
                setEndDate(newDate);
            }
        }
    };
    
    // Handler for low stock setting change
    const handleLowStockChange = (newValue: boolean) => {
        if (showPDF) {
            if (window.confirm('Changing the low stock filter will reset current report. Do you want to continue?')) {
                setShowLowStock(newValue);
                setShowPDF(false);
                setReportData(null);
            }
        } else {
            setShowLowStock(newValue);
        }
    };

    // Add a handler for sort changes
    const handleSortChange = (newSortBy: string) => {
        if (showPDF) {
            if (window.confirm('Changing the sort order will reset current report. Do you want to continue?')) {
                setSortBy(newSortBy);
                setShowPDF(false);
                setReportData(null);
            }
        } else {
            setSortBy(newSortBy);
        }
    };

    // Add a handler for showChart changes
    const handleShowChartChange = (newValue: boolean) => {
        if (showPDF) {
            if (window.confirm('Changing the chart display will reset current report. Do you want to continue?')) {
                setShowChart(newValue);
                setShowPDF(false);
                setReportData(null);
            }
        } else {
            setShowChart(newValue);
        }
    };

    const generateReport = async () => {
        setLoading(true);
        setError(null);
        
        // Store current settings when generating report
        setOriginalSettings({
            reportType: selectedReportType,
            startDate: startDate,
            endDate: endDate,
            showLowStock: showLowStock,
            selectedItemId: selectedItemId,
            sortBy: sortBy,
            showChart: showChart
        });
        
        // Validate required fields based on report type
        if (!selectedReportType) {
            alert('Please select a report type');
            setLoading(false);
            return;
        }
        
        // Validate date range and item selection for item purchase history report
        if (selectedReportType === 'item_purchase_history' && 
            (!startDate || !endDate || !selectedItemId)) {
            alert('Please select an item and date range');
            setLoading(false);
            return;
        }

        // Validate date range for reports that need it
        if (['sales summery'].includes(selectedReportType) && 
            (!startDate || !endDate)) {
            alert('Please select a date range');
            setLoading(false);
            return;
        }

        try {
            // Build request body based on report type
            const requestBody: any = {};
            
            // Add common parameters
            if (startDate) requestBody.startDate = startDate.toISOString().split('T')[0];
            if (endDate) requestBody.endDate = endDate.toISOString().split('T')[0];
                        
            // Add report-specific parameters
            if (selectedReportType === 'inventory') {
                requestBody.showLowStockOnly = showLowStock;
                requestBody.sortBy = sortBy;
            }

            // Add item-specific parameters
            if (selectedReportType === 'item_purchase_history') {
                requestBody.itemId = selectedItemId;
            }

            // Use apiClient instead of fetch
            const { data } = await apiClient.post(`/reports/${selectedReportType}`, requestBody);
            
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
                return (
                    <DateRangeParameters
                        startDate={startDate}
                        setStartDate={(date) => handleDateChange('start', date)}
                        endDate={endDate}
                        setEndDate={(date) => handleDateChange('end', date)}
                    />
                );
            case 'item_purchase_history':
                return (
                    <ItemPurchaseHistoryParameters
                        startDate={startDate}
                        setStartDate={(date) => handleDateChange('start', date)}
                        endDate={endDate}
                        setEndDate={(date) => handleDateChange('end', date)}
                        selectedItemId={selectedItemId}
                        setSelectedItemId={setSelectedItemId}
                    />
                );
            case 'inventory':
                return (
                    <InventoryParameters
                        startDate={startDate}
                        setStartDate={(date) => handleDateChange('start', date)}
                        endDate={endDate}
                        setEndDate={(date) => handleDateChange('end', date)}
                        showLowStock={showLowStock}
                        setShowLowStock={handleLowStockChange}
                        sortBy={sortBy}
                        setSortBy={handleSortChange}
                        showChart={showChart}
                        setShowChart={handleShowChartChange}
                    />
                );
            default:
                return null;
        }
    };

    // Function to format currency
    const formatCurrency = (value: number | undefined | null): string => {
        if (value === undefined || value === null) {
            return 'Rs. 0.00';
        }
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
                                        {reportData && reportData.salesDetails?.map((item: any, index: number) => (
                                            <View style={styles.tableRow} key={index}>
                                                <Text style={styles.cell}>{item.itemName || 'Unknown'}</Text>
                                                <Text style={styles.cell}>{item.soldQty || 0}</Text>
                                                <Text style={styles.cell}>{formatCurrency(item.purchasePrice)}</Text>
                                                <Text style={styles.cell}>{formatCurrency(item.soldPrice)}</Text>
                                                <Text style={styles.cell}>{formatCurrency(item.revenue)}</Text>
                                                <Text style={styles.cell}>{formatCurrency(item.expense)}</Text>
                                                <Text style={styles.cell}>{formatCurrency(item.revenue - item.expense)}</Text>
                                            </View>
                                        ))}
                                        
                                        {/* Summary Section */}
                                        <View style={styles.summarySection}>
                                            <Text style={styles.summaryText}>Total Items Sold: {reportData.itemsSold || 0}</Text>
                                            <Text style={styles.summaryText}>Total Sales: {formatCurrency(reportData.totalSales)}</Text>
                                            <Text style={styles.summaryText}>Total Expenses: {formatCurrency(reportData.totalExpenses)}</Text>
                                            <Text style={styles.summaryText}>Net Profit: {formatCurrency(
                                                (reportData.totalSales || 0) - (reportData.totalExpenses || 0)
                                            )}</Text>
                                        </View>
                                    </View>
                                )}
                                
                                {/* Inventory Report */}
                                {selectedReportType === 'inventory' && reportData && (
                                    <View>
                                        {/* Summary Section */}
                                        <View style={{ marginBottom: 15 }}>
                                            <Text style={[styles.text, { fontWeight: 'bold', fontSize: 14, marginBottom: 5 }]}>Inventory Summary</Text>
                                            <Text style={styles.text}>Total Items: {reportData.totalItems}</Text>
                                            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.text}>Critical Stock: {reportData.criticalItems}</Text>
                                                    <Text style={styles.text}>Low Stock: {reportData.lowItems}</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.text}>Medium Stock: {reportData.mediumItems}</Text>
                                                    <Text style={styles.text}>High Stock: {reportData.highItems}</Text>
                                                </View>
                                            </View>
                                            <View style={{ marginTop: 10, paddingTop: 5, borderTopWidth: 1, borderTopColor: '#ccc' }}>
                                                <Text style={[styles.text, { fontWeight: 'bold' }]}>Inventory Value: {formatCurrency(reportData.totalInventoryValue)}</Text>
                                                <Text style={styles.text}>Purchase Value: {formatCurrency(reportData.totalPurchaseValue)}</Text>
                                                <Text style={[styles.text, { fontWeight: 'bold', color: reportData.potentialProfit >= 0 ? 'green' : 'red' }]}>
                                                    Potential Profit: {formatCurrency(reportData.potentialProfit)}
                                                </Text>
                                            </View>
                                        </View>
                                        
                                        {/* Optional Stock Level Distribution Chart */}
                                        {showChart && (
                                            <>
                                                <View style={{ marginBottom: 15, height: 50, flexDirection: 'row' }}>
                                                    {reportData.criticalItems > 0 && (
                                                        <View 
                                                            style={{ 
                                                                flex: reportData.criticalItems / reportData.totalItems, 
                                                                backgroundColor: '#FF4136',
                                                                height: '100%',
                                                                marginRight: 1
                                                            }} 
                                                        />
                                                    )}
                                                    {reportData.lowItems > 0 && (
                                                        <View 
                                                            style={{ 
                                                                flex: reportData.lowItems / reportData.totalItems, 
                                                                backgroundColor: '#FF851B',
                                                                height: '100%',
                                                                marginRight: 1
                                                            }} 
                                                        />
                                                    )}
                                                    {reportData.mediumItems > 0 && (
                                                        <View 
                                                            style={{ 
                                                                flex: reportData.mediumItems / reportData.totalItems, 
                                                                backgroundColor: '#2ECC40',
                                                                height: '100%',
                                                                marginRight: 1
                                                            }} 
                                                        />
                                                    )}
                                                    {reportData.highItems > 0 && (
                                                        <View 
                                                            style={{ 
                                                                flex: reportData.highItems / reportData.totalItems, 
                                                                backgroundColor: '#0074D9',
                                                                height: '100%'
                                                            }} 
                                                        />
                                                    )}
                                                </View>
                                                <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                        <View style={{ width: 10, height: 10, backgroundColor: '#FF4136', marginRight: 5 }} />
                                                        <Text style={{ fontSize: 8 }}>Critical</Text>
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                        <View style={{ width: 10, height: 10, backgroundColor: '#FF851B', marginRight: 5 }} />
                                                        <Text style={{ fontSize: 8 }}>Low</Text>
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                        <View style={{ width: 10, height: 10, backgroundColor: '#2ECC40', marginRight: 5 }} />
                                                        <Text style={{ fontSize: 8 }}>Medium</Text>
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                        <View style={{ width: 10, height: 10, backgroundColor: '#0074D9', marginRight: 5 }} />
                                                        <Text style={{ fontSize: 8 }}>High</Text>
                                                    </View>
                                                </View>
                                            </>
                                        )}
                                        
                                        {/* Items Table */}
                                        <Text style={[styles.text, { fontWeight: 'bold', fontSize: 14, marginBottom: 5, marginTop: 10 }]}>
                                            {showLowStock ? "Low Stock Items" : "All Items"}
                                        </Text>
                                        
                                        {/* Table Header */}
                                        <View style={styles.tableHeader}>
                                            <Text style={styles.cellHeader}>Item Name</Text>
                                            <Text style={styles.cellHeader}>Category</Text>
                                            <Text style={styles.cellHeader}>Qty</Text>
                                            <Text style={styles.cellHeader}>Reorder</Text>
                                            <Text style={styles.cellHeader}>Level</Text>
                                            <Text style={styles.cellHeader}>Value</Text>
                                        </View>
                                        
                                        {/* Table Rows */}
                                        {reportData.items.map((item: any, index: number) => (
                                            <View style={styles.tableRow} key={index}>
                                                <Text style={styles.cell}>{item.itemName}</Text>
                                                <Text style={styles.cell}>{item.category}</Text>
                                                <Text style={styles.cell}>{item.qtyAvailable}</Text>
                                                <Text style={styles.cell}>{item.reorderLevel}</Text>
                                                <Text style={styles.cell}>{item.stockLevel}</Text>
                                                <Text style={styles.cell}>{formatCurrency(item.inventoryValue)}</Text>
                                            </View>
                                        ))}
                                        
                                        {/* Summary section at the end */}
                                        <View style={styles.summarySection}>
                                            <Text style={styles.summaryText}>Total Inventory Value: {formatCurrency(reportData.totalInventoryValue)}</Text>
                                            <Text style={styles.summaryText}>Items Count: {reportData.totalItems}</Text>
                                        </View>
                                    </View>
                                )}

                                {/* Item Purchase History Report */}
                                {selectedReportType === 'item_purchase_history' && reportData && (
                                    <View>
                                        {/* Item Details Section */}
                                        <View style={{ marginBottom: 10 }}>
                                            <Text style={styles.text}>Item Name: {reportData.itemDetails?.itemName}</Text>
                                            <Text style={styles.text}>Barcode: {reportData.itemDetails?.itemBarcode}</Text>
                                            <Text style={styles.text}>Category: {reportData.itemDetails?.categoryName}</Text>
                                            <Text style={styles.text}>Current Stock: {reportData.itemDetails?.qtyAvailable}</Text>
                                            <Text style={styles.text}>Stock Level: {reportData.itemDetails?.stockLevel}</Text>
                                        </View>
                                        
                                        {/* Purchase History Table */}
                                        <View style={{ marginTop: 10 }}>
                                            <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 8 }]}>Purchase History</Text>
                                            
                                            {/* Table Header */}
                                            <View style={styles.tableHeader}>
                                                <Text style={styles.cellHeader}>Date</Text>
                                                <Text style={styles.cellHeader}>Quantity</Text>
                                                <Text style={styles.cellHeader}>Unit Price</Text>
                                                <Text style={styles.cellHeader}>Sell Price</Text>
                                                <Text style={styles.cellHeader}>Supplier</Text>
                                            </View>
                                            
                                            {/* Table Rows */}
                                            {reportData.purchaseHistory?.map((entry: any, index: number) => (
                                                <View style={styles.tableRow} key={index}>
                                                    <Text style={styles.cell}>{entry.dateAdded}</Text>
                                                    <Text style={styles.cell}>{entry.qtyAdded}</Text>
                                                    <Text style={styles.cell}>{formatCurrency(entry.unitPrice)}</Text>
                                                    <Text style={styles.cell}>{formatCurrency(entry.sellPrice)}</Text>
                                                    <Text style={styles.cell}>{entry.supplierName}</Text>
                                                </View>
                                            ))}
                                            
                                            {/* Summary Section */}
                                            <View style={styles.summarySection}>
                                                <Text style={styles.summaryText}>Total Purchases: {reportData.totalPurchases}</Text>
                                                <Text style={styles.summaryText}>Total Quantity: {reportData.totalQuantity}</Text>
                                                <Text style={styles.summaryText}>Average Unit Price: {formatCurrency(reportData.averageUnitPrice)}</Text>
                                            </View>
                                        </View>
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
                                    onChange={(e) => handleReportTypeChange(e.target.value)}
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