import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import ReportLayout from './ReportLayout';
import { Employee } from '../../../../types/Employee';

// PDF styles
const styles = StyleSheet.create({
  section: {
    margin: 10,
    padding: 10,
  },
  text: {
    fontSize: 10,
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
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 24,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    padding: 5,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  tableCellLast: {
    flex: 1,
    fontSize: 9,
    padding: 5,
    textAlign: 'center',
  },
  summarySection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  summaryLabel: {
    flex: 2,
    fontSize: 10,
    fontWeight: 'bold',
  },
  summaryValue: {
    flex: 1,
    fontSize: 10,
    textAlign: 'right',
  },
  totalCost: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  chartContainer: {
    marginTop: 20,
    height: 200,
    padding: 10,
  },
  roleBreakdownTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  roleBreakdownTable: {
    display: 'flex',
    width: '60%',
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#000',
  },
});

interface EmployeeReportProps {
  employees: Employee[];
  startDate?: string;
  endDate?: string;
}

const EmployeeReport: React.FC<EmployeeReportProps> = ({
  employees,
  startDate,
  endDate
}) => {
  // Calculate summary data
  const totalEmployees = employees.length;
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const avgSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;

  // Group employees by role
  const roleGroups = employees.reduce((groups, employee) => {
    const role = employee.role;
    if (!groups[role]) {
      groups[role] = {
        count: 0,
        totalSalary: 0,
      };
    }
    groups[role].count += 1;
    groups[role].totalSalary += employee.salary;
    return groups;
  }, {} as Record<string, { count: number; totalSalary: number }>);

  // Convert to array for rendering
  const roleBreakdown = Object.entries(roleGroups).map(([role, data]) => ({
    role,
    count: data.count,
    totalSalary: data.totalSalary,
    avgSalary: data.totalSalary / data.count,
  }));

  // Sort by total salary (highest first)
  roleBreakdown.sort((a, b) => b.totalSalary - a.totalSalary);

  return (
    <Document>
      <Page size="A4">
        <ReportLayout title="Employee Salary Summary Report" pageNumber={1}>
          <View style={styles.section}>
            {/* Report Period */}
            {startDate && endDate && (
              <Text style={styles.text}>
                Report Period: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
              </Text>
            )}

            {/* Summary Section */}
            <View style={styles.summarySection}>
              <Text style={styles.label}>Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Employees:</Text>
                <Text style={styles.summaryValue}>{totalEmployees}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Monthly Salary Cost:</Text>
                <Text style={styles.summaryValue}>Rs. {totalSalary.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Average Salary:</Text>
                <Text style={styles.summaryValue}>Rs. {avgSalary.toFixed(2)}</Text>
              </View>
            </View>

            {/* Role Breakdown */}
            <Text style={styles.roleBreakdownTitle}>Salary Distribution by Role</Text>
            <View style={styles.roleBreakdownTable}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Role</Text>
                <Text style={styles.tableCell}>Count</Text>
                <Text style={styles.tableCell}>Total Salary (Rs)</Text>
                <Text style={styles.tableCellLast}>Avg. Salary (Rs)</Text>
              </View>

              {roleBreakdown.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.role}</Text>
                  <Text style={styles.tableCell}>{item.count}</Text>
                  <Text style={styles.tableCell}>{item.totalSalary.toFixed(2)}</Text>
                  <Text style={styles.tableCellLast}>{item.avgSalary.toFixed(2)}</Text>
                </View>
              ))}
            </View>

            {/* Employee Details Table */}
            <Text style={styles.label}>Employee Details</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>ID</Text>
                <Text style={styles.tableCell}>Name</Text>
                <Text style={styles.tableCell}>Role</Text>
                <Text style={styles.tableCell}>Gender</Text>
                <Text style={styles.tableCellLast}>Salary (Rs)</Text>
              </View>

              {employees.map((employee) => (
                <View key={employee.empId} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{employee.empId}</Text>
                  <Text style={styles.tableCell}>{`${employee.firstname} ${employee.lastname}`}</Text>
                  <Text style={styles.tableCell}>{employee.role}</Text>
                  <Text style={styles.tableCell}>{employee.gender}</Text>
                  <Text style={styles.tableCellLast}>{employee.salary.toFixed(2)}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.totalCost}>Total Monthly Salary Cost: Rs. {totalSalary.toFixed(2)}</Text>
          </View>
        </ReportLayout>
      </Page>
    </Document>
  );
};

export default EmployeeReport;
