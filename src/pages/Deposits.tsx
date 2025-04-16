
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Transaction,
  mockApi,
  formatCurrency,
  formatDate,
} from "@/lib/mockData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CheckCircle2, 
  PiggyBank, 
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const Deposits = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const userTransactions = await mockApi.getUserTransactions(user.id);
          // Filter only deposit and dividend transactions
          const filteredTransactions = userTransactions.filter(
            (t) => t.type === "deposit" || t.type === "dividend"
          );
          setTransactions(filteredTransactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  // Calculate metrics
  const totalDeposits = transactions
    .filter((t) => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDividends = transactions
    .filter((t) => t.type === "dividend")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyAverage =
    transactions.filter((t) => t.type === "deposit").length > 0
      ? totalDeposits /
        (transactions.filter((t) => t.type === "deposit").length / 12)
      : 0;

  if (isLoading) {
    return <DepositsPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Deposits & Contributions
        </h2>
        <p className="text-muted-foreground">
          View your deposit history and dividends
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Contributions</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              {formatCurrency(totalDeposits)}
              <PiggyBank className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Dividends</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              {formatCurrency(totalDividends)}
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Average</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(monthlyAverage)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contribution History</CardTitle>
          <CardDescription>
            All your deposits and dividend payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {transaction.reference}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            transaction.type === "deposit"
                              ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                              : "bg-green-50 text-green-700 hover:bg-green-50"
                          }
                        >
                          {transaction.type === "deposit" ? "Deposit" : "Dividend"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {transaction.status === "completed" ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Completed
                          </Badge>
                        ) : transaction.status === "pending" ? (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 hover:bg-yellow-50">
                            Pending
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Failed</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="font-medium">No Deposits Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mt-1">
                You haven't made any deposits or received any dividends yet.
                Contact the SACCO office to make your first contribution.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const DepositsPageSkeleton = () => {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>

      <Skeleton className="h-96 w-full" />
    </div>
  );
};

export default Deposits;
