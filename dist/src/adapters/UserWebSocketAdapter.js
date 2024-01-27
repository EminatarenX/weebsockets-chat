"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWebSocketAdapter = void 0;
const users_1 = require("../controllers/users");
class UserWebSocketAdapter {
    constructor(io) {
        this.io = io;
    }
    handleEvents() {
        this.io.on('connection', (socket) => {
            socket.on('userConnected', (user) => {
                if (!user.id || !user.name)
                    return;
                const newUser = Object.assign(Object.assign({}, user), { socketId: socket.id });
                (0, users_1.userConnected)(newUser);
                socket.join(newUser.id);
            });
            socket.on('chat', (roomId) => {
                socket.join(roomId);
            });
            socket.on('newChat', (chat) => __awaiter(this, void 0, void 0, function* () {
                const { newChat, toUser } = yield (0, users_1.newChatSocket)(chat);
                socket.to(toUser.id).emit('newChat', newChat);
            }));
            socket.on('message', (message) => {
                const roomId = message.chatId;
                socket.to(roomId).emit('newMessage', message);
            });
            socket.on('disconnect', () => {
                (0, users_1.userDisconnected)(socket.id);
            });
        });
    }
}
exports.UserWebSocketAdapter = UserWebSocketAdapter;
