import type { Request, Response } from "express";
import authService from "../services/authService.js";


class AuthController {

    public async login(req : Request, res: Response){
        try {
            const user_id = (req as any).uid
            const response = await authService.login(user_id)

            console.log(response)

            res.status(response.code).json(response)
            
        } catch (error) {
            res.status(500).json({message: error, data: {}});
        }
    }
}

export default new AuthController;