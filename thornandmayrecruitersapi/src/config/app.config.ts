import express from 'express';
import allRoutes from "../routes/index";
import { errorHandler } from 'src/middlewares/error.middleware';
import cors from 'src/middlewares/cors.middleware';
import { notfoundHandler } from 'src/middlewares/notfound.middleware';
const app = express();
app.use(cors)
app.use(express.json())
app.use(express.urlencoded())
app.use("/api", allRoutes);
app.use(notfoundHandler)
app.use(errorHandler)


export default app;
