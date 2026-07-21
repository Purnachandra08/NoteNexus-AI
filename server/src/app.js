import routes from "./routes/index.js";
import errorHandler from "./middleware/error.middleware.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Request Logging
app.use(morgan("dev"));

// Body Parser
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to NoteNexus AI Backend 🚀",
  });
});

app.use("/api/v1", routes);
// Global Error Middleware
app.use(errorHandler);
// API Routes

export default app;