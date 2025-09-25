import express from 'express'
import userController from '../controllers/userController.js'
import { authenticateFirebase } from '../middlewares/authFirebase.js'
import { updateUserValidator } from '../middlewares/validators/userValidator.js'

const userRoutes = express.Router()

userRoutes.get("/user/attempt/info", authenticateFirebase, userController.getUserAttemptsInfo)

userRoutes.put("/user/update", authenticateFirebase, updateUserValidator , userController.updateUserInfo)

export default userRoutes;