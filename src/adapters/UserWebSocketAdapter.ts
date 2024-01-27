import { Server, Socket } from 'socket.io'
import { userConnected, userDisconnected, newChatSocket } from '../controllers/users';


export type User = {
    id: string;
    name: string;
    connected?: boolean;
    socketId?: string;
}

type IMessage = {
    id: string;
    chatId: string;
    userId: string;
    createdAt: string;
    text: string;
    user: User;
}


export class UserWebSocketAdapter{
    constructor(private readonly io: Server){}

    handleEvents(){
        this.io.on('connection', (socket: Socket) => {
            
            socket.on('userConnected', (user: User) => {
                if(!user.id || !user.name) return
                const newUser: User = {
                    ...user,
                    socketId: socket.id
                }
                userConnected(newUser)
                socket.join(newUser.id)
            })

            socket.on('chat', (roomId: string) => {
                socket.join(roomId)
            })

            socket.on('newChat', async (chat: any) => {
                const {newChat, toUser}: any = await newChatSocket(chat)
                socket.to(toUser.id).emit('newChat', newChat)
            })

            socket.on('message', (message: IMessage) => {
                const roomId = message.chatId
                socket.to(roomId).emit('newMessage', message)
            })

            socket.on('disconnect', () => {
                userDisconnected(socket.id)
            })
        })

    }
}