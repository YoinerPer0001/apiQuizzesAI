import type { CreationAttributes } from "sequelize";
import type Quizzes from "../models/quizzesModel.js";
import { ApiResponse } from "../core/responseSchedule.js";
import quizzesRepository from "../repository/quizzesRepository.js";
import categoriesRepository from "../repository/categoriesRepository.js";
import userRepository from "../repository/userRepository.js";
import { db } from "../core/db.js";
import LanguagesRepository from "../repository/LanguagesRepository.js";
import answersRepository from "../repository/answersRepository.js";
import questionsRepository from "../repository/questionsRepository.js";

class QuizzesService {
  async create(
    id_user: string,
    data: CreationAttributes<Quizzes>
  ): Promise<ApiResponse<{ attempts_remaining: number } | null>> {
    const transaction = await db.transaction();
    try {
      const exist = await categoriesRepository.findById(data.category_id);
      if (!exist) {
        return new ApiResponse(404, "category not found", null);
      }

      const existLanguage = await LanguagesRepository.getById(data.language_id);
      if (!existLanguage) {
        return new ApiResponse(404, "language not found", null);
      }

      const dataQuizz = {
        creator_id: id_user,
        title: data.title,
        language_id: data.language_id,
        is_public: data.is_public,
        difficult: data.difficult,
        category_id: data.category_id,
        resources: data.resources,
      };

      //verify remaining attemps
      const user = await userRepository.findById(id_user, { transaction });
      let remainig_attemps = user?.dataValues.attempts_remaining;

      if (remainig_attemps > 0 || user?.dataValues.isPremium === true) {
        const result = await quizzesRepository.create(dataQuizz, {
          transaction,
        });
        console.log(result);

        if (!result) {
          transaction.rollback();
          return new ApiResponse(500, "Error to create quiz", null);
        }

        //create question
        const dataQuestions = data.data;

        for (const question of dataQuestions) {
          const questionSend = {
            quiz_id: result.dataValues.quiz_id,
            text: question.question.text,
            time_limit: question.question.time_limit,
            type: question.question.type,
          };

          //save question
          const createdQuestion = await questionsRepository.create(
            questionSend,
            { transaction }
          );
          console.log(createdQuestion);
          if (!createdQuestion) {
            transaction.rollback();
            return new ApiResponse(500, "Error to create question", null);
          }
          //save answers
          for (const answer of question.question.answers) {
            const objectAnswer = {
              question_id: createdQuestion.dataValues.question_id,
              text: answer.text,
              is_correct: answer.is_correct,
            };

            const answerSend = await answersRepository.create(objectAnswer, {
              transaction,
            });
            if (!answerSend) {
              transaction.rollback();
              return new ApiResponse(500, "Error to create answer", null);
            }
          }
        }

        //subtrac remaining attempts

        if (user?.dataValues.isPremium === false) { //eliminamos uno solo si es plan free
            remainig_attemps = remainig_attemps - 1;
          const updatedUser = await userRepository.update(
            id_user,
            { attempts_remaining: remainig_attemps },
            { transaction }
          );

          if (!updatedUser) {
            transaction.rollback();
            return new ApiResponse(500, "Error to update attempts", null);
          }
        }

        await transaction.commit();
        return new ApiResponse(201, "success", {
          quiz_id: result.dataValues.quiz_id,
          attempts_remaining: remainig_attemps,
        });
      } else {
        transaction.rollback();
        return new ApiResponse(401, "Exceded quota", null);
      }
    } catch (error) {
      transaction.rollback();
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  async getAllQuizzesUsers(
    id: string,
    page: number,
    limit: number,
    category?: string
  ): Promise<
    ApiResponse<{
      quizzes: Quizzes[];
      total: number;
      totalPages: number;
    } | null>
  > {
    try {
      const result = await quizzesRepository.getQuizzesUser(
        id,
        page,
        limit,
        category
      );
      return new ApiResponse(200, "success", result);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  async getById(id: string): Promise<ApiResponse<Quizzes | null>> {
    try {
      const result = await quizzesRepository.findById(id);
      if (!result) {
        return new ApiResponse(404, "quiz not found", null);
      }
      return new ApiResponse(200, "success", result);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  async getCreatorQuizzes(id: string): Promise<ApiResponse<Quizzes[] | null>> {
    try {
      const result = await quizzesRepository.findByUser(id);
      if (!result) {
        return new ApiResponse(500, "Error to ask", null);
      }
      return new ApiResponse(200, "success", result);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  async getAllPublics(
    page: number = 1,
    limit: number = 20,
    category?: string
  ): Promise<
    ApiResponse<{
      quizzes: Quizzes[];
      total: number;
      totalPages: number;
    } | null>
  > {
    try {
      const result = await quizzesRepository.getAllPublics(
        page,
        limit,
        category
      );
      return new ApiResponse(200, "success", result);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }
}

export default new QuizzesService();
