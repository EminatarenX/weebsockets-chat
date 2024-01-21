import { Router } from "express";
import { login, getChats, sendMessage, searchUser, findOrCreateChat } from "../controllers/users";
import { checkAuth } from "../middlewares/checkAuth";

const userRoutes = Router();

userRoutes.post('/login', login);
userRoutes.post('/send',checkAuth, sendMessage);
userRoutes.get('/chats',checkAuth, getChats);
userRoutes.get('/chat/:id', checkAuth, findOrCreateChat);
userRoutes.get('/search/:name', searchUser)
userRoutes.post('/messages/send', checkAuth, sendMessage)

export default userRoutes;