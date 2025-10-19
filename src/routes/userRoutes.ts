import express from 'express'
import userController from '../controllers/userController.js'
import { authenticateFirebase } from '../middlewares/authFirebase.js'
import { updateUserSucriptionValidator, updateUserValidator } from '../middlewares/validators/userValidator.js'

const userRoutes = express.Router()

userRoutes.get("/user/attempt/info", authenticateFirebase, userController.getUserAttemptsInfo)

userRoutes.put("/user/update", authenticateFirebase, updateUserValidator , userController.updateUserInfo)

userRoutes.put("/user/suscription/update", authenticateFirebase, updateUserSucriptionValidator, userController.updateUserSubscription)

export default userRoutes;