
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { ActiveLoans } from "@/components/dashboard/ActiveLoans";
import { Announcements } from "@/components/dashboard/Announcements";
import { 
  Transaction, 
  Loan, 
  Announcement, 
  mockApi, 
  mockSaccoPerformance,
  mockAnnouncements
} from "@/lib/mockData";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // Fetch user's transactions
          const userTransactions = await mockApi.getUserTransactions(user.id);
          setTransactions(userTransactions);
          
          // Fetch user's loans
          const userLoans = await mockApi.getUserLoans(user.id);
          setLoans(userLoans);
          
          // Fetch SACCO announcements
          const saccoAnnouncements = await mockApi.getAnnouncements();
          setAnnouncements(saccoAnnouncements);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  // Calculate metrics
  const totalDeposits = transactions
    .filter(t => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalLoans = loans.reduce((sum, loan) => sum + loan.amount, 0);
  
  const outstandingLoans = loans
    .filter(loan => loan.status === "active")
    .reduce((sum, loan) => sum + loan.amount, 0);
    
  const dividends = transactions
    .filter(t => t.type === "dividend")
    .reduce((sum, t) => sum + t.amount, 0);
  
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}!
        </p>
      </div>
      
      <DashboardCards 
        totalDeposits={totalDeposits}
        totalLoans={totalLoans}
        outstandingLoans={outstandingLoans}
        dividends={dividends}
      />
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <RecentTransactions transactions={transactions} />
        <ActiveLoans loans={loans} />
      </div>
      
      <Announcements announcements={announcements} />
    </div>
  );
};

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
      
      <Skeleton className="h-64 w-full" />
    </div>
  );
};

export default Dashboard;
