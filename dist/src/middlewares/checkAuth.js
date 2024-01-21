"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const checkAuth = (req, res, next) => {
    var _a;
    const userId = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    const user = prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    req.user = user;
    next();
};
exports.checkAuth = checkAuth;
