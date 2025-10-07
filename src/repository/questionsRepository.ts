import type { CreationAttributes, Transaction } from "sequelize";
import Questions from "../models/questionsModel.js";
import Answers from "../models/answersModel.js";

class QuestionsRepository {
  async findById(id: string): Promise<Questions | null> {
    return await Questions.findByPk(id);
  }

  async getAll(): Promise<Questions[]> {
    return await Questions.findAll();
  }

  async getAllByQuiz(quizId: string): Promise<Questions[]> {
    return await Questions.findAll({
      attributes: {exclude: ["quiz_id", "createdAt", "updatedAt"]},
      where: { quiz_id: quizId },
      include:{model: Answers, as: "answers" , attributes: {exclude: ["question_id","createdAt", "updatedAt"]}}
    });
  }

  async create(
    data: CreationAttributes<Questions>,
    options?: { transaction?: Transaction }
  ): Promise<Questions | null> {
    return await Questions.create(data, {
      transaction: options?.transaction ?? null,
    });
  }

  async update(
    id: string,
    data: Partial<CreationAttributes<Questions>>
  ): Promise<number> {
    const [affectedCount] = await Questions.update(data, {
      where: { question_id: id },
    });
    return affectedCount;
  }

  async drop(id: string): Promise<number> {
    return await Questions.destroy({ where: { question_id: id } });
  }
}

export default new QuestionsRepository();
