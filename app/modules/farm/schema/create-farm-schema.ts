import { z } from 'zod/v4';

export const createFarmSchema = z.object({
  name: z.string()
});