import { ApiResponse } from "../core/responseSchedule.js";
import type Questions from "../models/questionsModel.js";
import questionsRepository from "../repository/questionsRepository.js";




class QuestionService {

    async findQuestionsByQuizId(quizId: string): Promise<ApiResponse<Questions[] | null>> {
        try {
            
            const result = await questionsRepository.getAllByQuiz(quizId)
            return new ApiResponse(200, "success", result)

        } catch (error) {
            console.error("Error fetching questions by quiz ID:", error);
            return new ApiResponse(500, (error as Error).message, null)
        }
    }
}

export default new QuestionService;