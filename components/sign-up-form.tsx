'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import GoogleSignIn from './google-sign.in';

const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Invalid email format' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Password confirmation is required' })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = (data: SignUpFormValues) => {
    console.log('Form submitted:', data);
    reset();
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="text-center mb-8">
        <div className="inline-block p-3 rounded-full bg-orange-50 dark:bg-orange-900/20 mb-4">
          <UserPlus className="h-8 w-8 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold">Create an account</h2>
        <div className="w-16 h-1 bg-orange-500 rounded my-4 mx-auto"></div>
        <p className="text-gray-600 dark:text-gray-300">
          Join us and explore the world with our AI
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <Input
              id="email"
              placeholder="your@email.com"
              className={cn(
                'pl-10 py-6',
                errors.email
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : 'focus-visible:ring-orange-500'
              )}
              {...register('email')}
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              className={cn(
                'pl-10 py-6',
                errors.password
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : 'focus-visible:ring-orange-500'
              )}
              {...register('password')}
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repeat password"
              className={cn(
                'pl-10 py-6',
                errors.confirmPassword
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : 'focus-visible:ring-orange-500'
              )}
              {...register('confirmPassword')}
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300"
        >
          Create an account
        </Button>

        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>

      <div className="relative mt-8 pt-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="mt-6">
        <GoogleSignIn />
      </div>
    </div>
  );
};

export default SignUpForm;
