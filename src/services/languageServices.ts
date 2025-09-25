import type { CreationAttributes } from "sequelize"
import { ApiResponse } from "../core/responseSchedule.js"
import Languages from "../models/languageModel.js"
import LanguagesRepository from "../repository/LanguagesRepository.js"


class LanguagesServices {
    async create(data: CreationAttributes<Languages>): Promise<ApiResponse<null>> {
        try {
        
            const exist = await LanguagesRepository.findByName(data.name)
            if(exist){
                 return new ApiResponse(409, "Language is already registered", null)
            }

            const created = await LanguagesRepository.create(data)

            if(!created){
                return new ApiResponse(500, "Server error", null)
            }

            return new ApiResponse(201, "success", null)


        } catch (error) {
            return new ApiResponse(500, (error as Error).message, null)
        }
    }

    async getById(id: string): Promise<ApiResponse<Languages | null>> {
        try {

            const language = await LanguagesRepository.getById(id)
            if (!language) {
                return new ApiResponse(404, "Not found", null)
            }

            return new ApiResponse(200, "success", language)

        } catch (error) {
            return new ApiResponse(500, (error as Error).message, null)
        }
    }

    async getAll(): Promise<ApiResponse<Languages[] | null>> {
        try {
            const list = await LanguagesRepository.getAll()
            if(!list){
                return new ApiResponse(500, "Server error", null)
            }
            return new ApiResponse(200, "success", list)

        } catch (error) {
            return new ApiResponse(500, (error as Error).message, null)
        }
    }
}

export default new LanguagesServices;