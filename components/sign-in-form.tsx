'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import GoogleSignIn from './google-sign.in';

// Definicja schematu walidacji za pomocą Zod
const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Incorrect email format' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional()
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data: SignInFormValues) => {
    console.log('Form submitted:', data);
    // Tutaj normalnie wysłałbyś dane do API
    // Symulacja opóźnienia logowania
    await new Promise(resolve => setTimeout(resolve, 1000));
    reset();
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="text-center mb-8">
        <div className="inline-block p-3 rounded-full bg-orange-50 dark:bg-orange-900/20 mb-4">
          <LogIn className="h-8 w-8 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold">Hello again</h2>
        <div className="w-16 h-1 bg-orange-500 rounded my-4 mx-auto"></div>
        <p className="text-gray-600 dark:text-gray-300">
          Log in to continue your journey
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
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
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

        <Button
          type="submit"
          className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Logging in...
            </div>
          ) : (
            'Log in'
          )}
        </Button>

        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-300">
            {"Don't have an account yet?"}{' '}
            <Link
              href="/sign-up"
              className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
            >
              Register
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

      <div className="mt-6 ">
        <GoogleSignIn />
      </div>
    </div>
  );
};

export default SignInForm;
