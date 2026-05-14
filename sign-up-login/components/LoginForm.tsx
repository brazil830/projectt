'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (!data.email || !data.password) {
      toast.error('Please enter your email and password');
      return;
    }

    setLoading(true);
    // MFA removed per user request
    const success = await login(data.email, data.password);
    
    // Artificial delay for premium feel
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);

    if (success) {
      toast.success('Signed in successfully — welcome back');
      router.push('/dashboard');
    } else {
      toast.error('Authentication failed — please check your credentials');
    }
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Welcome back</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in to your ClinicalCopilot account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@gmail.com"
            className={`input-base w-full ${errors.email ? 'border-danger/50 focus:ring-danger/40' : ''}`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
          {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-foreground">Password</label>
            <button
              type="button"
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              className={`input-base w-full pr-10 ${errors.password ? 'border-danger/50 focus:ring-danger/40' : ''}`}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="rememberMe"
            className="rounded border-border w-4 h-4 accent-primary"
            {...register('rememberMe')}
          />
          <label htmlFor="rememberMe" className="text-sm text-muted-foreground cursor-pointer">
            Stay signed in on this device
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 mt-2"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Authenticating...
            </>
          ) : (
            <>
              <Shield size={15} />
              Sign In Securely
            </>
          )}
        </button>
      </form>

      {/* HIPAA notice */}
      <div className="mt-6 p-3 rounded-lg bg-muted/30 border border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-primary font-medium">HIPAA Notice:</span> This system processes
          Protected Health Information (PHI). All access is logged to an immutable blockchain audit
          ledger.
        </p>
      </div>

      <p className="text-xs text-center text-muted-foreground mt-6">
        New user?{' '}
        <button
          onClick={onSwitchToSignup}
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Sign up
        </button>
      </p>
    </div>
  );
}
