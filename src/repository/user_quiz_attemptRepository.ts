import type { CreationAttributes, Transaction } from "sequelize";
import User_Quiz_Attempts from "../models/user_quiz_attempModel.js";

const exclideAttributes = ['createdAt', 'updatedAt'];

class UserQuizAttemptRepository {
    async findById(id:string): Promise<User_Quiz_Attempts | null> {
        return await User_Quiz_Attempts.findByPk(id);
    }

    async getByUserId(user_id:string) : Promise<User_Quiz_Attempts[]> {
        return await User_Quiz_Attempts.findAll({where: {user_id}, attributes: {exclude: exclideAttributes}});
    }

    async getAll() : Promise<User_Quiz_Attempts[]> {
        return await User_Quiz_Attempts.findAll({attributes: {exclude: exclideAttributes}});
    }

    async create(data:CreationAttributes<User_Quiz_Attempts> , options?: {transaction?: Transaction | null} ) : Promise<User_Quiz_Attempts> {
        return await User_Quiz_Attempts.create(data, {transaction: options?.transaction ?? null});
    }

    async update(data:Partial<CreationAttributes<User_Quiz_Attempts>>, id:string, options?: {transaction?: Transaction | null}) : Promise<number> {
        const [affectedRows] = await User_Quiz_Attempts.update(data, {where: {attempt_id: id}, transaction: options?.transaction ?? null});
        return affectedRows;
    }

    async deleteAnswer(id:string) : Promise<number> {
        return await User_Quiz_Attempts.destroy({where: {attempt_id: id}});
    }
}

export default new UserQuizAttemptRepository;