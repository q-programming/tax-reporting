import { useTaxSummary } from "@/hooks/use-tax-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { DollarSign, TrendingDown, TrendingUp, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

export default function TaxSummary() {
  const { data, isLoading, isError } = useTaxSummary();

  if (isError) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Error loading data</h2>
          <p className="text-muted-foreground mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  // Recharts PIE colors mapping
  const PIE_COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Tax Summary</h1>
        <p className="text-muted-foreground">Overview of your income, expenses, and estimated tax obligations.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Income"
          value={data?.kpis.totalIncome}
          icon={DollarSign}
          isLoading={isLoading}
          trend="+12% from last year"
          trendUp={true}
        />
        <KpiCard
          title="Total Deductions"
          value={data?.kpis.totalDeductions}
          icon={TrendingDown}
          isLoading={isLoading}
          trend="+5% from last year"
          trendUp={false}
        />
        <KpiCard
          title="Taxable Income"
          value={data?.kpis.taxableIncome}
          icon={Calculator}
          isLoading={isLoading}
        />
        <KpiCard
          title="Estimated Tax Owed"
          value={data?.kpis.estimatedTaxOwed}
          icon={TrendingUp}
          isLoading={isLoading}
          highlight
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
        <Card className="lg:col-span-3 shadow-lg shadow-black/5 border-border/50">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>Monthly breakdown over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            {isLoading ? (
              <Skeleton className="h-[350px] w-full ml-6 rounded-xl" />
            ) : (
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.monthlyChart} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickFormatter={(value) => `$${value/1000}k`}
                    />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        borderRadius: '8px',
                        border: '1px solid hsl(var(--border))',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      formatter={(value: number) => [formatCurrency(value), undefined]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                    <Bar dataKey="income" name="Income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={32} />
                    <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg shadow-black/5 border-border/50">
          <CardHeader>
            <CardTitle>Tax Distribution</CardTitle>
            <CardDescription>Breakdown of estimated tax categories</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[350px] w-full rounded-xl" />
            ) : (
              <div className="h-[350px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.categoryChart}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {data?.categoryChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, undefined]}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        borderRadius: '8px',
                        border: '1px solid hsl(var(--border))',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                      formatter={(value, entry, index) => <span className="text-foreground font-medium">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, isLoading, trend, trendUp, highlight = false }: any) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-md",
      highlight ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-transparent" : "bg-card shadow-sm shadow-black/5"
    )}>
      {highlight && (
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      )}
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={cn("text-sm font-medium", highlight ? "text-primary-foreground/90" : "text-muted-foreground")}>
          {title}
        </CardTitle>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          highlight ? "bg-white/20" : "bg-primary/10 text-primary"
        )}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className={cn("h-8 w-[120px]", highlight ? "bg-white/20" : "")} />
        ) : (
          <>
            <div className="text-3xl font-bold font-display tracking-tight">
              {formatCurrency(value || 0)}
            </div>
            {trend && (
              <p className={cn(
                "text-xs mt-2 flex items-center font-medium", 
                highlight ? "text-primary-foreground/80" : (trendUp ? "text-emerald-600" : "text-amber-600")
              )}>
                {trend}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
