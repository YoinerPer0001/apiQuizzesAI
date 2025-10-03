import Answers from "../models/answersModel.js";
import type { CreationAttributes, Transaction } from "sequelize";

class AnswersRepository {
  async findById(id: string): Promise<Answers | null> {
    return await Answers.findByPk(id);
  }

  async getAll(): Promise<Answers[]> {
    return await Answers.findAll();
  }

  async create(
    data: CreationAttributes<Answers>,
    options?: { transaction?: Transaction }
  ): Promise<Answers> {
    return await Answers.create(data, {
      transaction: options?.transaction ?? null,
    });
  }

  async update(id:String, data:Partial<CreationAttributes<Answers>>): Promise<number> {
    const [affectedCount] = await Answers.update(data, {where: {answer_id: id}});
    return affectedCount;
  }

  async deleteAnswer(id:String) : Promise<number>{
    return await Answers.destroy({where: {answer_id: id}});
  }
}

export default new AnswersRepository();
