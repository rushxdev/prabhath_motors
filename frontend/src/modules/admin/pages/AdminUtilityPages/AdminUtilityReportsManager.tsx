import React, { useState } from "react";
import UtilityLayout from "../../layout/UtilityLayouts/UtilityLayouts";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ErrorBoundary } from 'react-error-boundary';
import ReportLayout from "../../components/Reports/ReportLayout";
import axios from "axios";
import { 
    UtilityReportData, 
    UtilityMonthlyData, 
    ReportTypeOption, 
    UtilityTypeOption, 
    UtilityTypeTotals 
} from "../../../../types/Utility";

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
const REPORT_TYPES: ReportTypeOption[] = [
    { id: 'monthly_utility_analysis', name: 'Monthly Utility Analysis Report' },
   
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
        fontSize: 10,
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
    },
    chart: {
        marginTop: 20,
        marginBottom: 20,
    },
    chartImage: {
        width: '100%',
        height: 200,
    },
    summaryBox: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    summaryTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    summaryRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    summaryLabel: {
        flex: 1,
        fontSize: 10,
    },
    summaryValue: {
        flex: 1,
        fontSize: 10,
        textAlign: 'right',
    }
});

const AdminUtilityReportsManager: React.FC = () => {
    // State for report generation
    const [selectedReportType, setSelectedReportType] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [utilityType, setUtilityType] = useState<string>('all');
    const [showPDF, setShowPDF] = useState(false);
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Data for utility types
    const utilityTypes = [
        { id: 'all', name: 'All Types' },
        { id: 'Electricity', name: 'Electricity' },
        { id: 'Water', name: 'Water' },
    ];

    const generateReport = async () => {
        setLoading(true);
        setError(null);
        if (!selectedReportType || !startDate || !endDate) {
            alert('Please select report type and date range');
            setLoading(false);
            return;
        }

        try {
            // Fetch report data from backend API
            const response = await axios.post(`http://localhost:8081/api/utility/reports/${selectedReportType}`, {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                utilityType: utilityType,
                includeChart: false, // Charts are not included in this version
            });

            setReportData(response.data);
            setShowPDF(true);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                console.error('Error generating report:', error);
            } else {
                setError('Failed to generate report');
                console.error('Unknown error generating report:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const ReportDocument = () => {
        // Calculate utility type specific totals
        const electricityBills = reportData?.monthlyData?.filter((item: any) => item.utilityType === 'Electricity') || [];
        const waterBills = reportData?.monthlyData?.filter((item: any) => item.utilityType === 'Water') || [];
        
        // Find highest consumption month for each utility type
        const findHighestConsumptionBill = (bills: any[]) => {
            if (!bills.length) return null;
            return bills.reduce((highest, current) => 
                current.units > highest.units ? current : highest, bills[0]);
        };
        
        const electricityTotals = {
            units: electricityBills.reduce((sum: number, item: any) => sum + item.units, 0),
            cost: electricityBills.reduce((sum: number, item: any) => sum + item.cost, 0),
            avgUnits: electricityBills.length > 0 ? Math.round(electricityBills.reduce((sum: number, item: any) => sum + item.units, 0) / electricityBills.length) : 0,
            highestMonth: findHighestConsumptionBill(electricityBills)
        };
        
        const waterTotals = {
            units: waterBills.reduce((sum: number, item: any) => sum + item.units, 0),
            cost: waterBills.reduce((sum: number, item: any) => sum + item.cost, 0),
            avgUnits: waterBills.length > 0 ? Math.round(waterBills.reduce((sum: number, item: any) => sum + item.units, 0) / waterBills.length) : 0,
            highestMonth: findHighestConsumptionBill(waterBills)
        };

        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <ReportLayout 
                        title={REPORT_TYPES.find(r => r.id === selectedReportType)?.name || ''}
                        pageNumber={1}
                    >
                        <View style={styles.section}>
                            <Text style={styles.text}>Period: {startDate ? startDate.toLocaleString('default', { month: 'long', year: 'numeric' }) : ''} - {endDate ? endDate.toLocaleString('default', { month: 'long', year: 'numeric' }) : ''}</Text>
                            <Text style={styles.text}>Utility Type: {utilityType === 'all' ? 'All Types' : utilityType}</Text>
                            
                            {reportData && (
                                <View style={styles.content}>
                                    {/* Summary section */}
                                    <View style={styles.summaryBox}>
                                        <Text style={styles.summaryTitle}>Utility Consumption Summary</Text>
                                        
                                        <View style={styles.summaryRow}>
                                            <Text style={styles.summaryLabel}>Total Bills Analyzed:</Text>
                                            <Text style={styles.summaryValue}>{reportData.totalBills}</Text>
                                        </View>
                                        
                                        <View style={styles.summaryRow}>
                                            <Text style={styles.summaryLabel}>Total Consumption (Units):</Text>
                                            <Text style={styles.summaryValue}>{reportData.totalUnits}</Text>
                                        </View>
                                        
                                        <View style={styles.summaryRow}>
                                            <Text style={styles.summaryLabel}>Total Cost:</Text>
                                            <Text style={styles.summaryValue}>Rs. {reportData.totalCost?.toLocaleString()}</Text>
                                        </View>
                                        
                                        <View style={styles.summaryRow}>
                                            <Text style={styles.summaryLabel}>Average Monthly Cost:</Text>
                                            <Text style={styles.summaryValue}>Rs. {reportData.avgMonthlyCost?.toLocaleString()}</Text>
                                        </View>
                                        
                                        <View style={styles.summaryRow}>
                                            <Text style={styles.summaryLabel}>Average Units Per Month:</Text>
                                            <Text style={styles.summaryValue}>{reportData.avgMonthlyUnits}</Text>
                                        </View>
                                    </View>

                                    {/* Utility Type Breakdown */}
                                    {utilityType === 'all' && (
                                        <View style={[styles.summaryBox, {marginTop: 15}]}>
                                            <Text style={styles.summaryTitle}>Utility Type Breakdown</Text>
                                            
                                            {/* Electricity Section */}
                                            <View style={{marginBottom: 10}}>
                                                <Text style={{fontSize: 12, fontWeight: 'bold', marginBottom: 5}}>Electricity</Text>
                                                
                                                <View style={styles.summaryRow}>
                                                    <Text style={styles.summaryLabel}>Total Units:</Text>
                                                    <Text style={styles.summaryValue}>{electricityTotals.units}</Text>
                                                </View>
                                                
                                                <View style={styles.summaryRow}>
                                                    <Text style={styles.summaryLabel}>Total Cost:</Text>
                                                    <Text style={styles.summaryValue}>Rs. {electricityTotals.cost.toLocaleString()}</Text>
                                                </View>
                                                
                                                <View style={styles.summaryRow}>
                                                    <Text style={styles.summaryLabel}>Bills Count:</Text>
                                                    <Text style={styles.summaryValue}>{electricityBills.length}</Text>
                                                </View>
                                                
                                                <View style={styles.summaryRow}>
                                                    <Text style={styles.summaryLabel}>Average Units Per Month:</Text>
                                                    <Text style={styles.summaryValue}>{electricityTotals.avgUnits}</Text>
                                                </View>
                                                
                                                {electricityTotals.highestMonth && (
                                                    <View style={styles.summaryRow}>
                                                        <Text style={styles.summaryLabel}>Highest Consumption Month:</Text>
                                                        <Text style={styles.summaryValue}>
                                                            {electricityTotals.highestMonth.month} {electricityTotals.highestMonth.year} ({electricityTotals.highestMonth.units} units)
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            
                                            {/* Water Section */}
                                            <View>
                                                <Text style={{fontSize: 12, fontWeight: 'bold', marginBottom: 5}}>Water</Text>
                                                
                                                <View style={styles.summaryRow}>
                                                    <Text style={styles.summaryLabel}>Total Units:</Text>
                                                    <Text style={styles.summaryValue}>{waterTotals.units}</Text>
                                                </View>
                                                
                                                <View style={styles.summaryRow}>
                                                    <Text style={styles.summaryLabel}>Total Cost:</Text>
                                                    <Text style={styles.summaryValue}>Rs. {waterTotals.cost.toLocaleString()}</Text>
                                                </View>
                                                
                                                <View style={styles.summaryRow}>
                                                    <Text style={styles.summaryLabel}>Bills Count:</Text>
                                                    <Text style={styles.summaryValue}>{waterBills.length}</Text>
                                                </View>
                                                
                                                <View style={styles.summaryRow}>
                                                    <Text style={styles.summaryLabel}>Average Units Per Month:</Text>
                                                    <Text style={styles.summaryValue}>{waterTotals.avgUnits}</Text>
                                                </View>
                                                
                                                {waterTotals.highestMonth && (
                                                    <View style={styles.summaryRow}>
                                                        <Text style={styles.summaryLabel}>Highest Consumption Month:</Text>
                                                        <Text style={styles.summaryValue}>
                                                            {waterTotals.highestMonth.month} {waterTotals.highestMonth.year} ({waterTotals.highestMonth.units} units)
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    </ReportLayout>
                </Page>

                {/* Monthly Data Page */}
                <Page size="A4" style={styles.page}>
                    <ReportLayout 
                        title={REPORT_TYPES.find(r => r.id === selectedReportType)?.name || ''}
                        pageNumber={2}
                    >
                        <View style={styles.section}>
                            <Text style={styles.text}>Period: {startDate ? startDate.toLocaleString('default', { month: 'long', year: 'numeric' }) : ''} - {endDate ? endDate.toLocaleString('default', { month: 'long', year: 'numeric' }) : ''}</Text>
                            <Text style={styles.text}>Utility Type: {utilityType === 'all' ? 'All Types' : utilityType}</Text>
                            
                            {reportData && (
                                <View style={styles.content}>
                                    {/* Monthly breakdown table */}
                                    <View style={{marginTop: 20}}>
                                        <Text style={{fontSize: 14, fontWeight: 'bold', marginBottom: 10}}>Monthly Breakdown</Text>
                                        
                                        <View style={styles.tableHeader}>
                                            <Text style={[styles.cell, {flex: 2}]}>Month/Year</Text>
                                            <Text style={styles.cell}>Utility Type</Text>
                                            <Text style={styles.cell}>Units</Text>
                                            <Text style={styles.cell}>Paid Amount (Rs)</Text>
                                            <Text style={styles.cell}>Generated Cost (Rs)</Text>
                                            <Text style={styles.cell}>Difference (Rs)</Text>
                                        </View>
                                        
                                        {reportData.monthlyData && reportData.monthlyData.map((item: UtilityMonthlyData, index: number) => (
                                            <View key={index} style={styles.tableRow}>
                                                <Text style={[styles.cell, {flex: 2}]}>{item.month} {item.year}</Text>
                                                <Text style={styles.cell}>{item.utilityType}</Text>
                                                <Text style={styles.cell}>{item.units}</Text>
                                                <Text style={styles.cell}>{item.cost.toLocaleString()}</Text>
                                                <Text style={styles.cell}>{
                                                    // If calculatedCost exists, use it
                                                    item.calculatedCost !== undefined 
                                                        ? item.calculatedCost.toLocaleString() 
                                                        // Otherwise, for specific utility type (not 'all'), calculate using unit price
                                                        : (utilityType !== 'all' && reportData.unitPrice 
                                                            ? (item.units * reportData.unitPrice).toLocaleString() 
                                                            : "N/A")
                                                }</Text>
                                                <Text style={styles.cell}>{
                                                    // If calculatedCost exists, calculate difference
                                                    item.calculatedCost !== undefined 
                                                        ? (item.cost - item.calculatedCost).toLocaleString() 
                                                        // Otherwise, for specific utility type (not 'all'), calculate using unit price
                                                        : (utilityType !== 'all' && reportData.unitPrice
                                                            ? (item.cost - (item.units * reportData.unitPrice)).toLocaleString() 
                                                            : "N/A")
                                                }</Text>
                                            </View>
                                        ))}

                                        {/* Summary row with totals */}
                                        {reportData.monthlyData && reportData.monthlyData.length > 0 && (
                                            <View style={[styles.tableRow, { backgroundColor: '#f0f0f0', fontWeight: 'bold' }]}>
                                                <Text style={[styles.cell, {flex: 2, fontWeight: 'bold'}]}>Total</Text>
                                                <Text style={[styles.cell, {fontWeight: 'bold'}]}></Text>
                                                <Text style={[styles.cell, {fontWeight: 'bold'}]}>
                                                    {reportData.totalUnits}
                                                </Text>
                                                <Text style={[styles.cell, {fontWeight: 'bold'}]}>
                                                    {reportData.totalCost?.toLocaleString()}
                                                </Text>
                                                <Text style={[styles.cell, {fontWeight: 'bold'}]}>
                                                    {(utilityType === 'all' 
                                                        ? reportData.monthlyData.reduce((sum: number, item: UtilityMonthlyData) => 
                                                            sum + (item.calculatedCost || 0), 0)
                                                        : reportData.totalGeneratedCost || reportData.monthlyData.reduce((sum: number, item: UtilityMonthlyData) => 
                                                            sum + (item.units * (reportData.unitPrice || 0)), 0)
                                                    ).toLocaleString()}
                                                </Text>
                                                <Text style={[styles.cell, {fontWeight: 'bold'}]}>
                                                    {(utilityType === 'all' 
                                                        ? reportData.totalCost - reportData.monthlyData.reduce((sum: number, item: UtilityMonthlyData) => 
                                                            sum + (item.calculatedCost || 0), 0)
                                                        : reportData.totalDifference || (reportData.totalCost - reportData.monthlyData.reduce((sum: number, item: UtilityMonthlyData) => 
                                                            sum + (item.units * (reportData.unitPrice || 0)), 0))
                                                    ).toLocaleString()}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>
                        </ReportLayout>
                    </Page>
                </Document>
            );
        };

    // Add a function to reset all selections
    const handleReset = () => {
        setSelectedReportType('');
        setStartDate(null);
        setEndDate(null);
        setUtilityType('all');
        setShowPDF(false);
        setReportData(null);
        setError(null);
    };

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <UtilityLayout>
                <div className="max-w-4xl mx-auto p-6">
                    <h2 className="text-2xl font-semibold mb-6">Generate Utility Reports</h2>
                    
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
                                    disabled={showPDF}
                                >
                                    <option value="">Select Report Type</option>
                                    {REPORT_TYPES.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Utility Type Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Utility Type
                                </label>
                                <select
                                    value={utilityType}
                                    onChange={(e) => setUtilityType(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    disabled={showPDF}
                                >
                                    {utilityTypes.map((type) => (
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
                                        Start Month
                                    </label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date: Date | null) => setStartDate(date)}
                                        className="w-full p-2 border rounded-md"
                                        dateFormat="MMMM yyyy"
                                        showMonthYearPicker
                                        maxDate={new Date()}
                                        disabled={showPDF}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Month
                                    </label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date: Date | null) => setEndDate(date)}
                                        className="w-full p-2 border rounded-md"
                                        dateFormat="MMMM yyyy"
                                        showMonthYearPicker
                                        maxDate={new Date()}
                                        minDate={startDate || undefined}
                                        disabled={showPDF}
                                    />
                                </div>
                            </div>

                            {/* Generate Button */}
                            <div className="flex justify-end space-x-4">
                                {showPDF && (
                                    <button
                                        onClick={handleReset}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        New Report
                                    </button>
                                )}
                                <button
                                    onClick={generateReport}
                                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                                    disabled={showPDF}
                                >
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PDF Viewer */}
                    {showPDF && reportData && (
                        <div className="mt-6 h-screen">
                            <div className="mb-4">
                                <button
                                    onClick={handleReset}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Generate New Report
                                </button>
                            </div>
                            <PDFViewer width="100%" height="100%">
                                <ReportDocument />
                            </PDFViewer>
                        </div>
                    )}
                </div>
            </UtilityLayout>
        </ErrorBoundary>
    );
};

export default AdminUtilityReportsManager;