import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            user?: typeof auth.$Infer.Session.user;
            session?: typeof auth.$Infer.Session.session;
        }
    }
}

export async function requireAuth (req:Request, res:Response, next:NextFunction){
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
    });

    if(!session || !session.user) {
        res.status(401).json({
            error: "Unauthorized"
        });
    }

    req.user = session?.user;
    req.session = session?.session;
    next();
}