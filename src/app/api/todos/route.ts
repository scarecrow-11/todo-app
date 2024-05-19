import { NextRequest, NextResponse } from 'next/server'
import { TodoStatus } from '@prisma/client'
import { prisma } from '@/shared/prisma-client'
import { CreateTodoDto, createTodoZodSchema } from './dto'
import { HttpStatus } from '@/shared/enums'

export const POST = async (req: NextRequest) => {
    let body = {} as CreateTodoDto
    try {
        body = await req.json()
    } catch (e) {
        return NextResponse.json({ message: 'Invalid JSON body.' }, { status: HttpStatus.BAD_REQUEST })
    }
    const { data, error } = createTodoZodSchema.safeParse(body)
    if (error) {
        const message = error.issues.reduce((acc, cur) => {
            acc += `${cur.message}. `
            return acc
        }, '').trim()
        return NextResponse.json({ message }, { status: HttpStatus.BAD_REQUEST })
    }

    const { title, description, dueDate } = data
    const todo = await prisma.todo.create({
        data: {
            title,
            description,
            dueDate,
            status: TodoStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })
    return NextResponse.json(todo, { status: HttpStatus.CREATED })
}

export const GET = async () => {
    const todos = await prisma.todo.findMany()
    return NextResponse.json(todos, { status: HttpStatus.OK })
}
