import { z } from 'zod'

export const updateTodoZodSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional()
})

export type UpdateTodoDto = z.infer<typeof updateTodoZodSchema>
