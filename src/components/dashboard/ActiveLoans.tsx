
import React from "react";
import { Loan, LoanRepayment, formatCurrency, formatShortDate } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface ActiveLoansProps {
  loans: Loan[];
}

export function ActiveLoans({ loans }: ActiveLoansProps) {
  // Filter to only get active loans
  const activeLoans = loans.filter((loan) => loan.status === "active");
  
  // Get the next repayment for a loan
  const getNextRepayment = (repayments: LoanRepayment[]): LoanRepayment | undefined => {
    const unpaidRepayments = repayments
      .filter((repayment) => !repayment.isPaid)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    
    return unpaidRepayments[0];
  };
  
  // Calculate progress for a loan
  const calculateProgress = (loan: Loan): number => {
    const totalRepayments = loan.repaymentSchedule.length;
    const paidRepayments = loan.repaymentSchedule.filter((repayment) => repayment.isPaid).length;
    
    return (paidRepayments / totalRepayments) * 100;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Loans</CardTitle>
        <CardDescription>Details of your current loans</CardDescription>
      </CardHeader>
      <CardContent>
        {activeLoans.length > 0 ? (
          <div className="space-y-6">
            {activeLoans.map((loan) => {
              const nextRepayment = getNextRepayment(loan.repaymentSchedule);
              const progress = calculateProgress(loan);
              
              return (
                <div key={loan.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{loan.purpose}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(loan.amount)} at {loan.interestRate}% for {loan.duration} months
                      </p>
                    </div>
                    <Badge
                      className={`capitalize ${
                        loan.status === "active" ? "bg-green-500" : ""
                      }`}
                    >
                      {loan.status}
                    </Badge>
                  </div>
                  
                  <Progress value={progress} className="h-2" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>{Math.round(progress)}% paid</span>
                    <span className="text-muted-foreground">
                      {loan.repaymentSchedule.filter((r) => r.isPaid).length}/{loan.repaymentSchedule.length} payments
                    </span>
                  </div>
                  
                  {nextRepayment && (
                    <div className="bg-muted rounded-md p-3 flex items-start space-x-3">
                      {nextRepayment.status === "overdue" ? (
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      ) : nextRepayment.status === "due" ? (
                        <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                      ) : (
                        <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <p className="font-medium text-sm">
                          {nextRepayment.status === "overdue"
                            ? "Payment Overdue"
                            : nextRepayment.status === "due"
                            ? "Payment Due Soon"
                            : "Next Payment"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(nextRepayment.amount)} due on {formatShortDate(nextRepayment.dueDate)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">You have no active loans.</p>
        )}
      </CardContent>
      {activeLoans.length > 0 && (
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/loans">View All Loans</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
