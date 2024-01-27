"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const users_1 = __importDefault(require("./src/routes/users"));
const UserWebSocketAdapter_1 = require("./src/adapters/UserWebSocketAdapter");
const cors_1 = require("./src/config/cors");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors_1.cors);
app.use('/users', users_1.default);
const server = app.listen(4000, () => {
    console.log(`Server started on port 4000 :)`);
});
const io = new socket_io_1.Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: '*',
    }
});
const userWebsocketAdapter = new UserWebSocketAdapter_1.UserWebSocketAdapter(io);
userWebsocketAdapter.handleEvents();
