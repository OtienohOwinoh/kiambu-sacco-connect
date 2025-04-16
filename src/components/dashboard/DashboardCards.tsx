
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, PiggyBank, CreditCard, Landmark, BarChart3 } from "lucide-react";
import { formatCurrency } from "@/lib/mockData";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  change?: {
    value: number;
    trend: "up" | "down" | "neutral";
  };
}

export function StatsCard({ title, value, description, icon, change }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {change && (
          <div className="flex items-center mt-1">
            {change.trend === "up" ? (
              <ArrowUpIcon className="h-4 w-4 text-emerald-500 mr-1" />
            ) : change.trend === "down" ? (
              <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
            ) : null}
            <span
              className={`text-xs ${
                change.trend === "up"
                  ? "text-emerald-500"
                  : change.trend === "down"
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {change.trend === "up" ? "+" : change.trend === "down" ? "-" : ""}
              {Math.abs(change.value)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardCardsProps {
  totalDeposits: number;
  totalLoans: number;
  outstandingLoans: number;
  dividends: number;
}

export function DashboardCards({
  totalDeposits,
  totalLoans,
  outstandingLoans,
  dividends
}: DashboardCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Deposits"
        value={formatCurrency(totalDeposits)}
        description="Total contributions to SACCO"
        icon={<PiggyBank className="h-4 w-4 text-muted-foreground" />}
        change={{ value: 16.2, trend: "up" }}
      />
      <StatsCard
        title="Total Loan Amount"
        value={formatCurrency(totalLoans)}
        description="All loans to date"
        icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        change={{ value: 8.4, trend: "up" }}
      />
      <StatsCard
        title="Outstanding Loans"
        value={formatCurrency(outstandingLoans)}
        description="Current active loans"
        icon={<Landmark className="h-4 w-4 text-muted-foreground" />}
        change={{ value: 12.5, trend: "down" }}
      />
      <StatsCard
        title="Dividends"
        value={formatCurrency(dividends)}
        description="Earned this year"
        icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        change={{ value: 3.2, trend: "up" }}
      />
    </div>
  );
}
