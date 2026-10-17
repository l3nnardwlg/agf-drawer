import { z } from 'zod';
import { ConnectorFamily, ConnectorGender } from '@prisma/client';

export const createConnectorSchema = z.object({
  name: z.string().min(1).max(50),
  family: z.nativeEnum(ConnectorFamily),
  gender: z.nativeEnum(ConnectorGender).default(ConnectorGender.NOT_APPLICABLE),
  description: z.string().max(500).optional(),
  aliases: z.array(z.string().min(1).max(50)).default([]),
  protocols: z.array(z.string().min(1).max(50)).default([]),
});

export type CreateConnectorInput = z.infer<typeof createConnectorSchema>;
