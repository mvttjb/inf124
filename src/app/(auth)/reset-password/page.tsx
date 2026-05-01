"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending reset link
    setIsSubmitted(true);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      {!isSubmitted ? (
        <>
          <CardHeader className="space-y-2">
            <Link href="/login" className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 w-fit mb-2 transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to Login
            </Link>
            <CardTitle className="text-3xl font-bold tracking-tight">Reset your password</CardTitle>
            <CardDescription className="text-slate-500 text-sm">
              Enter your university email address and we&apos;ll send you a link to reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium leading-none">
                  Email Address
                </label>
                <Input
                  type="email"
                  id="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full h-11 mt-4">
                Send Reset Link
              </Button>
            </form>
          </CardContent>
        </>
      ) : (
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4 p-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight">Check your inbox</h2>
              <p className="text-slate-500 text-sm">
                If an account exists for that email, you will receive a reset link shortly.
              </p>
            </div>
            <Button variant="outline" className="mt-4" onClick={() => setIsSubmitted(false)}>
              Try another email
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
