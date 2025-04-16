
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  SaccoPerformance, 
  mockApi, 
  formatCurrency, 
  formatShortDate 
} from "@/lib/mockData";
import { ArrowUp, TrendingUp, Users, Coins, FileText, CreditCard, PiggyBank, Percent } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Performance = () => {
  const [performance, setPerformance] = useState<SaccoPerformance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      setIsLoading(true);
      try {
        const data = await mockApi.getSaccoPerformance();
        setPerformance(data);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  if (isLoading || !performance) {
    return <PerformancePageSkeleton />;
  }

  // Transform quarter data for charts
  const quarterlyData = performance.quarterlyPerformance.map((quarter) => ({
    name: quarter.quarter,
    growth: quarter.growth,
    newMembers: quarter.newMembers,
    newLoans: quarter.newLoans / 1000000, // Convert to millions for display
  })).reverse();

  // Asset distribution data for pie chart
  const assetDistribution = [
    { name: "Active Loans", value: performance.activeLoanAmount, color: "#0ea5e9" },
    { name: "Cash & Deposits", value: performance.totalDeposits - performance.activeLoanAmount, color: "#22c55e" },
    { name: "Other Assets", value: performance.totalAssets - performance.totalDeposits, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">SACCO Performance</h2>
        <p className="text-muted-foreground">
          Financial performance and statistics for Universal Unit SACCO
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Members"
          value={performance.totalMembers.toLocaleString()}
          icon={<Users className="h-4 w-4 text-blue-500" />}
          change={{ value: 12.5, trend: "up" }}
        />
        <StatsCard
          title="Total Assets"
          value={formatCurrency(performance.totalAssets)}
          icon={<Coins className="h-4 w-4 text-amber-500" />}
          change={{ value: performance.yearToDateGrowth, trend: "up" }}
        />
        <StatsCard
          title="Dividend Rate"
          value={`${performance.dividendRate}%`}
          icon={<Percent className="h-4 w-4 text-green-500" />}
          footer={`Next payout: ${formatShortDate(performance.nextDividendDate)}`}
        />
        <StatsCard
          title="Active Loans"
          value={formatCurrency(performance.activeLoanAmount)}
          icon={<CreditCard className="h-4 w-4 text-purple-500" />}
          change={{ value: 8.3, trend: "up" }}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quarterly Growth</CardTitle>
            <CardDescription>
              SACCO growth percentage by quarter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={quarterlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="growth"
                    name="Growth (%)"
                    stroke="#0ea5e9"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New Member Acquisition</CardTitle>
            <CardDescription>
              New members joining per quarter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={quarterlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="newMembers"
                    name="New Members"
                    fill="#0ea5e9"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New Loans Issued</CardTitle>
            <CardDescription>
              Value of new loans per quarter (in millions)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={quarterlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="newLoans"
                    name="New Loans (Millions)"
                    fill="#22c55e"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Distribution</CardTitle>
            <CardDescription>
              How SACCO assets are allocated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {assetDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Highlights</CardTitle>
          <CardDescription>
            Key financial indicators and ratios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Loan-to-Deposit Ratio</h3>
              </div>
              <p className="text-2xl font-bold">
                {((performance.activeLoanAmount / performance.totalDeposits) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Percentage of deposits used for loans
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <PiggyBank className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Average Savings per Member</h3>
              </div>
              <p className="text-2xl font-bold">
                {formatCurrency(performance.totalDeposits / performance.totalMembers)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Average member contributions
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Annual Growth Rate</h3>
              </div>
              <p className="text-2xl font-bold">
                {performance.yearToDateGrowth}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Year-to-date asset growth
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Loans per Member</h3>
              </div>
              <p className="text-2xl font-bold">
                {(performance.totalLoans / performance.totalMembers / 1000).toFixed(1)}K
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Average loan amount per member
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Historical Dividend Rate</h3>
              </div>
              <p className="text-2xl font-bold">10.5%</p>
              <p className="text-sm text-muted-foreground mt-1">
                5-year average dividend rate
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Member Growth</h3>
              </div>
              <p className="text-2xl font-bold">+14.2%</p>
              <p className="text-sm text-muted-foreground mt-1">
                Year-over-year member growth
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: {
    value: number;
    trend: "up" | "down" | "neutral";
  };
  footer?: string;
}

function StatsCard({ title, value, icon, change, footer }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center mt-1">
            {change.trend === "up" ? (
              <ArrowUp className="h-4 w-4 text-emerald-500 mr-1" />
            ) : null}
            <span
              className={`text-xs ${
                change.trend === "up"
                  ? "text-emerald-500"
                  : "text-red-500"
              }`}
            >
              {change.trend === "up" ? "+" : "-"}
              {change.value}%
            </span>
          </div>
        )}
        {footer && (
          <p className="text-xs text-muted-foreground mt-1">{footer}</p>
        )}
      </CardContent>
    </Card>
  );
}

const PerformancePageSkeleton = () => {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-56 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full" />
        ))}
      </div>

      <Skeleton className="h-96 w-full" />
    </div>
  );
};

export default Performance;
