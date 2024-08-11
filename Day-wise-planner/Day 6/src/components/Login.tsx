// Login.tsx
"use client";
import { useUser } from "@/global/useUser";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { IconBrandGoogle } from "@tabler/icons-react";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function Login() {
  return (
    <GoogleOAuthProvider clientId="772509586103-5h4f5vu58sv9cqkon7jbq63m68nsoh5m.apps.googleusercontent.com">
      <Signin />
    </GoogleOAuthProvider>
  );
}

function Signin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const { setUser } = useUser();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/users/email`, { params: { email: formData.email } });
      const user = res.data;
      if (user.password.includes("googleusercontent")) {
        setErrors({ ...errors, email: "Google account found. Please login with Google." });
      } else {
        const loginRes = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/users/login`, formData);
        if (loginRes.status === 200) {
          setUser({
            name: user.firstname,
            email: formData.email,
            picture: "none",
          });
          navigate("/dashboard");
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setErrors({ ...errors, email: "User not found" });
      } else if (axios.isAxiosError(error) && error.response?.status === 401) {
        setErrors({ ...errors, password: "Invalid password" });
      } else {
        console.error(`Error logging in:`, error);
      }
    }
  };

  const fetchUserInfo = async (accessToken: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userInfo = await response.json();
      const emailCheckResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/users/email`, {
        params: { email: userInfo.email },
      });

      const user = emailCheckResponse.data;
      console.log("Loginned user",user)
      if (user.password.includes("googleusercontent")) {
        setUser({
          name: userInfo.name,
          email: user.email,
          picture: userInfo.picture,
        });
        navigate("/dashboard");
      } else {
        setErrors({ ...errors, email: "Account wasn't created using Google. Enter credentials." });
      }
    } catch (error) {
      console.error('Error fetching user info or checking email existence:', error);
      setErrors({ ...errors, email: "An error occurred. Please try again." });
    }
  };

  const onError = () => {
    console.log('Login Failed');
  };

  const handleGoogleLogin = () => {
    handleGoogle();
  };

  const handleGoogle = useGoogleLogin({
    onSuccess: tokenResponse => {
      fetchUserInfo(tokenResponse.access_token);
    },
    onError: onError,
  });

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">Welcome to StockSync</h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Login to view inventory status and analytics.
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="iambatman@gotham.com"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </LabelInputContainer>

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Sign in &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4">
            <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="button"
              onClick={handleGoogleLogin}
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-neutral-700 dark:text-neutral-300 text-sm">Google</span>
              <BottomGradient />
            </button>
          </div>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <p className="text-center text-neutral-600 text-sm max-w-sm dark:text-neutral-300 mb-2">New user?</p>
          <Link to="/auth/register">
            <button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="button"
            >
              Create Account
              <BottomGradient />
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-4 inset-x-0 left-1/2 -bottom-px bg-cyan-500" />
    </>
  );
};

const LabelInputContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};
