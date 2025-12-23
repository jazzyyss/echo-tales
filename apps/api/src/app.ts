import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth/auth.routes.js";

const app = express();

app.use(cors()); //enables cross-origin resource sharing
app.use(express.json()); //Converts raw JSON → req.body e.g. email becomes req.body.email
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.get("/health", (_req, res)=>{
  res.json({status: "ok"});
});

export default app;
