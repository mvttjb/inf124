"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration
    router.push("/dashboard");
  };

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-bold tracking-tight">Create Account</CardTitle>
        <CardDescription className="text-slate-500 text-sm">
          Get started with your university credentials.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="text-sm font-medium leading-none">
                First Name
              </label>
              <Input type="text" id="firstName" placeholder="John" required />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="lastName" className="text-sm font-medium leading-none">
                Last Name
              </label>
              <Input type="text" id="lastName" placeholder="Doe" required />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              University Email
            </label>
            <Input type="email" id="email" placeholder="j.doe@university.edu" required />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="university" className="text-sm font-medium leading-none">
              University Name
            </label>
            <select 
              id="university" 
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required 
              defaultValue=""
            >
              <option value="" disabled hidden>Select your institution</option>
              <option value="uc-irvine">UC Irvine</option>
              <option value="ucla">UCLA</option>
              <option value="uc-berkeley">UC Berkeley</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="major" className="text-sm font-medium leading-none">
                Major
              </label>
              <Input type="text" id="major" placeholder="Computer Science" required />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="year" className="text-sm font-medium leading-none">
                Year of Study
              </label>
              <select 
                id="year" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required 
                defaultValue=""
              >
                <option value="" disabled hidden>Year</option>
                <option value="1">Freshman</option>
                <option value="2">Sophomore</option>
                <option value="3">Junior</option>
                <option value="4">Senior</option>
                <option value="5">Graduate</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                Password
              </label>
              <Input type="password" id="password" placeholder="••••••••" required />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
                Confirm Password
              </label>
              <Input type="password" id="confirmPassword" placeholder="••••••••" required />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input 
              type="checkbox" 
              id="terms" 
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" 
              required 
            />
            <label htmlFor="terms" className="text-sm text-slate-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I agree to the{" "}
              <Link href="#" className="font-semibold text-slate-900 hover:underline">Terms of Service</Link> and{" "}
              <Link href="#" className="font-semibold text-slate-900 hover:underline">Privacy Policy</Link>
            </label>
          </div>

          <Button type="submit" className="w-full mt-4 h-11">
            Create Account
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">Or continue with</span>
          </div>
        </div>

        <Button variant="outline" type="button" className="w-full h-11 font-medium bg-white">
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
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
          </svg>
          Google SSO
        </Button>
      </CardContent>

      <CardFooter className="flex justify-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-slate-900 ml-1 hover:underline">
          Login
        </Link>
      </CardFooter>
    </Card>
  );
}
