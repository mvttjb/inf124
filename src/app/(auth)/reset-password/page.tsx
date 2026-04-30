"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending reset link
    setIsSubmitted(true);
  };

  return (
    <div className="auth-card">
      {!isSubmitted ? (
        <>
          <Link href="/login" className="auth-back-link">
            <ArrowLeft size={16} />
            Back to Login
          </Link>
          <div className="auth-header">
            <h1 className="auth-title">Reset your password</h1>
            <p className="auth-subtitle">
              Enter your university email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label htmlFor="email" className="auth-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="auth-input"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ marginTop: "0.5rem" }}
              />
            </div>

            <button type="submit" className="auth-submit-btn">
              Send Reset Link
            </button>
          </form>
        </>
      ) : (
        <div className="auth-success-box">
          <CheckCircle className="auth-success-icon" />
          <div>
            <h2 className="auth-success-title">Check your inbox</h2>
            <p className="auth-success-text">
              If an account exists for that email, you will receive a reset link shortly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
