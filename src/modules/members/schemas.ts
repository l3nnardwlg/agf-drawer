import { z } from 'zod';
import { Role } from '@prisma/client';

export const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(Role).refine((r) => r !== Role.OWNER, {
    message: 'Cannot invite a member directly as OWNER; use transfer ownership',
  }),
});

export const updateMemberRoleSchema = z.object({
  role: z.nativeEnum(Role).refine((r) => r !== Role.OWNER, {
    message: 'Cannot assign OWNER role directly; use transfer ownership',
  }),
});

export const transferOwnershipSchema = z.object({
  newOwnerUserId: z.string().uuid(),
});

export const acceptInvitationSchema = z.object({
  token: z.string().min(10),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
export type TransferOwnershipInput = z.infer<typeof transferOwnershipSchema>;
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
