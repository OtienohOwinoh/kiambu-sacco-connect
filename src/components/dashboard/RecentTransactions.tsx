
import React from "react";
import { Transaction, formatCurrency, formatRelativeTime } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, ArrowUpIcon, Clock } from "lucide-react";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  // Get the 5 most recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center">
                <div className="mr-4">
                  {transaction.type === "deposit" || transaction.type === "dividend" ? (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
                      <ArrowDownIcon className="h-5 w-5 text-emerald-600" />
                    </div>
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                      <ArrowUpIcon className="h-5 w-5 text-red-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{transaction.description}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{formatRelativeTime(transaction.date)}</span>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <p
                    className={`text-sm font-medium ${
                      transaction.type === "deposit" || transaction.type === "dividend"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "deposit" || transaction.type === "dividend" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <Badge
                    variant={transaction.status === "completed" ? "outline" : "secondary"}
                    className="text-xs capitalize"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recent transactions.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
