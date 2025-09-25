import type { CreationAttributes, Transaction } from "sequelize";
import Quizzes from "../models/quizzesModel.js";

const exludeAttr = ["createdAt", "updatedAt"]

class QuizzesRepository {
    async findById(id: string): Promise<Quizzes | null> {
        return await Quizzes.findByPk(id, { attributes: { exclude: exludeAttr } })
    }

    async findByUser(id: string, options?: { transaction?: Transaction }): Promise<Quizzes[] | null> {
        return await Quizzes.findAll({where: {creator_id: id},  transaction: options?.transaction ?? null})
    }

    async getAll() {
        return await Quizzes.findAll({ attributes: { exclude: exludeAttr } })
    }

    async create(quiz: CreationAttributes<Quizzes>, options?: { transaction?: Transaction }): Promise<Quizzes> {
        return await Quizzes.create(quiz, { transaction: options?.transaction ?? null })
    }

    async update(id: string, data: Partial<CreationAttributes<Quizzes>>): Promise<number> {
        const [affectedCount] = await Quizzes.update(data, { where: { quiz_id: id } })
        return affectedCount
    }

    async deleteAnswer(id: string): Promise<number> {
        return await Quizzes.destroy({ where: { quiz_id: id } })
    }
}

export default new QuizzesRepository;