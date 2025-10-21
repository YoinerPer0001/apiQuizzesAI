import express from 'express'
import quizzesController from '../controllers/quizzesController.js'
import { authenticateFirebase } from '../middlewares/authFirebase.js'
import { createQuizValidator, geTAllQuizzesValidator, getQuizzValidator } from '../middlewares/validators/quizzesValidator.js'
import { isPremiumValidator } from '../middlewares/authorization/premium.js'

const quizRoutes = express.Router()

quizRoutes.get("/quizzes/all", authenticateFirebase, quizzesController.getQuizzesByUser)
quizRoutes.get("/quizzes/all/user", authenticateFirebase, geTAllQuizzesValidator, quizzesController.getAllQuizzesUser)
quizRoutes.get("/quizzes/all/public", authenticateFirebase, geTAllQuizzesValidator, quizzesController.getAllPublics)
quizRoutes.get("/quizzes/find", authenticateFirebase, isPremiumValidator, getQuizzValidator,  quizzesController.getQuizzById)
quizRoutes.post("/quizzes/create", authenticateFirebase, createQuizValidator, quizzesController.create)


export default quizRoutes;