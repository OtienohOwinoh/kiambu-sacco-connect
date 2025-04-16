
// Mock data for Universal Unit SACCO MVP prototype
import { formatDistanceToNow } from "date-fns";

// User roles
export type UserRole = "member" | "admin";

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  membershipNumber: string;
  phoneNumber: string;
  idNumber: string;
  kraPin: string;
  role: UserRole;
  profileImage?: string;
  dateJoined: Date;
  guarantorScore: number; // 0-100 score indicating reliability as a guarantor
}

// Transaction types
export type TransactionType = "deposit" | "withdrawal" | "loan_repayment" | "dividend" | "fee";

// Transaction interface
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  date: Date;
  description: string;
  reference: string;
  status: "pending" | "completed" | "failed";
}

// Loan status
export type LoanStatus = "pending" | "approved" | "active" | "completed" | "rejected" | "defaulted";

// Loan repayment
export interface LoanRepayment {
  id: string;
  loanId: string;
  dueDate: Date;
  amount: number;
  principal: number;
  interest: number;
  isPaid: boolean;
  paidDate?: Date;
  status: "upcoming" | "due" | "overdue" | "paid";
}

// Guarantor
export interface Guarantor {
  userId: string;
  name: string;
  membershipNumber: string;
  guaranteeAmount: number;
  status: "pending" | "approved" | "rejected";
  dateRequested: Date;
  dateResponded?: Date;
}

// Loan interface
export interface Loan {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  interestRate: number;
  duration: number; // in months
  startDate?: Date;
  endDate?: Date;
  status: LoanStatus;
  guarantors: Guarantor[];
  repaymentSchedule: LoanRepayment[];
  documents: {
    id: string;
    name: string;
    url: string;
    type: string;
    uploadDate: Date;
  }[];
  applicationDate: Date;
  approvalDate?: Date;
}

// SACCO Announcement
export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: Date;
  author: string;
  category: "general" | "dividend" | "loan" | "event" | "other";
  isImportant: boolean;
}

// SACCO Performance metrics
export interface SaccoPerformance {
  totalMembers: number;
  totalAssets: number;
  totalLoans: number;
  activeLoanAmount: number;
  totalDeposits: number;
  yearToDateGrowth: number;
  dividendRate: number;
  nextDividendDate: Date;
  quarterlyPerformance: {
    quarter: string;
    growth: number;
    newMembers: number;
    newLoans: number;
  }[];
}

// MockAPI for authentication
export const mockAuth = {
  // Mock login function
  login: (email: string, password: string): Promise<{ token: string; user: User } | null> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Check if user exists
        const user = mockUsers.find((u) => u.email === email);
        
        // In a real app, we would check password hash
        if (user && password.length > 3) {
          resolve({ 
            token: "mock-jwt-token-" + Math.random().toString(36).substring(2), 
            user 
          });
        } else {
          resolve(null);
        }
      }, 800);
    });
  },
  
  // Mock register function
  register: (userData: Partial<User>): Promise<{ token: string; user: User } | null> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Check if email already exists
        const existingUser = mockUsers.find((u) => u.email === userData.email);
        
        if (existingUser) {
          resolve(null);
        } else {
          // Create a new user
          const newUser: User = {
            id: "user_" + Math.random().toString(36).substring(2),
            name: userData.name || "New Member",
            email: userData.email || "",
            membershipNumber: "UUS" + Math.floor(10000 + Math.random() * 90000).toString(),
            phoneNumber: userData.phoneNumber || "",
            idNumber: userData.idNumber || "",
            kraPin: userData.kraPin || "",
            role: "member",
            dateJoined: new Date(),
            guarantorScore: 75, // Default guarantor score
          };
          
          // In a real app, this would be saved to the database
          mockUsers.push(newUser);
          
          resolve({ 
            token: "mock-jwt-token-" + Math.random().toString(36).substring(2), 
            user: newUser 
          });
        }
      }, 1000);
    });
  },
  
  // Mock verify token function
  verifyToken: (): Promise<User | null> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // In a real app, we would verify the JWT token
        // Here we'll just return the first user as a placeholder
        resolve(mockUsers[0]);
      }, 500);
    });
  }
};

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user_1",
    name: "John Kamau",
    email: "john.kamau@example.com",
    membershipNumber: "UUS10001",
    phoneNumber: "+254712345678",
    idNumber: "24356789",
    kraPin: "A012345678Z",
    role: "member",
    profileImage: "/assets/profile-1.jpg",
    dateJoined: new Date(2020, 5, 15),
    guarantorScore: 92,
  },
  {
    id: "user_2",
    name: "Jane Wambui",
    email: "jane.wambui@example.com",
    membershipNumber: "UUS10002",
    phoneNumber: "+254723456789",
    idNumber: "32456789",
    kraPin: "A023456789Y",
    role: "member",
    profileImage: "/assets/profile-2.jpg",
    dateJoined: new Date(2021, 2, 10),
    guarantorScore: 85,
  },
  {
    id: "user_3",
    name: "Peter Odhiambo",
    email: "peter.odhiambo@example.com",
    membershipNumber: "UUS10003",
    phoneNumber: "+254734567890",
    idNumber: "42567890",
    kraPin: "A034567890X",
    role: "member",
    dateJoined: new Date(2020, 8, 22),
    guarantorScore: 78,
  },
  {
    id: "user_4",
    name: "Sarah Njeri",
    email: "sarah.njeri@example.com",
    membershipNumber: "UUS10004",
    phoneNumber: "+254745678901",
    idNumber: "52678901",
    kraPin: "A045678901W",
    role: "admin",
    dateJoined: new Date(2019, 11, 5),
    guarantorScore: 95,
  },
  {
    id: "user_5",
    name: "Daniel Maina",
    email: "daniel.maina@example.com",
    membershipNumber: "UUS10005",
    phoneNumber: "+254756789012",
    idNumber: "62789012",
    kraPin: "A056789012V",
    role: "member",
    dateJoined: new Date(2021, 4, 18),
    guarantorScore: 88,
  }
];

// Mock Transactions for user_1
export const mockTransactions: Transaction[] = [
  {
    id: "txn_1",
    userId: "user_1",
    type: "deposit",
    amount: 15000,
    date: new Date(2023, 0, 15),
    description: "Monthly Contribution",
    reference: "MPESA-ABCDEFG",
    status: "completed",
  },
  {
    id: "txn_2",
    userId: "user_1",
    type: "deposit",
    amount: 15000,
    date: new Date(2023, 1, 15),
    description: "Monthly Contribution",
    reference: "MPESA-HIJKLMN",
    status: "completed",
  },
  {
    id: "txn_3",
    userId: "user_1",
    type: "deposit",
    amount: 15000,
    date: new Date(2023, 2, 15),
    description: "Monthly Contribution",
    reference: "MPESA-OPQRSTU",
    status: "completed",
  },
  {
    id: "txn_4",
    userId: "user_1",
    type: "loan_repayment",
    amount: 22100,
    date: new Date(2023, 0, 30),
    description: "Loan Repayment - Education Loan",
    reference: "MPESA-VWXYZAB",
    status: "completed",
  },
  {
    id: "txn_5",
    userId: "user_1",
    type: "loan_repayment",
    amount: 22100,
    date: new Date(2023, 1, 28),
    description: "Loan Repayment - Education Loan",
    reference: "MPESA-CDEFGHI",
    status: "completed",
  },
  {
    id: "txn_6",
    userId: "user_1",
    type: "loan_repayment",
    amount: 22100,
    date: new Date(2023, 2, 30),
    description: "Loan Repayment - Education Loan",
    reference: "MPESA-JKLMNOP",
    status: "completed",
  },
  {
    id: "txn_7",
    userId: "user_1",
    type: "deposit",
    amount: 15000,
    date: new Date(2023, 3, 15),
    description: "Monthly Contribution",
    reference: "MPESA-QRSTUVW",
    status: "completed",
  },
  {
    id: "txn_8",
    userId: "user_1",
    type: "loan_repayment",
    amount: 22100,
    date: new Date(2023, 3, 30),
    description: "Loan Repayment - Education Loan",
    reference: "MPESA-XYZABCD",
    status: "completed",
  },
  {
    id: "txn_9",
    userId: "user_1",
    type: "dividend",
    amount: 45000,
    date: new Date(2022, 11, 15),
    description: "Annual Dividend Payout",
    reference: "DIV-2022-01234",
    status: "completed",
  },
  {
    id: "txn_10",
    userId: "user_1",
    type: "deposit",
    amount: 15000,
    date: new Date(2023, 4, 15),
    description: "Monthly Contribution",
    reference: "MPESA-EFGHIJK",
    status: "completed",
  },
  {
    id: "txn_11",
    userId: "user_1",
    type: "deposit",
    amount: 15000,
    date: new Date(2023, 5, 15),
    description: "Monthly Contribution",
    reference: "MPESA-LMNOPQR",
    status: "completed",
  },
  {
    id: "txn_12",
    userId: "user_1",
    type: "fee",
    amount: 500,
    date: new Date(2023, 0, 5),
    description: "Annual Membership Fee",
    reference: "FEE-2023-5678",
    status: "completed",
  },
];

// Generate loan repayment schedule
const generateRepaymentSchedule = (
  loanId: string,
  amount: number,
  interestRate: number,
  duration: number,
  startDate: Date
): LoanRepayment[] => {
  const monthlyInterestRate = interestRate / 100 / 12;
  const monthlyPayment = amount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, duration)) / 
                         (Math.pow(1 + monthlyInterestRate, duration) - 1);
  
  const schedule: LoanRepayment[] = [];
  let remainingPrincipal = amount;
  
  for (let i = 0; i < duration; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(startDate.getMonth() + i + 1);
    
    const interestPayment = remainingPrincipal * monthlyInterestRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingPrincipal -= principalPayment;
    
    const isPaid = new Date() > dueDate;
    let status: "upcoming" | "due" | "overdue" | "paid" = "upcoming";
    
    // Determine status
    if (isPaid) {
      status = "paid";
    } else {
      const today = new Date();
      const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      if (daysUntilDue < 0) {
        status = "overdue";
      } else if (daysUntilDue <= 7) {
        status = "due";
      } else {
        status = "upcoming";
      }
    }
    
    schedule.push({
      id: `repayment_${loanId}_${i + 1}`,
      loanId,
      dueDate,
      amount: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      isPaid,
      paidDate: isPaid ? new Date(dueDate.getTime() - Math.random() * 5 * 86400000) : undefined, // Paid 0-5 days before due date
      status,
    });
  }
  
  return schedule;
};

// Create dates for different loans
const completedLoanStartDate = new Date(2022, 0, 15);
const completedLoanEndDate = new Date(2022, 6, 15);

const activeLoanStartDate = new Date(2023, 0, 10);
const activeLoanEndDate = new Date(2023, 12, 10);

// Mock Loans
export const mockLoans: Loan[] = [
  // Active loan
  {
    id: "loan_1",
    userId: "user_1",
    amount: 500000,
    purpose: "Business Expansion",
    interestRate: 12, // 12% per annum
    duration: 12, // 12 months
    startDate: activeLoanStartDate,
    endDate: activeLoanEndDate,
    status: "active",
    guarantors: [
      {
        userId: "user_2",
        name: "Jane Wambui",
        membershipNumber: "UUS10002",
        guaranteeAmount: 200000,
        status: "approved",
        dateRequested: new Date(2022, 11, 20),
        dateResponded: new Date(2022, 11, 22),
      },
      {
        userId: "user_3",
        name: "Peter Odhiambo",
        membershipNumber: "UUS10003",
        guaranteeAmount: 150000,
        status: "approved",
        dateRequested: new Date(2022, 11, 20),
        dateResponded: new Date(2022, 11, 23),
      },
      {
        userId: "user_5",
        name: "Daniel Maina",
        membershipNumber: "UUS10005",
        guaranteeAmount: 150000,
        status: "approved",
        dateRequested: new Date(2022, 11, 20),
        dateResponded: new Date(2022, 11, 21),
      },
    ],
    repaymentSchedule: generateRepaymentSchedule("loan_1", 500000, 12, 12, activeLoanStartDate),
    documents: [
      {
        id: "doc_1",
        name: "ID Copy",
        url: "/documents/id-copy.pdf",
        type: "application/pdf",
        uploadDate: new Date(2022, 11, 15),
      },
      {
        id: "doc_2",
        name: "KRA PIN Certificate",
        url: "/documents/kra-cert.pdf",
        type: "application/pdf",
        uploadDate: new Date(2022, 11, 15),
      },
      {
        id: "doc_3",
        name: "Business Plan",
        url: "/documents/business-plan.pdf",
        type: "application/pdf",
        uploadDate: new Date(2022, 11, 15),
      },
    ],
    applicationDate: new Date(2022, 11, 15),
    approvalDate: new Date(2022, 11, 30),
  },
  // Completed loan
  {
    id: "loan_2",
    userId: "user_1",
    amount: 200000,
    purpose: "Education Fees",
    interestRate: 10, // 10% per annum
    duration: 6, // 6 months
    startDate: completedLoanStartDate,
    endDate: completedLoanEndDate,
    status: "completed",
    guarantors: [
      {
        userId: "user_2",
        name: "Jane Wambui",
        membershipNumber: "UUS10002",
        guaranteeAmount: 100000,
        status: "approved",
        dateRequested: new Date(2021, 11, 10),
        dateResponded: new Date(2021, 11, 12),
      },
      {
        userId: "user_5",
        name: "Daniel Maina",
        membershipNumber: "UUS10005",
        guaranteeAmount: 100000,
        status: "approved",
        dateRequested: new Date(2021, 11, 10),
        dateResponded: new Date(2021, 11, 11),
      },
    ],
    repaymentSchedule: generateRepaymentSchedule("loan_2", 200000, 10, 6, completedLoanStartDate)
      .map(repayment => ({ ...repayment, isPaid: true, status: "paid" })),
    documents: [
      {
        id: "doc_4",
        name: "ID Copy",
        url: "/documents/id-copy.pdf",
        type: "application/pdf",
        uploadDate: new Date(2021, 11, 5),
      },
      {
        id: "doc_5",
        name: "KRA PIN Certificate",
        url: "/documents/kra-cert.pdf",
        type: "application/pdf",
        uploadDate: new Date(2021, 11, 5),
      },
      {
        id: "doc_6",
        name: "Admission Letter",
        url: "/documents/admission-letter.pdf",
        type: "application/pdf",
        uploadDate: new Date(2021, 11, 5),
      },
    ],
    applicationDate: new Date(2021, 11, 5),
    approvalDate: new Date(2021, 11, 20),
  },
  // Pending loan
  {
    id: "loan_3",
    userId: "user_1",
    amount: 1000000,
    purpose: "Home Improvement",
    interestRate: 15, // 15% per annum
    duration: 24, // 24 months
    status: "pending",
    guarantors: [
      {
        userId: "user_2",
        name: "Jane Wambui",
        membershipNumber: "UUS10002",
        guaranteeAmount: 350000,
        status: "approved",
        dateRequested: new Date(2023, 5, 5),
        dateResponded: new Date(2023, 5, 7),
      },
      {
        userId: "user_3",
        name: "Peter Odhiambo",
        membershipNumber: "UUS10003",
        guaranteeAmount: 300000,
        status: "pending",
        dateRequested: new Date(2023, 5, 5),
        dateResponded: undefined,
      },
      {
        userId: "user_5",
        name: "Daniel Maina",
        membershipNumber: "UUS10005",
        guaranteeAmount: 350000,
        status: "pending",
        dateRequested: new Date(2023, 5, 5),
        dateResponded: undefined,
      },
    ],
    repaymentSchedule: [],
    documents: [
      {
        id: "doc_7",
        name: "ID Copy",
        url: "/documents/id-copy.pdf",
        type: "application/pdf",
        uploadDate: new Date(2023, 5, 1),
      },
      {
        id: "doc_8",
        name: "KRA PIN Certificate",
        url: "/documents/kra-cert.pdf",
        type: "application/pdf",
        uploadDate: new Date(2023, 5, 1),
      },
      {
        id: "doc_9",
        name: "Property Documents",
        url: "/documents/property-docs.pdf",
        type: "application/pdf",
        uploadDate: new Date(2023, 5, 1),
      },
      {
        id: "doc_10",
        name: "Quotation",
        url: "/documents/quotation.pdf",
        type: "application/pdf",
        uploadDate: new Date(2023, 5, 1),
      },
    ],
    applicationDate: new Date(2023, 5, 1),
  },
];

// Mock Announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: "ann_1",
    title: "Annual General Meeting 2023",
    content: "The 2023 Annual General Meeting will be held on 15th July 2023 at the Kiambu Town Hall starting at 9:00 AM. All members are required to attend.",
    date: new Date(2023, 5, 1),
    author: "Sarah Njeri",
    category: "general",
    isImportant: true,
  },
  {
    id: "ann_2",
    title: "Dividend Payout for 2022/2023 Financial Year",
    content: "We are pleased to announce that the dividend rate for the 2022/2023 financial year is 12%. Payments will be processed to members' accounts by 30th June 2023.",
    date: new Date(2023, 5, 15),
    author: "Sarah Njeri",
    category: "dividend",
    isImportant: true,
  },
  {
    id: "ann_3",
    title: "New Loan Products Available",
    content: "Universal Unit SACCO has introduced two new loan products: Emergency Loan and Education Loan with reduced interest rates. Visit our offices for more details.",
    date: new Date(2023, 4, 10),
    author: "Sarah Njeri",
    category: "loan",
    isImportant: false,
  },
  {
    id: "ann_4",
    title: "Office Closure Notice",
    content: "Our offices will be closed on 1st June 2023 for Madaraka Day celebrations. Normal operations will resume on 2nd June 2023.",
    date: new Date(2023, 4, 25),
    author: "Sarah Njeri",
    category: "general",
    isImportant: false,
  },
  {
    id: "ann_5",
    title: "Guarantor Training Workshop",
    content: "A training workshop for members who wish to be guarantors will be held on 20th June 2023. Register at our office or through our website.",
    date: new Date(2023, 5, 5),
    author: "Sarah Njeri",
    category: "event",
    isImportant: false,
  },
];

// Mock SACCO Performance
export const mockSaccoPerformance: SaccoPerformance = {
  totalMembers: 1250,
  totalAssets: 450000000,
  totalLoans: 320000000,
  activeLoanAmount: 280000000,
  totalDeposits: 380000000,
  yearToDateGrowth: 15.3,
  dividendRate: 12,
  nextDividendDate: new Date(2023, 5, 30),
  quarterlyPerformance: [
    {
      quarter: "Q1 2023",
      growth: 4.2,
      newMembers: 45,
      newLoans: 62000000,
    },
    {
      quarter: "Q2 2023",
      growth: 3.8,
      newMembers: 38,
      newLoans: 58000000,
    },
    {
      quarter: "Q3 2022",
      growth: 3.5,
      newMembers: 42,
      newLoans: 55000000,
    },
    {
      quarter: "Q4 2022",
      growth: 3.9,
      newMembers: 50,
      newLoans: 60000000,
    },
  ],
};

// Mock API for getting data
export const mockApi = {
  // Get user transactions
  getUserTransactions: (userId: string): Promise<Transaction[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactions = mockTransactions.filter(t => t.userId === userId);
        resolve(transactions);
      }, 500);
    });
  },
  
  // Get user loans
  getUserLoans: (userId: string): Promise<Loan[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const loans = mockLoans.filter(l => l.userId === userId);
        resolve(loans);
      }, 500);
    });
  },
  
  // Get loan by ID
  getLoanById: (loanId: string): Promise<Loan | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const loan = mockLoans.find(l => l.id === loanId) || null;
        resolve(loan);
      }, 300);
    });
  },
  
  // Get SACCO announcements
  getAnnouncements: (): Promise<Announcement[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAnnouncements);
      }, 300);
    });
  },
  
  // Get SACCO performance metrics
  getSaccoPerformance: (): Promise<SaccoPerformance> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSaccoPerformance);
      }, 300);
    });
  },
  
  // Apply for a loan
  applyForLoan: (loanData: Partial<Loan>): Promise<{ success: boolean; loanId?: string; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, we would validate the loan application and save it
        const loanId = "loan_" + Math.random().toString(36).substring(2);
        
        resolve({ 
          success: true, 
          loanId, 
          message: "Your loan application has been submitted successfully and is under review." 
        });
      }, 1000);
    });
  },
  
  // Get all members (for guarantor selection)
  getAllMembers: (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter out the current user (user_1)
        const members = mockUsers.filter(u => u.id !== "user_1");
        resolve(members);
      }, 500);
    });
  },
  
  // Request guarantor
  requestGuarantor: (userId: string, loanId: string, amount: number): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: "Guarantor request sent successfully." 
        });
      }, 500);
    });
  },
};

// Helper functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatShortDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};
