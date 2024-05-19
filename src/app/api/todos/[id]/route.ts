import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { HttpStatus } from '@/shared/enums'
import { prisma } from '@/shared/prisma-client'
import { updateTodoZodSchema, UpdateTodoDto } from './dto'

type GetParams = {
    params: {
        id: string
    }
}

export const GET = async (req: NextRequest, { params }: GetParams) => {
    const id: number = parseInt(params.id) || 0
    if (!id) {
        return NextResponse.json({ message: 'ID is required.' }, { status: HttpStatus.BAD_REQUEST })
    }
    const todo = await prisma.todo.findUnique({
        where: {
            id
        }
    })
    if (!todo) {
        return NextResponse.json({ message: 'Todo not found.' }, { status: HttpStatus.NOT_FOUND })
    }
    return NextResponse.json(todo, { status: HttpStatus.OK })
}

export const PATCH = async (req: NextRequest, { params }: GetParams) => {
    const id: number = parseInt(params.id) || 0
    if (!id) {
        return NextResponse.json({ message: 'ID is required.' }, { status: HttpStatus.BAD_REQUEST })
    }
    const todo = await prisma.todo.findUnique({
        where: {
            id
        },
        select: {
            id: true
        }
    })
    if (!todo) {
        return NextResponse.json({ message: 'Todo not found.' }, { status: HttpStatus.NOT_FOUND })
    }

    let body = {} as UpdateTodoDto
    try {
        body = await req.json()
    } catch (e) {
        return NextResponse.json({ message: 'Invalid JSON body.' }, { status: HttpStatus.BAD_REQUEST })
    }
    const { data, error } = updateTodoZodSchema.safeParse(body)
    if (error) {
        const message = error.issues.reduce((acc, cur) => {
            acc += `${cur.message}. `
            return acc
        }, '').trim()
        return NextResponse.json({ message }, { status: HttpStatus.BAD_REQUEST })
    }

    const { title, description, dueDate } = data
    const updateTodoInput: Prisma.TodoUpdateInput = {}
    if (title) {
        updateTodoInput.title = title
    }
    if (description) {
        updateTodoInput.description = description
    }
    if (dueDate) {
        updateTodoInput.dueDate = new Date(dueDate)
    }
    const updatedTodo = await prisma.todo.update({
        where: {
            id
        },
        data: updateTodoInput
    })
    return NextResponse.json(updatedTodo, { status: HttpStatus.OK })
}

export const DELETE = async (req: NextRequest, { params }: GetParams) => {
    const id: number = parseInt(params.id) || 0
    if (!id) {
        return NextResponse.json({ message: 'ID is required.' }, { status: HttpStatus.BAD_REQUEST })
    }
    const todo = await prisma.todo.findUnique({
        where: {
            id
        },
        select: {
            id: true
        }
    })
    if (!todo) {
        return NextResponse.json({ message: 'Todo not found.' }, { status: HttpStatus.NOT_FOUND })
    }

    const deletedTodo = await prisma.todo.delete({
        where: {
            id
        }
    })
    return NextResponse.json(deletedTodo, { status: HttpStatus.OK })
}
