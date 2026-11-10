import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./modules/auth/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { env } from "./config/env.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Klyro API is running"
  });
});

app.use("/api/auth", authRouter);

// Centralized error handling middleware
app.use(errorHandler);

export default app;
