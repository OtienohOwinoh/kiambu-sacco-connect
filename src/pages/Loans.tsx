
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loan,
  LoanRepayment,
  mockApi,
  formatCurrency,
  formatDate,
  formatShortDate
} from "@/lib/mockData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreditCard,
  CheckCheck,
  AlertCircle,
  Clock,
  HelpCircle,
  UserCheck,
  FileText
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Loans = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const userLoans = await mockApi.getUserLoans(user.id);
          setLoans(userLoans);
        }
      } catch (error) {
        console.error("Error fetching loans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, [user]);

  // Calculate metrics
  const activeLoans = loans.filter((loan) => loan.status === "active");
  const completedLoans = loans.filter((loan) => loan.status === "completed");
  const pendingLoans = loans.filter((loan) => loan.status === "pending");

  const totalActive = activeLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalCompleted = completedLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalPending = pendingLoans.reduce((sum, loan) => sum + loan.amount, 0);

  // Function to get the status badge
  const getLoanStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "defaulted":
        return <Badge variant="destructive">Defaulted</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Calculate progress for a loan
  const calculateProgress = (loan: Loan): number => {
    const totalRepayments = loan.repaymentSchedule.length;
    if (totalRepayments === 0) return 0;
    
    const paidRepayments = loan.repaymentSchedule.filter((repayment) => repayment.isPaid).length;
    return (paidRepayments / totalRepayments) * 100;
  };

  // Get repayment status badge
  const getRepaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>;
      case "upcoming":
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-50">Upcoming</Badge>;
      case "due":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Due</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return <LoansPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Loans</h2>
        <p className="text-muted-foreground">
          Manage and view your loan information
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Loans</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              {formatCurrency(totalActive)}
              <CreditCard className="h-5 w-5 text-green-500" />
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed Loans</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              {formatCurrency(totalCompleted)}
              <CheckCheck className="h-5 w-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Applications</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              {formatCurrency(totalPending)}
              <Clock className="h-5 w-5 text-yellow-500" />
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Loans</CardTitle>
          <CardDescription>Active, completed and pending loans</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Loans</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <LoansList loans={loans} />
            </TabsContent>

            <TabsContent value="active">
              <LoansList loans={activeLoans} />
            </TabsContent>

            <TabsContent value="completed">
              <LoansList loans={completedLoans} />
            </TabsContent>

            <TabsContent value="pending">
              <LoansList loans={pendingLoans} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  // Loans list component
  function LoansList({ loans }: { loans: Loan[] }) {
    if (loans.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="font-medium">No Loans Found</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-1">
            You don't have any loans in this category.
          </p>
        </div>
      );
    }

    return (
      <Accordion type="single" collapsible className="w-full space-y-4">
        {loans.map((loan) => (
          <AccordionItem
            key={loan.id}
            value={loan.id}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left">
                <div>
                  <div className="font-medium">{loan.purpose}</div>
                  <div className="text-sm text-muted-foreground">
                    Applied on {formatShortDate(loan.applicationDate)}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <div className="text-lg font-semibold">
                    {formatCurrency(loan.amount)}
                  </div>
                  {getLoanStatusBadge(loan.status)}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 space-y-6">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Interest Rate</div>
                  <div className="text-lg">{loan.interestRate}%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Duration</div>
                  <div className="text-lg">{loan.duration} months</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Status</div>
                  <div>{getLoanStatusBadge(loan.status)}</div>
                </div>
                {loan.startDate && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Start Date</div>
                    <div>{formatShortDate(loan.startDate)}</div>
                  </div>
                )}
                {loan.endDate && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium">End Date</div>
                    <div>{formatShortDate(loan.endDate)}</div>
                  </div>
                )}
                {loan.approvalDate && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Approval Date</div>
                    <div>{formatShortDate(loan.approvalDate)}</div>
                  </div>
                )}
              </div>

              {loan.status === "active" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Repayment Progress</span>
                    <span className="text-sm">{Math.round(calculateProgress(loan))}%</span>
                  </div>
                  <Progress value={calculateProgress(loan)} className="h-2" />
                </div>
              )}

              <Tabs defaultValue="repayment">
                <TabsList>
                  <TabsTrigger value="repayment" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Repayment Schedule
                  </TabsTrigger>
                  <TabsTrigger value="guarantors" className="flex items-center gap-1">
                    <UserCheck className="h-4 w-4" />
                    Guarantors
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Documents
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="repayment" className="pt-4">
                  {loan.repaymentSchedule && loan.repaymentSchedule.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Principal</TableHead>
                          <TableHead>Interest</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Paid Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loan.repaymentSchedule.map((repayment) => (
                          <TableRow key={repayment.id}>
                            <TableCell className="font-medium">
                              {formatShortDate(repayment.dueDate)}
                            </TableCell>
                            <TableCell>{formatCurrency(repayment.amount)}</TableCell>
                            <TableCell>{formatCurrency(repayment.principal)}</TableCell>
                            <TableCell>{formatCurrency(repayment.interest)}</TableCell>
                            <TableCell>{getRepaymentStatusBadge(repayment.status)}</TableCell>
                            <TableCell>
                              {repayment.paidDate
                                ? formatShortDate(repayment.paidDate)
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex items-center justify-center py-4 text-center">
                      <HelpCircle className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">No repayment schedule available</span>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="guarantors" className="pt-4">
                  {loan.guarantors && loan.guarantors.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Membership No.</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date Requested</TableHead>
                          <TableHead>Date Responded</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loan.guarantors.map((guarantor) => (
                          <TableRow key={guarantor.userId}>
                            <TableCell className="font-medium">
                              {guarantor.name}
                            </TableCell>
                            <TableCell>{guarantor.membershipNumber}</TableCell>
                            <TableCell>{formatCurrency(guarantor.guaranteeAmount)}</TableCell>
                            <TableCell>
                              {guarantor.status === "approved" ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
                              ) : guarantor.status === "pending" ? (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-800 hover:bg-yellow-50">
                                  Pending
                                </Badge>
                              ) : (
                                <Badge variant="destructive">Rejected</Badge>
                              )}
                            </TableCell>
                            <TableCell>{formatShortDate(guarantor.dateRequested)}</TableCell>
                            <TableCell>
                              {guarantor.dateResponded
                                ? formatShortDate(guarantor.dateResponded)
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex items-center justify-center py-4 text-center">
                      <HelpCircle className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">No guarantors available</span>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="documents" className="pt-4">
                  {loan.documents && loan.documents.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Upload Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loan.documents.map((document) => (
                          <TableRow key={document.id}>
                            <TableCell className="font-medium">
                              {document.name}
                            </TableCell>
                            <TableCell>{document.type}</TableCell>
                            <TableCell>{formatShortDate(document.uploadDate)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex items-center justify-center py-4 text-center">
                      <HelpCircle className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">No documents available</span>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }
};

const LoansPageSkeleton = () => {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>

      <Skeleton className="h-[600px] w-full" />
    </div>
  );
};

export default Loans;
