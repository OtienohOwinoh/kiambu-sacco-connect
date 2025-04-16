
import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarNav } from "./SidebarNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingLayout />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <SidebarNav />
        <main className="flex-1 overflow-y-auto">
          <div className="flex h-16 items-center gap-4 border-b bg-white px-6">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Universal Unit SACCO</h1>
          </div>
          <div className="container py-6 max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

function LoadingLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex h-16 items-center gap-4 border-b bg-white px-6">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="flex flex-1">
        <div className="hidden lg:block w-64 border-r bg-white">
          <div className="py-6 px-6">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="px-4 space-y-3 py-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        </div>
        <main className="flex-1 p-6 space-y-6">
          <Skeleton className="h-9 w-56" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    </div>
  );
}
