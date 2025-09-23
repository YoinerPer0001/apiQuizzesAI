import type { CreationAttributes } from "sequelize";
import type Categories from "../models/categoriesModel.js";
import categoriesRepository from "../repository/categoriesRepository.js";
import { ApiResponse } from "../core/responseSchedule.js";


class CategoriesService {

    async findById(id: string): Promise<ApiResponse<Categories | null>> {
        try {
            const result = await categoriesRepository.findById(id)
            if (result != null) {
                const response = new ApiResponse(200, "success", result)
                return response
            } else {
                return new ApiResponse(500, "Error to find", null)
            }
        } catch (error) {
            return new ApiResponse(500, (error as Error).message, null)
        }
    }

    async getAll(): Promise<ApiResponse<Categories[] | null>> {
        try {
            const result = await categoriesRepository.getAll()
            if (!result) {
                return new ApiResponse(500, "Error to getAll", null)
            }
            return new ApiResponse(200, "success", result)
        } catch (error) {
            return new ApiResponse(500, (error as Error).message, null)
        }
    }

    async create(category: CreationAttributes<Categories>): Promise<ApiResponse<Categories | null>> {
        try {
            
            const exist = await categoriesRepository.findByName(category.text.toLowerCase())
            if (!exist) {
                const result = await categoriesRepository.create(category)
                if (result) {
                    return new ApiResponse(201, "success", null)
                } else {
                    return new ApiResponse(500, "Error to create", null)
                }
            } else {
                return new ApiResponse(409, "Category is already registered", null)
            }

        } catch (error) {
            return new ApiResponse(500, (error as Error).message, null)
        }
    }

    async update(id: string, data: Partial<CreationAttributes<Categories>>): Promise<ApiResponse<number | null>> {
        try {
            const exist = await categoriesRepository.findById(id)
            if (!exist) {
                return new ApiResponse(404, "not found", null)
            }
            const result = await categoriesRepository.update(id, data)

            if (!result) {
                return new ApiResponse(502, "Error to update", null)
            }

            return new ApiResponse(201, "success", result)

        } catch (error) {
            return new ApiResponse(500, (error as Error).message, null)
        }
    }

    async deleteCat(id: string): Promise<ApiResponse<number | null>> {
        try {
            const exist = await categoriesRepository.findById(id)
            if (!exist) {
                return new ApiResponse(404, "not found", null)
            }
            const result = await categoriesRepository.deleteCat(id)
            if (!result) {
                return new ApiResponse(502, "Error to update", null)
            }

            return new ApiResponse(201, "success", result)

        } catch (error) {
            return new ApiResponse(500, (error as Error).message, null)
        }
    }
}

export default new CategoriesService;