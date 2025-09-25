import type { CreationAttributes } from "sequelize";
import type Quizzes from "../models/quizzesModel.js";
import { ApiResponse } from "../core/responseSchedule.js";
import quizzesRepository from "../repository/quizzesRepository.js";
import categoriesRepository from "../repository/categoriesRepository.js";
import userRepository from "../repository/userRepository.js";
import { db } from "../core/db.js";


class QuizzesService {

    async create(id_user: string, data: CreationAttributes<Quizzes>): Promise<ApiResponse<{ attempts_remaining: number } | null>> {

       const transaction = await db.transaction()
        try {

            const exist = await categoriesRepository.findById(data.category_id)
            if (!exist) {
                return new ApiResponse(404, "category not found", null)
            }

            data.creator_id = id_user

            //verify remaining attemps 
            const user = await userRepository.findById(id_user, { transaction })
            const remainig_attemps = user?.dataValues.attempts_remaining
            

            if (remainig_attemps > 0) {
                const result = await quizzesRepository.create(data, {transaction})

                if (!result) {
                    transaction.rollback()
                    return new ApiResponse(500, "Error to create quiz", null)
                }

                //subtrac remaining attempts

                const updatedUser = await userRepository.update(id_user, { attempts_remaining: remainig_attemps - 1 }, {transaction})

                if (!updatedUser) {
                    transaction.rollback()
                    return new ApiResponse(500, "Error to update attempts", null)
                }

                await transaction.commit()
                return new ApiResponse(201, "success", { attempts_remaining: remainig_attemps - 1 })


            } else {
                transaction.rollback()
                return new ApiResponse(401, "Exceded quota", null)
            }

        } catch (error) {
            transaction.rollback()
            return new ApiResponse(500, (error as Error).message, null)
        }
    }

    async getCreatorQuizzes(id:string): Promise<ApiResponse<Quizzes[] | null>>{
        try {
            const result = await quizzesRepository.findByUser(id)
            if(!result){
                return new ApiResponse(500, "Error to ask", null)
            }
            return new ApiResponse(200, "success", result)
        } catch (error) {
            return new ApiResponse(500, (error as Error).message, null)
        }
    }
}

export default new QuizzesService;