// backend/seed.js
// Run once against your database:
//   ADMIN_USERNAME=youradmin ADMIN_PASSWORD=a-strong-password MONGO_URI="mongodb+srv://..." node seed.js
import mongoose from "mongoose";
import Admin from "./src/models/Admin.js";
import { env } from "./src/config/environment.js";

async function seed() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  await mongoose.connect(env.mongoUri);

  const existing = await Admin.findOne({ username });
  if (!existing) {
    await Admin.create({ username, password });
    console.log(`Admin created: ${username}`);
  } else {
    console.log("Admin already exists");
  }

  process.exit();
}

seed();
