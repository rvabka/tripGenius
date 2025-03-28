'use client';

import { SignUp } from '@clerk/nextjs';
import { UserPlus } from 'lucide-react';

const SignUpForm = () => {
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

      <div className="flex justify-center">
        <SignUp
          appearance={{
            elements: {
              card: '!shadow-lg !border !border-gray-100 dark:!border-gray-700',
              headerTitle: 'text-2xl',
              socialButtonsBlockButton:
                'bg-orange-500 hover:bg-orange-600 text-white',
              socialButtonsBlockButtonText: 'text-white',
              formButtonPrimary: 'bg-orange-500 hover:bg-orange-600 text-white'
            }
          }}
        />
      </div>
    </div>
  );
};

export default SignUpForm;
