import { useState, useMemo } from "react";
import { useTaxTransactions } from "@/hooks/use-tax-data";
import { format } from "date-fns";
import { Search, ArrowUpDown, Download, Filter, FilePlus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Transaction } from "@/lib/api";

type SortConfig = {
  key: keyof Transaction;
  direction: 'asc' | 'desc';
};

export default function TaxTransactions() {
  const { data: transactions, isLoading, isError } = useTaxTransactions();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Process data: Filter -> Sort -> Paginate
  const processedData = useMemo(() => {
    if (!transactions) return { items: [], totalPages: 0, totalItems: 0 };
    
    // 1. Filter
    let filtered = transactions;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.description.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        tx.amount.toString().includes(q)
      );
    }
    
    // 2. Sort
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        return sortConfig.direction === 'asc' 
          ? (aVal === bVal ? 0 : aVal ? -1 : 1)
          : (aVal === bVal ? 0 : aVal ? 1 : -1);
      }
      return 0;
    });
    
    // 3. Paginate
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);
    
    return { items: paginatedItems, totalPages, totalItems };
  }, [transactions, searchQuery, sortConfig, page]);

  // Reset page when search changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleSort = (key: keyof Transaction) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your transactions are being exported to CSV.",
    });
  };

  const handleAdd = () => {
    toast({
      title: "Add Transaction",
      description: "This would open a dialog to add a new transaction manually.",
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  if (isError) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-destructive">
        Failed to load transactions
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Tax Transactions</h1>
          <p className="text-muted-foreground">Detailed view of all tax-relevant incomes and expenses.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={handleAdd} className="shadow-md shadow-primary/20">
            <FilePlus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </div>
      </div>

      <Card className="shadow-lg shadow-black/5 border-border/50 overflow-hidden">
        <CardHeader className="pb-4 bg-muted/30">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search transactions..." 
                className="pl-9 bg-background border-border/60 focus:bg-background"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto bg-background">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px]">
                  <Button variant="ghost" onClick={() => handleSort('date')} className="-ml-4 h-8 data-[state=open]:bg-transparent hover:bg-transparent font-semibold">
                    Date
                    <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('description')} className="-ml-4 h-8 hover:bg-transparent font-semibold">
                    Description
                    <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <Button variant="ghost" onClick={() => handleSort('category')} className="-ml-4 h-8 hover:bg-transparent font-semibold">
                    Category
                    <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort('amount')} className="h-8 hover:bg-transparent font-semibold float-right px-0">
                    Amount
                    <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead className="hidden sm:table-cell text-center">
                  <Button variant="ghost" onClick={() => handleSort('isDeductible')} className="h-8 hover:bg-transparent font-semibold">
                    Deductible
                    <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead className="hidden lg:table-cell text-center">
                  <Button variant="ghost" onClick={() => handleSort('status')} className="h-8 hover:bg-transparent font-semibold">
                    Status
                    <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading Skeleton Rows
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full max-w-[250px]" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                    <TableCell className="hidden sm:table-cell text-center"><Skeleton className="h-6 w-16 mx-auto rounded-full" /></TableCell>
                    <TableCell className="hidden lg:table-cell text-center"><Skeleton className="h-6 w-20 mx-auto rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : processedData.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                    No transactions found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                processedData.items.map((tx) => (
                  <TableRow key={tx.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-muted-foreground whitespace-nowrap">
                      {format(new Date(tx.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {tx.description}
                      {/* Mobile-only badges to save space */}
                      <div className="flex gap-2 mt-2 sm:hidden">
                         <Badge variant={tx.isDeductible ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                          {tx.isDeductible ? "Deductible" : "Non-Deductible"}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{tx.category}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary/50 text-secondary-foreground text-xs font-medium">
                        {tx.category}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right font-bold tracking-tight ${tx.amount < 0 ? 'text-destructive' : 'text-emerald-600'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center">
                      <Badge variant={tx.isDeductible ? "default" : "outline"} className={tx.isDeductible ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-muted-foreground"}>
                        {tx.isDeductible ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-center">
                      <Badge variant="outline" className={
                        tx.status === 'Completed' ? "border-emerald-200 text-emerald-700 bg-emerald-50" : 
                        "border-amber-200 text-amber-700 bg-amber-50"
                      }>
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {!isLoading && processedData.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/10">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{(page - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-foreground">{Math.min(page * itemsPerPage, processedData.totalItems)}</span> of <span className="font-medium text-foreground">{processedData.totalItems}</span> entries
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-8"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, processedData.totalPages) }).map((_, i) => {
                    // Show pages around current
                    let pageNum = i + 1;
                    if (processedData.totalPages > 5 && page > 3) {
                      pageNum = page - 2 + i;
                      if (pageNum > processedData.totalPages) return null;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "ghost"}
                        size="sm"
                        className={`h-8 w-8 p-0 ${page === pageNum ? 'shadow-sm shadow-primary/20' : ''}`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.min(processedData.totalPages, p + 1))}
                  disabled={page === processedData.totalPages}
                  className="h-8"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
