import {
  Sequelize,
  type CreationAttributes,
  type Transaction,
} from "sequelize";
import Quizzes from "../models/quizzesModel.js";
import User_Quiz_Attempts from "../models/user_quiz_attempModel.js";
import Languages from "../models/languageModel.js";
import Categories from "../models/categoriesModel.js";
import User from "../models/userModel.js";

const exludeAttr = ["createdAt", "updatedAt"];

class QuizzesRepository {
  async findById(id: string): Promise<Quizzes | null> {
    return await Quizzes.findByPk(id, { attributes: { exclude: exludeAttr } });
  }

  async findByUser(
    id: string,
    options?: { transaction?: Transaction }
  ): Promise<Quizzes[] | null> {
    return await Quizzes.findAll({
      where: { creator_id: id },
      transaction: options?.transaction ?? null,
    });
  }

  async getAll(): Promise<Quizzes[] | null> {
    return await Quizzes.findAll({ attributes: { exclude: exludeAttr } });
  }

  async getQuizzesUser(
    id: string,
    page: number = 1,
    limit: number = 20,
    category?: string
  ): Promise<{ quizzes: Quizzes[]; total: number; totalPages: number }> {
    const offset = (page - 1) * limit;

    const whereClause: any = { creator_id: id };

    if (category) {
      whereClause.category_id = category; // si hay categoría, se agrega
    }

    const { rows: quizzes, count: total } = await Quizzes.findAndCountAll({
      where: whereClause,
      attributes: {
        exclude: ["updatedAt", "language_id", "creator_id", "category_id"],
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Languages,
          as: "language",
          attributes: { exclude: exludeAttr },
        },
        {
          model: Categories,
          as: "category",
          attributes: { exclude: exludeAttr },
        },
      ],
    });

    const totalPages = Math.ceil(total / limit);

    return { quizzes, total, totalPages };
  }

  async getAllPublics(
    page: number = 1,
    limit: number = 20,
    category?: string
  ): Promise<{ quizzes: Quizzes[]; total: number; totalPages: number }> {
    const offset = (page - 1) * limit;

    const whereClause: any = { is_public: true };

    if (category) {
      whereClause.category_id = category; // si hay categoría, se agrega
    }

    const { rows: quizzes, count: total } = await Quizzes.findAndCountAll({
      attributes: {
        exclude: exludeAttr,
        include: [
          [
            Sequelize.literal(
              `(SELECT COUNT(*)FROM "user_quiz_attempts" AS attempts WHERE attempts."quiz_id" = "quizzes"."quiz_id")`
            ),
            "attemptCount",
          ],
        ],
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      where: whereClause,
      include: [
        {
          model: Languages,
          as: "language",
          attributes: { exclude: exludeAttr },
        },
        {
          model: Categories,
          as: "category",
          attributes: { exclude: exludeAttr },
        },
        { model: User, as: "creator", attributes: { exclude: exludeAttr } },
      ],
    });

    const totalPages = Math.ceil(total / limit);

    return { quizzes, total, totalPages };
  }

  async create(
    quiz: CreationAttributes<Quizzes>,
    options?: { transaction?: Transaction }
  ): Promise<Quizzes> {
    return await Quizzes.create(quiz, {
      transaction: options?.transaction ?? null,
    });
  }

  async update(
    id: string,
    data: Partial<CreationAttributes<Quizzes>>
  ): Promise<number> {
    const [affectedCount] = await Quizzes.update(data, {
      where: { quiz_id: id },
    });
    return affectedCount;
  }

  async deleteAnswer(id: string): Promise<number> {
    return await Quizzes.destroy({ where: { quiz_id: id } });
  }
}

export default new QuizzesRepository();
