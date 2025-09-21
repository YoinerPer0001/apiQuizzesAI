import express from 'express';
import authRouter from './routes/auth/login.js';
import cors from 'cors';


const rootUrl = '/api';
const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors());


//routes
app.use(rootUrl, authRouter);

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})

