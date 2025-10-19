import type { CreationAttributes } from "sequelize";
import { ApiResponse } from "../core/responseSchedule.js";
import type User from "../models/userModel.js";
import userRepository from "../repository/userRepository.js";

class UsersService {
  async getUserAttemptInfo(id: string): Promise<ApiResponse<User | null>> {
    try {
      const user = await userRepository.findById(id);
      if (!user) {
        return new ApiResponse(404, "not found", null);
      }
      const lastReset = new Date(user.dataValues.last_attempt_reset).getTime();
      if (
        parseInt(user.dataValues.attempts_remaining) < 1 &&
        lastReset + 86400000 < Date.now()
      ) {
        console.log("reset attempts");
        
        const updated = await userRepository.update(id, {
          attempts_remaining: 1,
          last_attempt_reset: Date.now(),
        });
        if (!updated) {
          return new ApiResponse(500, "error to update user", null);
        }

        user.dataValues.attempts_remaining = 1;
        
        const {last_attempt_reset, ...userWithOutDate} = user.dataValues; 
        
        return new ApiResponse(200, "success", userWithOutDate);
      } else {
        return new ApiResponse(200, "success", user);
      }
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  async updateUserAttempt(
    id_user: string,
    data: Partial<CreationAttributes<User>>
  ): Promise<ApiResponse<number | null>> {
    try {
      const exist = await userRepository.findById(id_user);
      if (!exist) {
        return new ApiResponse(404, "not found", null);
      }

      data.last_attempt_reset = Date.now();

      const updated = await userRepository.update(id_user, data);

      if (!updated) {
        return new ApiResponse(500, "error to update user", null);
      }

      return new ApiResponse(200, "success", updated);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  async updateUserSuscription(
    id_user: string,
    data: Partial<CreationAttributes<User>>
  ): Promise<ApiResponse<number | null>> {
    try {
      const exist = await userRepository.findById(id_user);
      if (!exist) {
        return new ApiResponse(404, "not found", null);
      }

      const updated = await userRepository.update(id_user, data);

      if (!updated) {
        return new ApiResponse(500, "error to update user", null);
      }

      return new ApiResponse(200, "success", updated);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }
}

export default new UsersService();
