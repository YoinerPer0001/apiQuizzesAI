import type { CreationAttributes, Transaction } from "sequelize";
import Questions from "../models/questionsModel.js";

class QuestionsRepository {
  async findById(id: string): Promise<Questions | null> {
    return await Questions.findByPk(id);
  }

  async getAll(): Promise<Questions[]> {
    return await Questions.findAll();
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
