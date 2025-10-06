import type { Request, Response } from "express";
import { ApiResponse } from "../core/responseSchedule.js";
import quizzesService from "../services/quizzesService.js";


class QuizzesController {

    async create(req: Request, res: Response) {
        try {

            const uid = (req as any).uid
            const data = req.body

            const result = await quizzesService.create(uid, data)

            res.status(result.code).json(result)

        } catch (error) {
            res.status(500).json(new ApiResponse(500, (error as Error).message, {}))
        }
    }

    async getAllQuizzesUser(req: Request, res: Response) {
        try {
            const uid = (req as any).uid
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 20
            const category = (req.query.category as string) || undefined
            const result = await quizzesService.getAllQuizzesUsers(uid, page, limit, category)
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

    async getAllPublics(req: Request, res: Response) {
        try {
            const category = (req.query.category as string) || undefined
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 20

            const result = await quizzesService.getAllPublics(page, limit, category)
            res.status(result.code).json(result)
            
        } catch (error) {
             res.status(500).json(new ApiResponse(500, (error as Error).message, {}))
        }
    }
}

export default new QuizzesController;