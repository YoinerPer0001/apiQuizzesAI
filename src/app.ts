import express from 'express';
import authRouter from './routes/auth/login.js';
import cors from 'cors';
import CategoriesRoutes from './routes/categoriesRoutes.js';


const rootUrl = '/api';
const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors());


//routes
app.use(rootUrl, authRouter);
app.use(rootUrl, CategoriesRoutes)

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})

