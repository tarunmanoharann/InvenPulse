'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import MiniFooter from '@/components/MiniFooter';
import { useTheme } from '@/contexts/ThemeContext';

export default function LoginPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Implement actual login logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark:bg-gray-950' : 'bg-background'}`}>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className={`${isDarkMode ? 'dark:bg-gray-900 dark:border-gray-800' : 'border border-border'}`}>
            <CardHeader>
              <CardTitle className={`text-2xl font-bold text-center ${isDarkMode ? 'dark:text-gray-100' : ''}`}>
                Welcome Back
              </CardTitle>
              <CardDescription className={`text-center ${isDarkMode ? 'dark:text-gray-400' : ''}`}>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className={`text-sm font-medium ${isDarkMode ? 'dark:text-gray-300' : ''}`}>
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                    className={isDarkMode ? 'dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className={`text-sm font-medium ${isDarkMode ? 'dark:text-gray-300' : ''}`}>
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                    className={isDarkMode ? 'dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200' : ''}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className={`w-full ${isDarkMode ? 'dark:hover:bg-primary/90' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
                <p className={`text-sm text-center ${isDarkMode ? 'dark:text-gray-400' : 'text-muted-foreground'}`}>
                  Don't have an account?{' '}
                  <Link href="/register" className={`text-primary hover:underline ${isDarkMode ? 'dark:text-primary/90' : ''}`}>
                    Register here
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      <div className="mt-auto">
        <MiniFooter />
      </div>
    </div>
  );
}