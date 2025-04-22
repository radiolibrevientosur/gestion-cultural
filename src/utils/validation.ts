import { z } from 'zod';

export const zodContactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().optional(),
  discipline: z.string().optional(),
  role: z.string().optional(),
  isFavorite: z.boolean().optional(),
  image: z.any().optional(),
  notes: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
});