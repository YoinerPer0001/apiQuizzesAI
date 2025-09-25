import express from 'express';
import authRouter from './routes/auth/login.js';
import cors from 'cors';
import CategoriesRoutes from './routes/categoriesRoutes.js';
import quizRoutes from './routes/quizzesRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dotenv from 'dotenv';
import languagesRoutes from './routes/languageRoutes.js';

dotenv.config();


const rootUrl = '/api';
const app = express();
const PORT: number = parseInt(process.env.SERVER_PORT ?? "3000") ;

app.use(express.json());

app.use(cors());


//routes
app.use(rootUrl, authRouter);
app.use(rootUrl, CategoriesRoutes)
app.use(rootUrl, quizRoutes)
app.use(rootUrl, userRoutes)
app.use(rootUrl, languagesRoutes)




app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})



