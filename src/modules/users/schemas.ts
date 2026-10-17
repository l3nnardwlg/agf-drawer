import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().max(1000).optional().nullable(),
});

export const updatePreferencesSchema = z.object({
  preferredLanguage: z.string().min(2).max(10).optional(),
  preferredTheme: z.enum(['light', 'dark', 'system']).optional(),
  timezone: z.string().min(1).max(50).optional(),
});

export const deactivateAccountSchema = z.object({
  password: z.string().min(1),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
export type DeactivateAccountInput = z.infer<typeof deactivateAccountSchema>;
