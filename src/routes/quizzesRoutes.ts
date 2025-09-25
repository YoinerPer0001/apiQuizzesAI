import express from 'express'
import quizzesController from '../controllers/quizzesController.js'
import { authenticateFirebase } from '../middlewares/authFirebase.js'
import { createQuizValidator } from '../middlewares/validators/quizzesValidator.js'

const quizRoutes = express.Router()

quizRoutes.get("/quizzes/all", authenticateFirebase, quizzesController.getQuizzesByUser)
quizRoutes.post("/quizzes/create", authenticateFirebase, createQuizValidator, quizzesController.create)


export default quizRoutes;