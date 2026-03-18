import { useQuery } from "@tanstack/react-query";
import { getTaxSummary, getTaxTransactions } from "@/lib/api";

export function useTaxSummary() {
  return useQuery({
    queryKey: ["tax-summary"],
    queryFn: getTaxSummary,
  });
}

export function useTaxTransactions() {
  return useQuery({
    queryKey: ["tax-transactions"],
    queryFn: getTaxTransactions,
  });
}
