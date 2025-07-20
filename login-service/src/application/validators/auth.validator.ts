import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .email('Invalid email format')
        .min(1, 'Email is required'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .max(100, 'Password is too long')
});

export const validateTokenSchema = z.object({
    token: z
        .string()
        .min(1, 'Token is required')
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type ValidateTokenRequest = z.infer<typeof validateTokenSchema>;
