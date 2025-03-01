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
import { useUser } from '../components/UserContext';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      if (email === 'admin@gmail.com' && password === '123456') {
        setUser({
          email: 'admin@gmail.com',
          role: 'admin',
        });
        toast.success('Welcome Admin!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate('/admin-dashboard');
      } else if (email === 'user@gmail.com' && password === '123456') {
        setUser({
          email: 'user@gmail.com',
          role: 'user',
        });
        toast.success('Welcome User!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate('/user-dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      console.error('Login failed:', error.message);
      setError('Invalid credentials');
      toast.error('Login failed. Please check your credentials.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-28">
      <Card className="w-2/5 flex">
        <div className="w-1/2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="text-red-500">{error}</div>}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </div>
        <div className="w-1/2 bg-muted p-8 border-l">
          <h2 className="text-xl font-semibold mb-4">Login Options for Demo:</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Admin Login:</h3>
              <p>Email: admin@gmail.com</p>
              <p>Password: 123456</p>
            </div>
            <div>
              <h3 className="font-medium">User Login:</h3>
              <p>Email: user@gmail.com</p>
              <p>Password: 123456</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;