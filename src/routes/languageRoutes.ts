import express from 'express'
import { authenticateFirebase } from '../middlewares/authFirebase.js'
import LanguagesController from '../controllers/LanguagesController.js'
import { createLangValidator } from '../middlewares/validators/languagesValidator.js'

const languagesRoutes = express.Router()

languagesRoutes.get("/languages/all", authenticateFirebase, LanguagesController.getAll)

languagesRoutes.post("/languages/create", authenticateFirebase, createLangValidator, LanguagesController.create)

export default languagesRoutes;