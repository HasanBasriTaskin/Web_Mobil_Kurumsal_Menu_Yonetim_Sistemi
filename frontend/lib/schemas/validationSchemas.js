// Example Zod validation schemas
// Used with React Hook Form for form validation

import { z } from 'zod';

// Login form schema
export const loginSchema = z.object({
  email: z.string().email('Geçerli bir email adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

// Register form schema
export const registerSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir email adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

// Menu item schema
export const menuItemSchema = z.object({
  name: z.string().min(1, 'Menü adı gereklidir'),
  description: z.string().optional(),
  price: z.number().positive('Fiyat pozitif olmalıdır'),
  category: z.string().min(1, 'Kategori seçiniz'),
  isActive: z.boolean().default(true),
});
