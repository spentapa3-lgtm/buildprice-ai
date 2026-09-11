import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import readline from "readline";
import fs from "fs";

function loadEnvFile() {
  const envPath = ".env.local";

  if (!fs.existsSync(envPath)) {
    throw new Error(".env.local file not found.");
  }

  const content = fs.readFileSync(envPath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const index = trimmed.indexOf("=");

    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();

    process.env[key] = value;
  }
}

loadEnvFile();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from .env.local");
}

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("\nConnected to MongoDB.\n");

    const name = await ask("Admin name: ");
    const email = await ask("Admin email: ");
    const password = await ask("Admin password: ");

    if (!name || !email || !password) {
      throw new Error("All fields are required.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      console.log("\nA user with this email already exists.");

      if (existingUser.role !== "admin") {
        existingUser.role = "admin";
        await existingUser.save();
        console.log("Existing user has been promoted to admin.");
      } else {
        console.log("This user is already an admin.");
      }

      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("\n================================");
    console.log("ADMIN CREATED SUCCESSFULLY");
    console.log("================================");
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log("Password: securely hashed in MongoDB");
    console.log("================================\n");
  } catch (error) {
    console.error("\nError:", error.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
}

createAdmin();