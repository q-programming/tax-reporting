import { Router, type IRouter } from "express";

const router: IRouter = Router();

const CATEGORIES = [
  "Office Supplies",
  "Software Subscriptions",
  "Client Retainer",
  "Travel",
  "Meals",
  "Professional Services",
  "Consulting Income",
  "Marketing",
  "Hardware",
  "Internet & Phone",
];

function generateMonthlyData() {
  const months = [
    "Apr 2025", "May 2025", "Jun 2025", "Jul 2025",
    "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025",
    "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026",
  ];
  return months.map((month) => ({
    month,
    income: Math.floor(Math.random() * 8000) + 5000,
    expenses: Math.floor(Math.random() * 3000) + 1000,
  }));
}

function generateTransactions(count: number) {
  const statuses = ["Completed", "Pending", "Processing"] as const;
  const txs = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const isIncome = Math.random() > 0.6;
    const category = isIncome
      ? Math.random() > 0.5
        ? "Consulting Income"
        : "Client Retainer"
      : CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const amount = isIncome
      ? Math.floor(Math.random() * 5000) + 500
      : -(Math.floor(Math.random() * 800) + 20);

    const daysAgo = Math.floor(Math.random() * 365);
    const date = new Date(now - daysAgo * 86400000);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    txs.push({
      id: `tx-${Math.random().toString(36).slice(2, 11)}`,
      date: `${yyyy}-${mm}-${dd}`,
      description: `${category} - ${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      category,
      amount,
      isDeductible: !isIncome && Math.random() > 0.2,
      status: Math.random() > 0.8 ? statuses[Math.floor(Math.random() * 2) + 1] : "Completed",
    });
  }

  return txs.sort((a, b) => b.date.localeCompare(a.date));
}

const mockMonthly = generateMonthlyData();
const mockTransactions = generateTransactions(85);

router.get("/tax/summary", (_req, res) => {
  res.json({
    kpis: {
      totalIncome: 125400,
      totalDeductions: 28650,
      taxableIncome: 96750,
      estimatedTaxOwed: 21285,
    },
    monthlyChart: mockMonthly,
    categoryChart: [
      { name: "Federal", value: 45 },
      { name: "State", value: 20 },
      { name: "Social Security", value: 25 },
      { name: "Medicare", value: 10 },
    ],
  });
});

router.get("/tax/transactions", (_req, res) => {
  res.json(mockTransactions);
});

export default router;
