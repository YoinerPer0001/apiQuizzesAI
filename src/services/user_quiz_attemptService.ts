import type { CreationAttributes } from "sequelize";
import { db } from "../core/db.js";
import { ApiResponse } from "../core/responseSchedule.js";
import type User_Quiz_Attempts from "../models/user_quiz_attempModel.js";
import user_answersRepository from "../repository/user_answersRepository.js";
import user_quiz_attemptRepository from "../repository/user_quiz_attemptRepository.js";
import type User_Answers from "../models/user_answers.js";


interface CreationAttempt {
    user_id: string;
    quiz_id: string;
    score: number;
    answersOptions: Partial<CreationAttributes<User_Answers>>[]
}


class UserQuizAttemptService {

    async getByUserId(user_id:string) : Promise<ApiResponse<User_Quiz_Attempts[] | null>> {
        try {
            const data = await user_quiz_attemptRepository.getByUserId(user_id);
            return new ApiResponse(200, "User quiz attempts retrieved", data);
            
        } catch (error) {
            return new ApiResponse(500, "Internal server error", null);
        }
    }

    async create(data: CreationAttempt) : Promise<ApiResponse<User_Quiz_Attempts | null>> {
        const transaction = await db.transaction();
        try {
           
            const attempt = {
                user_id: data.user_id,
                quiz_id: data.quiz_id,
                score: data.score
            }
            const result = await user_quiz_attemptRepository.create(attempt, {transaction});

            if(!result) {
                await transaction.rollback();
                return new ApiResponse(400, "Failed to create user quiz attempt", null);
            }

            for (const answer of data.answersOptions) {
                answer.attempt_id = result.dataValues.attempt_id;
                const created = await user_answersRepository.create(answer, {transaction})
                if(!created) {
                    await transaction.rollback();
                    return new ApiResponse(400, "Failed to create user answers", null);
                }
        
            }

            await transaction.commit();
            
            return new ApiResponse(201, "User quiz attempt created", result);
            
        } catch (error) {
            return new ApiResponse(500, (error as Error).message, null);
        }
    }

}

export default new UserQuizAttemptService();