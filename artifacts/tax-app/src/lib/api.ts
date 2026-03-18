export interface KPIData {
  totalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  estimatedTaxOwed: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export interface TaxCategoryData {
  name: string;
  value: number;
}

export interface TaxSummary {
  kpis: KPIData;
  monthlyChart: MonthlyData[];
  categoryChart: TaxCategoryData[];
}

export type TransactionStatus = "Completed" | "Pending" | "Processing";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  isDeductible: boolean;
  status: TransactionStatus;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export async function getTaxSummary(): Promise<TaxSummary> {
  return fetchJson<TaxSummary>("/api/tax/summary");
}

export async function getTaxTransactions(): Promise<Transaction[]> {
  return fetchJson<Transaction[]>("/api/tax/transactions");
}
