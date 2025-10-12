import type { Request, Response } from "express";
import user_quiz_attemptService from "../services/user_quiz_attemptService.js";


class userQuizAttemptController {
    // Controller methods would go here

    async getUserQuizAttemptsByUserId(req: Request, res: Response) {

        try {
            const uid = (req as any).uid;
            const quiz_id = (req.query.quiz_id as string) || "";
            console.log("UID from token:", uid);
            console.log("Quiz ID from params:", quiz_id);
            const response = await user_quiz_attemptService.getByQuizIdUserId(quiz_id, uid);
            return res.status(response.code).json(response);
            
        } catch (error) {
            return res.status(500).json({ code: 500, message: (error as Error).message, data: null });
        }

    }
}

export default new userQuizAttemptController();