/**
 * Interface for the Utility Bill entity
 */
export interface UtilityBill {
  id: number;
  billing_Acc_No: number;
  type: string;
  address: string;
  meter_No: string;
  unit_Price: number;
}

/**
 * Interface for Monthly Utility Bill entity
 */
export interface MonthlyUtilityBill {
  id: number;
  invoiceNo: number;
  billingAccNo: number;
  billingMonth: string;
  billingYear: number;
  units: number;
  totalPayment: number;
  generatedDate: string;
}

/**
 * Interface for Utility Report Data
 */
export interface UtilityReportData {
  totalBills: number;
  totalUnits: number;
  totalCost: number;
  avgMonthlyCost: number;
  avgMonthlyUnits: number;
  unitPrice?: number; // Unit price for specific utility type
  totalGeneratedCost?: number;
  totalDifference?: number;
  monthlyData: UtilityMonthlyData[];
}

/**
 * Interface for Monthly Data in Utility Reports
 */
export interface UtilityMonthlyData {
  month: string;
  year: number;
  utilityType: string;
  units: number;
  cost: number;
  calculatedCost?: number;
}

/**
 * Utility Type option
 */
export interface UtilityTypeOption {
  id: string;
  name: string;
}

/**
 * Report Type option
 */
export interface ReportTypeOption {
  id: string;
  name: string;
}

/**
 * Utility Report Request parameters
 */
export interface UtilityReportRequest {
  startDate: string;
  endDate: string;
  utilityType: string;
  includeChart?: boolean;
}

/**
 * Utility Totals for report summaries
 */
export interface UtilityTypeTotals {
  units: number;
  cost: number;
  avgUnits: number;
  highestMonth: {
    month: string;
    year: number;
    units: number;
  } | null;
}