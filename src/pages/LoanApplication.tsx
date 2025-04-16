
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockApi, User } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Check, Upload, UserCheck, AlertCircle, FileText, CreditCard } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Step 1: Loan details schema
const loanDetailsSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  purpose: z.string().min(3, "Purpose is required"),
  duration: z.string().min(1, "Duration is required"),
  additionalInfo: z.string().optional(),
});

// Step 2: Documents schema
const documentsSchema = z.object({
  idDocument: z.string().min(1, "ID document is required"),
  kraPin: z.string().min(1, "KRA PIN is required"),
  additionalDoc: z.string().optional(),
});

// Step 3: Guarantors schema
const guarantorSchema = z.object({
  userId: z.string().min(1, "Guarantor is required"),
  amount: z.string().min(1, "Amount is required"),
});

const guarantorsSchema = z.object({
  guarantors: z.array(guarantorSchema).min(1, "At least one guarantor is required"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),
});

// Loan application steps
type Step = "details" | "documents" | "guarantors" | "review" | "success";

const LoanApplication = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
  const [selectedGuarantors, setSelectedGuarantors] = useState<{
    userId: string;
    name: string;
    amount: string;
  }[]>([]);
  const [loanData, setLoanData] = useState({
    amount: "",
    purpose: "",
    duration: "",
    additionalInfo: "",
  });
  const [documentData, setDocumentData] = useState({
    idDocument: "",
    kraPin: "",
    additionalDoc: "",
  });

  // Forms
  const detailsForm = useForm<z.infer<typeof loanDetailsSchema>>({
    resolver: zodResolver(loanDetailsSchema),
    defaultValues: {
      amount: "",
      purpose: "",
      duration: "",
      additionalInfo: "",
    },
  });

  const documentsForm = useForm<z.infer<typeof documentsSchema>>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      idDocument: "",
      kraPin: "",
      additionalDoc: "",
    },
  });

  const guarantorsForm = useForm<z.infer<typeof guarantorsSchema>>({
    resolver: zodResolver(guarantorsSchema),
    defaultValues: {
      guarantors: [],
      terms: false,
    },
  });

  // Fetch members for guarantor selection
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const allMembers = await mockApi.getAllMembers();
        setMembers(allMembers);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);

  // Handle loan details submission
  const onDetailsSubmit = (data: z.infer<typeof loanDetailsSchema>) => {
    setLoanData({
      amount: data.amount || "",
      purpose: data.purpose || "",
      duration: data.duration || "",
      additionalInfo: data.additionalInfo || "",
    });
    setCurrentStep("documents");
  };

  // Handle documents submission
  const onDocumentsSubmit = (data: z.infer<typeof documentsSchema>) => {
    setDocumentData({
      idDocument: data.idDocument || "",
      kraPin: data.kraPin || "",
      additionalDoc: data.additionalDoc || "",
    });
    setCurrentStep("guarantors");
  };

  // Handle guarantors submission
  const onGuarantorsSubmit = (data: z.infer<typeof guarantorsSchema>) => {
    setCurrentStep("review");
  };

  // Handle adding guarantor
  const addGuarantor = (userId: string, amount: string) => {
    const member = members.find((m) => m.id === userId);

    if (member) {
      const newGuarantor = {
        userId,
        name: member.name,
        amount,
      };

      setSelectedGuarantors([...selectedGuarantors, newGuarantor]);
      return true;
    }

    return false;
  };

  // Handle removing guarantor
  const removeGuarantor = (userId: string) => {
    setSelectedGuarantors(selectedGuarantors.filter((g) => g.userId !== userId));
  };

  // Submit loan application
  const submitLoanApplication = async () => {
    setIsSubmitting(true);

    try {
      // Prepare loan application data
      const loanApplication = {
        userId: user?.id,
        amount: parseFloat(loanData.amount),
        purpose: loanData.purpose,
        duration: parseInt(loanData.duration),
        additionalInfo: loanData.additionalInfo,
        guarantors: selectedGuarantors.map((g) => ({
          userId: g.userId,
          name: g.name,
          membershipNumber: "UUS" + Math.floor(10000 + Math.random() * 90000).toString(),
          guaranteeAmount: parseFloat(g.amount),
          status: "pending" as "pending" | "approved" | "rejected",
          dateRequested: new Date(),
        })),
        documents: [
          {
            id: "doc1",
            name: "ID Document",
            url: "/documents/id-copy.pdf",
            type: "application/pdf",
            uploadDate: new Date()
          },
          {
            id: "doc2",
            name: "KRA PIN Certificate",
            url: "/documents/kra-cert.pdf",
            type: "application/pdf",
            uploadDate: new Date()
          },
          {
            id: "doc3",
            name: documentData.additionalDoc || "Additional Document",
            url: "/documents/additional-doc.pdf",
            type: "application/pdf",
            uploadDate: new Date()
          }
        ],
      };

      // Submit loan application
      const response = await mockApi.applyForLoan(loanApplication);

      if (response.success) {
        toast({
          title: "Loan Application Submitted",
          description: response.message,
        });
        setCurrentStep("success");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message,
        });
      }
    } catch (error) {
      console.error("Error submitting loan application:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while submitting your loan application.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step based on current step
  const renderStep = () => {
    switch (currentStep) {
      case "details":
        return (
          <Form {...detailsForm}>
            <form onSubmit={detailsForm.handleSubmit(onDetailsSubmit)} className="space-y-4">
              <FormField
                control={detailsForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Amount (KES)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter loan amount"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum loan amount is three times your total deposits
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={detailsForm.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Purpose</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Business Expansion">Business Expansion</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Home Improvement">Home Improvement</SelectItem>
                          <SelectItem value="Medical Expenses">Medical Expenses</SelectItem>
                          <SelectItem value="Agriculture">Agriculture</SelectItem>
                          <SelectItem value="Personal">Personal</SelectItem>
                          <SelectItem value="Emergency">Emergency</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={detailsForm.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Duration (Months)</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                          <SelectItem value="18">18 months</SelectItem>
                          <SelectItem value="24">24 months</SelectItem>
                          <SelectItem value="36">36 months</SelectItem>
                          <SelectItem value="48">48 months</SelectItem>
                          <SelectItem value="60">60 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={detailsForm.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide any additional details about your loan request"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Continue to Documents
              </Button>
            </form>
          </Form>
        );

      case "documents":
        return (
          <Form {...documentsForm}>
            <form onSubmit={documentsForm.handleSubmit(onDocumentsSubmit)} className="space-y-4">
              <FormField
                control={documentsForm.control}
                name="idDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Document (Required)</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="text"
                          value="id-document.pdf"
                          disabled
                          className="flex-1"
                        />
                        <Button type="button" size="sm" className="shrink-0">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a scanned copy of your national ID (PDF or JPG)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={documentsForm.control}
                name="kraPin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KRA PIN Certificate (Required)</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="text"
                          value="kra-pin.pdf"
                          disabled
                          className="flex-1"
                        />
                        <Button type="button" size="sm" className="shrink-0">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={documentsForm.control}
                name="additionalDoc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Supporting Document (Optional)</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="text"
                          placeholder="No file selected"
                          disabled
                          className="flex-1"
                        />
                        <Button type="button" size="sm" className="shrink-0">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload any additional document to support your application
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep("details")}
                >
                  Back
                </Button>
                <Button type="submit">Continue to Guarantors</Button>
              </div>
            </form>
          </Form>
        );

      case "guarantors":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Selected Guarantors</h3>
              {selectedGuarantors.length > 0 ? (
                <div className="space-y-2">
                  {selectedGuarantors.map((guarantor) => (
                    <div
                      key={guarantor.userId}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <UserCheck className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">{guarantor.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Amount: KES {parseInt(guarantor.amount).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGuarantor(guarantor.userId)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-md">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    No guarantors selected. You need to add at least one guarantor to proceed.
                  </p>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add Guarantor</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="guarantor">Select Member</Label>
                  <Select>
                    <SelectTrigger id="guarantor">
                      <SelectValue placeholder="Select a member as guarantor" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.membershipNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">Guarantee Amount (KES)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter guarantee amount"
                  />
                </div>

                <Button className="w-full" onClick={() => addGuarantor("user_2", "150000")}>
                  Add Guarantor
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" className="mt-1" />
                <div>
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Terms and Conditions
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    I confirm that all information provided is accurate. I understand that
                    providing false information may result in my loan application being rejected
                    and may lead to further action.
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep("documents")}
                >
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep("review")}
                  disabled={selectedGuarantors.length === 0}
                >
                  Review Application
                </Button>
              </div>
            </div>
          </div>
        );

      case "review":
        return (
          <div className="space-y-6">
            <div className="border rounded-md p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Loan Details</h3>
                <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">KES {parseInt(loanData.amount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purpose</p>
                    <p className="font-medium">{loanData.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{loanData.duration} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Interest Rate</p>
                    <p className="font-medium">12% per annum</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Documents</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-500" />
                    <p className="text-sm">ID Document</p>
                    <Badge variant="outline" className="ml-auto">Uploaded</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-500" />
                    <p className="text-sm">KRA PIN Certificate</p>
                    <Badge variant="outline" className="ml-auto">Uploaded</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Guarantors</h3>
                <div className="mt-2 space-y-2">
                  {selectedGuarantors.map((guarantor) => (
                    <div
                      key={guarantor.userId}
                      className="flex items-center gap-2"
                    >
                      <UserCheck className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm">{guarantor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          KES {parseInt(guarantor.amount).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-auto">Pending</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-muted rounded-md p-4">
                <h3 className="font-medium flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Important Information
                </h3>
                <p className="text-sm mt-1">
                  By submitting this application, you confirm that all information provided is
                  accurate. Once submitted, your application will be reviewed by the SACCO loan
                  committee, and you will be notified of the decision within 7 working days.
                </p>
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep("guarantors")}
                >
                  Back
                </Button>
                <Button
                  onClick={submitLoanApplication}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Application Submitted</h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Your loan application has been successfully submitted. You can track the status
              of your application in the Loans section.
            </p>
            <div className="border rounded-md p-4 mt-6 text-left w-full">
              <h3 className="font-medium">Application Details</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Reference Number</span>
                  <span className="text-sm font-medium">SACCO-LOAN-23578</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Submission Date</span>
                  <span className="text-sm">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-800 hover:bg-yellow-50">
                    Under Review
                  </Badge>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button
                onClick={() => window.location.href = "/loans"}
                className="gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Go to Loans
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Apply for a Loan</h2>
        <p className="text-muted-foreground">
          Complete the form below to apply for a SACCO loan
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Loan Application</CardTitle>
          <CardDescription>
            Follow the steps below to complete your loan application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-slate-100">
              <ol className="relative z-10 flex justify-between text-sm font-medium">
                <li className="flex items-center gap-2 bg-white p-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      currentStep === "details"
                        ? "bg-primary text-white"
                        : currentStep === "documents" ||
                          currentStep === "guarantors" ||
                          currentStep === "review" ||
                          currentStep === "success"
                        ? "bg-green-100 text-green-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {currentStep === "documents" ||
                    currentStep === "guarantors" ||
                    currentStep === "review" ||
                    currentStep === "success" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      "1"
                    )}
                  </span>
                  <span
                    className={
                      currentStep === "details"
                        ? "text-primary font-medium"
                        : "text-slate-500"
                    }
                  >
                    Details
                  </span>
                </li>

                <li className="flex items-center gap-2 bg-white p-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      currentStep === "documents"
                        ? "bg-primary text-white"
                        : currentStep === "guarantors" ||
                          currentStep === "review" ||
                          currentStep === "success"
                        ? "bg-green-100 text-green-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {currentStep === "guarantors" ||
                    currentStep === "review" ||
                    currentStep === "success" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      "2"
                    )}
                  </span>
                  <span
                    className={
                      currentStep === "documents"
                        ? "text-primary font-medium"
                        : "text-slate-500"
                    }
                  >
                    Documents
                  </span>
                </li>

                <li className="flex items-center gap-2 bg-white p-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      currentStep === "guarantors"
                        ? "bg-primary text-white"
                        : currentStep === "review" || currentStep === "success"
                        ? "bg-green-100 text-green-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {currentStep === "review" || currentStep === "success" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      "3"
                    )}
                  </span>
                  <span
                    className={
                      currentStep === "guarantors"
                        ? "text-primary font-medium"
                        : "text-slate-500"
                    }
                  >
                    Guarantors
                  </span>
                </li>

                <li className="flex items-center gap-2 bg-white p-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      currentStep === "review"
                        ? "bg-primary text-white"
                        : currentStep === "success"
                        ? "bg-green-100 text-green-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {currentStep === "success" ? <Check className="h-4 w-4" /> : "4"}
                  </span>
                  <span
                    className={
                      currentStep === "review"
                        ? "text-primary font-medium"
                        : "text-slate-500"
                    }
                  >
                    Review
                  </span>
                </li>
              </ol>
            </div>
          </div>

          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanApplication;
