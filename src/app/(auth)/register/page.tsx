"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthContext";

const YEAR_MAP: Record<string, string> = {
  "1": "FRESHMAN",
  "2": "SOPHOMORE",
  "3": "JUNIOR",
  "4": "SENIOR",
  "5": "GRAD"
};

const UNI_MAP: Record<string, string> = {
  "uc-irvine": "UC Irvine",
  "ucla": "UCLA",
  "uc-berkeley": "UC Berkeley"
};

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        firstName,
        lastName,
        email,
        university: UNI_MAP[university] || university,
        major: major || undefined,
        year: YEAR_MAP[year] || undefined,
        password
      };
      await register(payload);
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
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
        {error && (
          <div className="mb-4 text-sm font-semibold text-red-600 bg-red-50 p-2.5 rounded border border-red-200 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="text-sm font-medium leading-none">
                First Name
              </label>
              <Input
                type="text"
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="lastName" className="text-sm font-medium leading-none">
                Last Name
              </label>
              <Input
                type="text"
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              University Email
            </label>
            <Input
              type="email"
              id="email"
              placeholder="j.doe@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="university" className="text-sm font-medium leading-none">
              University Name
            </label>
            <select
              id="university"
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
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
              <Input
                type="text"
                id="major"
                placeholder="Computer Science"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="year" className="text-sm font-medium leading-none">
                Year of Study
              </label>
              <select
                id="year"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
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
              <Input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
                Confirm Password
              </label>
              <Input
                type="password"
                id="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
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

          <Button type="submit" className="w-full mt-4 h-11" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
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
