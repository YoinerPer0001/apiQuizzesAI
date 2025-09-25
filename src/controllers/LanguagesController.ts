import type { Request, Response } from "express";
import { ApiResponse } from "../core/responseSchedule.js";
import languageServices from "../services/languageServices.js";


class LanguageController{
    async create(req:Request,res:Response){
        try {
            const data = req.body
            const result = await languageServices.create(data)

            res.status(result.code).json(result)
            
        } catch (error) {
            res.status(500).json(new ApiResponse(500, (error as Error).message, {})) 
        }
        
    }

    async getAll(req:Request,res:Response){
        try {
            const result = await languageServices.getAll()
            res.status(result.code).json(result)

        } catch (error) {
             res.status(500).json(new ApiResponse(500, (error as Error).message, {})) 
        }
    }
}

export default new LanguageController();