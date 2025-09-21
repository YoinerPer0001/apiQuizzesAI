import express from 'express';
import AuthController from '../../controllers/loginController.js';
import { authenticateFirebase } from '../../middlewares/authFirebase.js';

const authRouter = express.Router();

authRouter.post('/login',authenticateFirebase, AuthController.login);
  

export default authRouter;