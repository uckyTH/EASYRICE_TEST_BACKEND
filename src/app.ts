//Server.ts
import express, { Request, Response, Application } from "express";
import connectDB from "./db";
import bodyParser from "body-parser";
import historyRouter from './routes/History.router';
import resultRouter from './routes/InspectionResult.router';
import standardRouter from './routes/Standard.router';
import morgan from "morgan";
import cors from "cors";  
const app: Application = express();

app.use(cors({
  origin: process.env.FRONT_END, // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type'], // Specify allowed headers
}));

// Connect to MongoDB
connectDB();
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(morgan("dev"));
app.use('/api/history',historyRouter );
app.use('/api/result', resultRouter);
app.use('/api/standard', standardRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, Rice Inspection API <3");
  });

export default app;
