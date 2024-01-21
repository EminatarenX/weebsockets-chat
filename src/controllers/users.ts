import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express'
const prisma = new PrismaClient();

export const login = async ( req: Request, res: Response ) => {
    const { name } = req.body;

    const exist = await prisma.user.findFirst({
        where: {name}
    })

    if(exist) return res.json({user: exist})

    const user = await prisma.user.create({
        data: {name}
    })

    res.json({user})
}

export const sendMessage = async ( req: Request, res: Response ) => {
    const { 
        chatId,
        receiver,
        text
    } = req.body;

    const { user } = req;

    let chat = null;
    if(!chatId) {
        chat = await prisma.chat.create({
            data: {
                users: {
                    connect: [
                        { id: user.id },
                        { id: receiver }
                    ]
                }
            }
        })
    } else {
        chat = await prisma.chat.findUnique({
            where: {
                id: chatId
            }
        })
    }

    const message = await prisma.message.create({
        data: {
            text,
            userId: user.id,
            chatId: chat?.id || chatId
        }
    })

    res.json({message})

}

export const getChats = async ( req: Request, res: Response ) => {
    const { user } = req;

    try {
        const chats = await prisma.chat.findMany({
            where: {
                users: {
                    some: {
                        id: user.id
                    }
                }
            },
            include: {
                users: true,      
                
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        res.json({messages: chats})
        
    } catch (error) {
        console.log(error)
    }
}

export const searchUser = async ( req: Request, res: Response ) => {
    const { name } = req.params as { name: string };

    try {
        const users = await prisma.user.findMany({
            where: {
                name: {
                    contains: name,
                }
            }
        })

        res.json({users})
    } catch (error) {
        console.log(error)
    }
}

export const findOrCreateChat = async ( req: Request, res: Response ) => {
    const { user } = req;
    const { id: friendId } = req.params as { id: string };

    try {
        const chat = await prisma.chat.findFirst({
            where: {
                users: {
                    every: {
                        id: {

                            in: [
                                user.id,
                                friendId
                                ]
                        }
                    }
                }
            },
            include: {
                messages: {
                    include: {
                        user: true
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                },
                users: true
            },
        })

        if(chat) {
            return res.json({chat})
        }else {
            const newChat = await prisma.chat.create({
                data: {
                    users: {
                        connect: [
                            { id: user.id },
                            { id: friendId }
                        ]
                    }
                }
            })
            return res.json({chat: newChat})
        }


        
    } catch (error) {
        console.log(error)
    }
}

export const newMessage = async (req: Request, res: Response) => {
    const { chatId, text } = req.body;
    const { user } = req;

    try {
        const message = await prisma.message.create({
            data: {
                text,
                userId: user.id,
                chatId
            }
        })

        res.json({message})
        
    } catch (error) {
        console.log(error)
    }

}