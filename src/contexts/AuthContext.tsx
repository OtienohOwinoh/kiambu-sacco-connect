
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, mockAuth } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        // Check if there's a token in localStorage
        const token = localStorage.getItem("saccoToken");
        
        if (token) {
          // Verify token with backend
          const user = await mockAuth.verifyToken();
          
          if (user) {
            setUser(user);
          } else {
            // Invalid token, clear localStorage
            localStorage.removeItem("saccoToken");
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("saccoToken");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await mockAuth.login(email, password);
      
      if (response) {
        // Save token to localStorage
        localStorage.setItem("saccoToken", response.token);
        
        // Set user in state
        setUser(response.user);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.user.name}!`,
        });
        
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password.",
        });
        
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function
  const register = async (userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await mockAuth.register(userData);
      
      if (response) {
        // Save token to localStorage
        localStorage.setItem("saccoToken", response.token);
        
        // Set user in state
        setUser(response.user);
        
        toast({
          title: "Registration Successful",
          description: `Welcome to Universal Unit SACCO, ${response.user.name}!`,
        });
        
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "This email is already registered or there was an error with your submission.",
        });
        
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: "An error occurred during registration. Please try again.",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem("saccoToken");
    setUser(null);
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };
  
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
