import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.headers.authorization?.split(' ')[1];
    if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    req.user = user as any;
    next();
}