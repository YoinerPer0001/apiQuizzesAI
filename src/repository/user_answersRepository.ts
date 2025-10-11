import type { CreationAttributes, Transaction } from "sequelize";
import User_Answers from "../models/user_answers.js";


class UserAnswerRepository {
    async findById(id:string) {
        
    }

    async getAll() {

    }

    async create(data:CreationAttributes<User_Answers> , options?:{transaction?:Transaction | null}): Promise<User_Answers> {
        return await User_Answers.create(data, {transaction: options?.transaction ?? null});
    }

    async update() {

    }

    async deleteAnswer() {

    }
}

export default new UserAnswerRepository;