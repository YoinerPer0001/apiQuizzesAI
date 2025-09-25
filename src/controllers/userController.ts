import type { Request, Response } from "express";
import { ApiResponse } from "../core/responseSchedule.js";
import usersServices from "../services/usersServices.js";


class UserController {

    async getUserAttemptsInfo(req:Request, res:Response){
        try {
            const uid = (req as any).uid

            const result = await usersServices.getUserAttemptInfo(uid)

            res.status(result.code).json(result)
            
        } catch (error) {
             res.status(500).json(new ApiResponse(500, (error as Error).message, {})) 
        }
    }

    async updateUserInfo(req:Request, res:Response){
        try {
            const uid = (req as any).uid
            const data = req.body

            const result = await usersServices.updateUserAttempt(uid, data)

            res.status(result.code).json(result)
            
        } catch (error) {
             res.status(500).json(new ApiResponse(500, (error as Error).message, {})) 
        }
    }
}

export default new UserController;