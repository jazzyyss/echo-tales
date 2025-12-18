import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config();

const app = express();

app.use(cors()); //enables cross-origin resource sharing
app.use(express.json()); //Converts raw JSON → req.body e.g. email becomes req.body.email

app.get("/health", (_req, res)=>{
  res.json({status: "ok"});
});

export default app;