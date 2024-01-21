"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = __importDefault(require("ws"));
const users_1 = __importDefault(require("./src/routes/users"));
const cors_1 = require("./src/config/cors");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors_1.cors);
app.use('/users', users_1.default);
const server = app.listen(4000, () => {
    console.log(`Server started on port 4000 :)`);
});
const wss = new ws_1.default.Server({ server });
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log('Received: %s', message);
    });
    ws.send('Hi there, I am a WebSocket server');
});
