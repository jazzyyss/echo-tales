import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import path from "path";
import { authRouter } from "./modules/auth/auth.routes.js";
import { userRouter } from "./modules/user/user.routes.js";
import { notFoundMiddleware } from "./middlewares/notfound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { requireAuth } from "./middlewares/auth.middleware.js";
import { taleRouter } from "./modules/tales/tales.routes.js";

const app = express();

//app.use(cors()); //enables cross-origin resource sharing
//when using credentials true specify origin
app.use(
  cors({
    origin: ["http://localhost:5173"], // Vite dev origin
    credentials: true,
  })
);
app.use(express.json()); //Converts raw JSON → req.body e.g. email becomes req.body.email
app.use(cookieParser());
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter); 
app.use("/api/tale", requireAuth, taleRouter);

app.get("/health", (_req, res)=>{
  res.json({status: "ok"});
});

// 404 handler (must be AFTER routes)
app.use(notFoundMiddleware);

// error handler (must be LAST)
app.use(errorMiddleware);

export default app;
