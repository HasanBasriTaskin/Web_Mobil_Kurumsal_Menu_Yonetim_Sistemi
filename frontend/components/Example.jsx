// Example component showing installed libraries usage
// This file demonstrates how to use installed packages:
// - React Hook Form for form management
// - Zod for validation
// - Radix UI for UI components
// - Lucide React for icons
// - Framer Motion for animations
// - Sonner for toast notifications

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

// Example validation schema
const loginSchema = z.object({
  email: z.string().email('Geçerli bir email adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

export function ExampleLoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Form data:', data);
    toast.success('Giriş başarılı!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-center">Giriş Yap</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Mail className="w-4 h-4" />
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Lock className="w-4 h-4" />
            Şifre
          </label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
    </motion.div>
  );
}

