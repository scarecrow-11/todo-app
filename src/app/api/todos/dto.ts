import { z } from 'zod'

export const createTodoZodSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional()
})

export type CreateTodoDto = z.infer<typeof createTodoZodSchema>
