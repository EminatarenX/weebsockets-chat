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
exports.searchUser = exports.getChats = exports.sendMessage = exports.login = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const exist = yield prisma.user.findFirst({
        where: { name }
    });
    if (exist)
        return res.json({ user: exist });
    const user = yield prisma.user.create({
        data: { name }
    });
    res.json({ user });
});
exports.login = login;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, receiver, text } = req.body;
    const { user } = req;
    let chat = null;
    if (!chatId) {
        chat = yield prisma.chat.create({
            data: {
                users: {
                    connect: [
                        { id: user.id },
                        { id: receiver }
                    ]
                }
            }
        });
    }
    else {
        chat = yield prisma.chat.findUnique({
            where: {
                id: chatId
            }
        });
    }
    const message = yield prisma.message.create({
        data: {
            text,
            userId: user.id,
            chatId: (chat === null || chat === void 0 ? void 0 : chat.id) || chatId
        }
    });
    res.json(message);
});
exports.sendMessage = sendMessage;
const getChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    try {
        const chats = yield prisma.chat.findMany({
            where: {
                users: {
                    some: {
                        id: user.id
                    }
                }
            },
            include: {
                messages: {
                    include: {
                        user: true
                    }
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json({ messages: chats });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getChats = getChats;
const searchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    try {
        const users = yield prisma.user.findMany({
            where: {
                name: {
                    contains: name,
                }
            }
        });
        res.json({ users });
    }
    catch (error) {
        console.log(error);
    }
});
exports.searchUser = searchUser;
