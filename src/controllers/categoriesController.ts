import type { Request, Response } from "express";
import { ApiResponse } from "../core/responseSchedule.js";
import categoriesService from "../services/categoriesService.js";
import { body } from "express-validator";


class CategoriesController {

    async getAll(req:Request, res:Response){
        try {
            const codeLang = (req.query.lang as string) || undefined
            const result = await categoriesService.getAll(codeLang)
            res.status(result.code).json(result)
        } catch (error) {
           res.status(500).json(new ApiResponse(500, (error as Error).message, {})) 
        }
    }

    async create(req:Request, res:Response){
        try {

            const {text} = req.body

            const category = {
                text:text
            }

            const result = await categoriesService.create(category)

            res.status(result.code).json(result)
            
        } catch (error) {
            res.status(500).json(new ApiResponse(500, (error as Error).message, {})) 
        }
    }

    async update(req:Request, res:Response){
        try {
            const {id} = req.params as {id:string}
            const data = req.body
            const result = await categoriesService.update(id, data)
            res.status(result.code).json(result)
            
        } catch (error) {
            res.status(500).json(new ApiResponse(500, (error as Error).message, {})) 
        }
    }

}

export default new CategoriesController;