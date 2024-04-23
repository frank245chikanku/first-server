import compression from "compression";
import cors from "cors";
import express,{Application, Request, Response } from "express";
import morgan from "morgan";
import userRouter from "./user/router";


const app:Application = express();
const PORT = 8005;

app.use(morgan("dev"));
app.use(compression());
app.use(cors());
app.use(express.json());

app.use("/user",userRouter)

app.get("/",(_req:Request,  res:Response)=>{
    res.send("Franks sever is up and running")
})

const start = () => {
    app.listen(PORT,()=>{
       console.log(`App is running http://localhost:${PORT}`)
    })
}
start();







