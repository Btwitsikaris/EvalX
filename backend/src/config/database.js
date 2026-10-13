import mongoose from "mongoose";
import { env } from "./environment.js";

export async function connectDatabase() {
  try {
    await mongoose.connect(env.mongoUri);
    // Never log the URI: it contains the database password.
    console.log("[database] connected");
  } catch (err) {
    console.error("[database] connection failed:", err.message);
    process.exit(1);
  }
}
