import express from 'express';
import userQuizAttemptController from '../controllers/user_quiz_attemptController.js';
import { authenticateFirebase } from '../middlewares/authFirebase.js';

const UserQuizAttRoutes = express.Router();

UserQuizAttRoutes.get('/attempts/user', authenticateFirebase, userQuizAttemptController.getUserQuizAttemptsByUserId);

export default UserQuizAttRoutes;