'use client'

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Separator } from "@/components/ui/separator";
import { useTheme } from '@/contexts/ThemeContext';
import MiniFooter from "@/components/MiniFooter";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const validateForm = () => {
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all required fields");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    
    if (!agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      // Here you would add your MongoDB integration code
      // Instead of Firebase authentication
      
      // Example placeholder for MongoDB integration
      // const userData = {
      //   firstName,
      //   lastName,
      //   email,
      //   phone,
      //   // password would be hashed on the server
      // };
      
      // Simulate successful registration
      toast.success('Account created successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Navigate to login page
      router.push("/login");
    } catch (error: any) {
      console.error("Registration failed:", error);
      setError("Registration failed. Please try again.");
      
      toast.error('Registration failed.', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      // Here you would add your MongoDB integration with Google auth
      // Instead of Firebase's Google sign-in
      
      toast.success('Account created successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
      
      router.push("/dashboard");
    } catch (error: any) {
      console.error('Google registration failed:', error);
      setError('Google sign-up failed. Please try again.');
      
      toast.error('Google sign-up failed.', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark:bg-gray-900 dark:text-gray-200' : 'bg-background'}`}>
      <div className="flex-grow flex justify-center items-center px-4">
        <div className="w-full max-w-2xl">
          <Card className={`border ${isDarkMode ? 'dark:bg-gray-800 dark:border-gray-700' : 'border-border'}`}>
            <CardHeader className="space-y-1">
              <CardTitle className={`text-2xl text-center ${isDarkMode ? 'dark:text-gray-100' : ''}`}>Create an account</CardTitle>
              <CardDescription className={`text-center ${isDarkMode ? 'dark:text-gray-400' : ''}`}>
                Enter your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name Fields (First and Last Name in one row) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className={isDarkMode ? 'dark:text-gray-300' : ''}>
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                    className={isDarkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className={isDarkMode ? 'dark:text-gray-300' : ''}>
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                    className={isDarkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : ''}
                  />
                </div>
              </div>
              
              {/* Email and Phone in one row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className={isDarkMode ? 'dark:text-gray-300' : ''}>
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className={isDarkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className={isDarkMode ? 'dark:text-gray-300' : ''}>
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                    className={isDarkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : ''}
                  />
                </div>
              </div>
              
              {/* Password fields (kept as is, in one row) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password" className={isDarkMode ? 'dark:text-gray-300' : ''}>
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="******"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    className={isDarkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className={isDarkMode ? 'dark:text-gray-300' : ''}>
                    Confirm Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="******"
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    className={isDarkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : ''}
                  />
                </div>
              </div>
              
              {/* Terms and Conditions Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreeToTerms} 
                  onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                  className={isDarkMode ? 'dark:border-gray-500' : ''}
                />
                <Label 
                  htmlFor="terms" 
                  className={`text-sm ${isDarkMode ? 'dark:text-gray-300' : ''}`}
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              
              {error && <div className="text-destructive text-sm">{error}</div>}

              <Button
                className={`w-full ${!agreeToTerms ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                onClick={handleRegister}
                disabled={loading || !agreeToTerms}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
              
              <div className="flex items-center gap-2 my-2">
                <Separator className={`flex-1 ${isDarkMode ? 'dark:bg-gray-700' : ''}`} />
                <span className={`text-xs ${isDarkMode ? 'dark:text-gray-400' : 'text-muted-foreground'}`}>OR</span>
                <Separator className={`flex-1 ${isDarkMode ? 'dark:bg-gray-700' : ''}`} />
              </div>
              
              <Button
                variant="outline"
                className={`w-full ${isDarkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600' : ''}`}
                onClick={handleGoogleRegister}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Sign up with Google
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className={`text-sm ${isDarkMode ? 'dark:text-gray-300' : ''}`}>
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="mt-auto">
        <MiniFooter />
      </div>
    </div>
  );
}