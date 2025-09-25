import type { CreationAttributes } from "sequelize";
import { ApiResponse } from "../core/responseSchedule.js";
import type User from "../models/userModel.js";
import userRepository from "../repository/userRepository.js";


class UsersService {
    
    async getUserAttemptInfo(id:string): Promise<ApiResponse<User | null>>{
        try {
            const user = await userRepository.findById(id);
            if(!user){
                return new ApiResponse(404, "not found", null);
            }
            return new ApiResponse(200, "success", user);

        } catch (error) {
            return new ApiResponse(500, (error as Error).message, null);
        }
    }

    async updateUserAttempt(id_user:string, data:Partial<CreationAttributes<User>>): Promise<ApiResponse<number | null>>{
        try {
            const exist = await userRepository.findById(id_user)
            if(!exist){
                return new ApiResponse(404, "not found", null);
            }

            data.last_attempt_reset = Date.now()

            const updated = await userRepository.update(id_user, data)

            if(!updated){
                return new ApiResponse(500, "error to update user", null);
            }

            return new ApiResponse(200, "success", updated);

        } catch (error) {
            return new ApiResponse(500, (error as Error).message, null);
        }
    }
}

export default new UsersService();