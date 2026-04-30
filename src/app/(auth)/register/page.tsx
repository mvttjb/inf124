"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration
    router.push("/dashboard");
  };

  return (
    <div className="auth-card wide">
      <div className="auth-header">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">
          Get started with your university credentials.
        </p>
      </div>

      <form onSubmit={handleRegister}>
        <div className="auth-row">
          <div className="auth-form-group">
            <label htmlFor="firstName" className="auth-label">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="auth-input"
              placeholder="John"
              required
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="lastName" className="auth-label">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className="auth-input"
              placeholder="Doe"
              required
            />
          </div>
        </div>

        <div className="auth-form-group">
          <label htmlFor="email" className="auth-label">
            University Email
          </label>
          <input
            type="email"
            id="email"
            className="auth-input"
            placeholder="j.doe@university.edu"
            required
          />
        </div>

        <div className="auth-form-group">
          <label htmlFor="university" className="auth-label">
            University Name
          </label>
          <select id="university" className="auth-input" required defaultValue="">
            <option value="" disabled hidden>
              Select your institution
            </option>
            <option value="uc-irvine">UC Irvine</option>
            <option value="ucla">UCLA</option>
            <option value="uc-berkeley">UC Berkeley</option>
          </select>
        </div>

        <div className="auth-row">
          <div className="auth-form-group">
            <label htmlFor="major" className="auth-label">
              Major
            </label>
            <input
              type="text"
              id="major"
              className="auth-input"
              placeholder="Computer Science"
              required
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="year" className="auth-label">
              Year of Study
            </label>
            <select id="year" className="auth-input" required defaultValue="">
              <option value="" disabled hidden>
                Year
              </option>
              <option value="1">Freshman</option>
              <option value="2">Sophomore</option>
              <option value="3">Junior</option>
              <option value="4">Senior</option>
              <option value="5">Graduate</option>
            </select>
          </div>
        </div>

        <div className="auth-row">
          <div className="auth-form-group">
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="auth-input"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="confirmPassword" className="auth-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="auth-input"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div className="auth-checkbox-wrapper">
          <input type="checkbox" id="terms" className="auth-checkbox" required />
          <label htmlFor="terms">
            I agree to the{" "}
            <Link href="#" className="auth-checkbox-link">Terms of Service</Link> and{" "}
            <Link href="#" className="auth-checkbox-link">Privacy Policy</Link>
          </label>
        </div>

        <button type="submit" className="auth-submit-btn">
          Create Account
        </button>
      </form>

      <div className="auth-divider">Or continue with</div>

      <button type="button" className="auth-social-btn">
        <svg className="auth-social-icon" viewBox="0 0 24 24">
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
      </button>

      <div className="auth-footer">
        Already have an account?{" "}
        <Link href="/login" className="auth-link">
          Login
        </Link>
      </div>
    </div>
  );
}
