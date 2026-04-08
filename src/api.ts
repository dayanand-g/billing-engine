import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

interface PlanData {
  [key: string]: unknown;
}

export interface UsageBreakdownItem {
  metric: string;
  totalUnits: number;
  rate: number;
  subtotal: number;
}

export interface InvoiceData {
  customerName: string;
  planName: string;
  billingPeriod: string;
  baseSubscriptionFee: number;
  usageBreakdown: UsageBreakdownItem[];
  totalAmountDue: number;
}

export const createPlan = async (planData: PlanData) => {
  const response = await axios.post(`${API_BASE_URL}/plans`, planData);
  return response.data;
};

export const getInvoice = async (customerId: string): Promise<InvoiceData> => {
  const response = await axios.get(`http://localhost:3000/api/customers/${customerId}/invoice`);
  return response.data;
};