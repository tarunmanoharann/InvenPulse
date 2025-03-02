import React, { useState } from 'react';
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
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useUser } from '../components/UserContext';
import { toast } from 'react-toastify';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Separator } from "@/components/ui/separator";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setUser } = useUser();
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Demo login for testing
      if (email === 'admin@gmail.com' && password === '123456') {
        setUser({
          email: 'admin@gmail.com',
          role: 'admin',
        });
        toast.success('Welcome Admin!', {
          position: "top-right",
          autoClose: 3000,
        });
        navigate('/admin-dashboard');
        return;
      } else if (email === 'user@gmail.com' && password === '123456') {
        setUser({
          email: 'user@gmail.com',
          role: 'user',
        });
        toast.success('Welcome User!', {
          position: "top-right",
          autoClose: 3000,
        });
        navigate('/user-dashboard');
        return;
      }

      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set user in context
      setUser({
        email: user.email || '',
        role: 'user', // You might want to fetch the role from your database
        uid: user.uid
      });
      
      toast.success('Login successful!', {
        position: "top-right",
        autoClose: 3000,
      });
      
      navigate('/user-dashboard');
    } catch (error: any) {
      console.error('Login failed:', error.message);
      setError(error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' 
        ? 'Invalid email or password' 
        : 'An error occurred during login');
      
      toast.error('Login failed. Please check your credentials.', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Set user in context
      setUser({
        email: user.email || '',
        role: 'user', // You might want to fetch the role from your database
        uid: user.uid,
        // displayName: user.displayName
      });
      
      toast.success(`Welcome ${user.displayName || 'User'}!`, {
        position: "top-right",
        autoClose: 3000,
      });
      
      navigate('/user-dashboard');
    } catch (error: any) {
      console.error('Google login failed:', error);
      setError('Google sign-in failed. Please try again.');
      
      toast.error('Google sign-in failed.', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Login to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="******"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button
            className="w-full"
            onClick={handleEmailLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login with Email"}
          </Button>
          
          <div className="flex items-center gap-2 my-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
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
            Continue with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
        
        {/* Demo Info - Remove in production */}
        <div className="bg-muted p-4 text-xs">
          <h3 className="font-medium mb-2">Demo Credentials:</h3>
          <p>Admin: admin@gmail.com / 123456</p>
          <p>User: user@gmail.com / 123456</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;