import axios from 'axios';

const API_BASE_URL = '/api';

interface PlanData {
  name: string;
  basePrice: number;
  usageRates: Array<{
    metric: string;
    ratePerUnit: number;
  }>;
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

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const createPlan = async (planData: PlanData) => {
  const response = await api.post(`/plans`, planData);
  return response.data;
};

export const getInvoice = async (customerId: string): Promise<InvoiceData> => {
  const response = await api.get(`/customers/${customerId}/invoice`);
  return response.data;
};

export const trackUsage = async (usageData: { customerId: string; metric: string; quantity: number }) => {
  const response = await api.post('/usage', usageData);
  return response.data;
};