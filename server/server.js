import express from 'express';
import dotenv from 'dotenv'

import userRouter from './routes/userRoutes.js';
import transactionRouter from './routes/transationsRoutes.js'
import roomsRouters from './routes/roomsRouters.js';


import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import bodyParser from 'body-parser';
const PORT = process.env.PORT || 5000
dotenv.config();
const app = express();
connectDB();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
// // support parsing of application/json type post data
// app.use(bodyParser.json());

// //support parsing of application/x-www-form-urlencoded post data
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
    origin:process.env.ORIGIN,
    credentials:true
}))

app.use('/v1/api/users' , userRouter);
app.use('/v1/api/transactions' , transactionRouter)
app.use('/v1/api/rooms',roomsRouters);

app.get('/' , (req, res)=>{
    res.send("Api workin!")
});

app.use(notFound);
app.use(errorHandler);
app.listen(PORT , ()=>console.log(`Server is listening on ${PORT}`));