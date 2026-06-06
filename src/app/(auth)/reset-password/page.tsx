"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthContext";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(email, newPassword);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
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
              Enter your university email address and your new password to reset it.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 text-sm font-semibold text-red-600 bg-red-50 p-2.5 rounded border border-red-200 text-center">
                {error}
              </div>
            )}
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

              <div className="space-y-1.5">
                <label htmlFor="newPassword" className="text-sm font-medium leading-none">
                  New Password
                </label>
                <Input
                  type="password"
                  id="newPassword"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <Button type="submit" className="w-full h-11 mt-4" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
        </>
      ) : (
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4 p-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight">Password Reset Success</h2>
              <p className="text-slate-500 text-sm">
                Your password has been successfully updated. You can now use your new password to log in.
              </p>
            </div>
            <Link href="/login" className="w-full">
              <Button className="w-full mt-4 bg-slate-900 text-white hover:bg-slate-700">
                Log In
              </Button>
            </Link>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
