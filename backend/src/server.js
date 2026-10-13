import express from "express";
import cors from "cors";
import { env } from "./config/environment.js";
import { connectDatabase } from "./config/database.js";
import examRoutes from "./routes/exam.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import evaluationRoutes from "./routes/evaluation.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware.js";

const app = express();

// CLIENT_URL can hold one or several comma-separated origins,
// e.g. "https://evalx.vercel.app,http://localhost:5173"
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map(o => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // no Origin header = curl / health checks / server-to-server
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked origin: ${origin}`));
  }
}));
app.use(express.json());

app.get("/", (req, res) => res.json({ service: "evalx-backend", status: "ok" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/results", evaluationRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await connectDatabase();
  app.listen(env.port, () => {
    console.log(`[server] listening on port ${env.port}`);
    console.log(`[server] allowed origins: ${allowedOrigins.join(", ")}`);
  });
}

start();
