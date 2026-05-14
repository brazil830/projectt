'use client';

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import AppLogo from '@/components/ui/AppLogo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthShell() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 lg:p-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <AppLogo size={32} />
          <span className="text-lg font-semibold text-foreground">ClinicalCopilot</span>
        </div>

        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Login or Signup Form */}
        {isLogin ? (
          <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <SignUpForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}
