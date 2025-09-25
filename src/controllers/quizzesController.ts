import type { Request, Response } from "express";
import { ApiResponse } from "../core/responseSchedule.js";
import quizzesService from "../services/quizzesService.js";


class QuizzesController {

    async create(req: Request, res: Response) {
        try {

            const uid = (req as any).uid
            const data = req.body
            console.log(uid)

            const result = await quizzesService.create(uid, data)

            res.status(result.code).json(result)

        } catch (error) {
            res.status(500).json(new ApiResponse(500, (error as Error).message, {}))
        }
    }

    async getQuizzesByUser(req: Request, res: Response) {
        try {
            const uid = (req as any).uid
            const result = await quizzesService.getCreatorQuizzes(uid)
            res.status(result.code).json(result)
        } catch (error) {
            res.status(500).json(new ApiResponse(500, (error as Error).message, {}))
        }
    }
}

export default new QuizzesController;