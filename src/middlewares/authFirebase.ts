import type { Request, Response, NextFunction } from "express";
import admin from "../core/firebase.js";

export async function authenticateFirebase(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const idToken = authHeader.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken ?? "");
        (req as any).uid = decodedToken.uid; // lo guardamos en la request
        console.log(decodedToken.uid)
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: "Invalid token" });
    }

}