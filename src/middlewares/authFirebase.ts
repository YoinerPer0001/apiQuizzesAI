import type { Request, Response, NextFunction } from "express";
import admin from "../core/firebase.js";
import { ApiResponse } from "../core/responseSchedule.js";

export async function authenticateFirebase(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json(new ApiResponse(401, "Unauthorized", {}));
    }

    const idToken = authHeader.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken ?? "");
        (req as any).uid = decodedToken.uid; // lo guardamos en la request
        (req as any).email = decodedToken.email; // lo guardamos en la request
        (req as any).name = decodedToken.name; // lo guardamos en la request
        console.log(decodedToken.uid)
        console.log(decodedToken.email)
        console.log(decodedToken.name)
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json(new ApiResponse(401, "Invalid Token", {}));
    }

}