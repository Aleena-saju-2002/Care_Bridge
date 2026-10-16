import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "MONGO_URI",
  "REDIS_URL",
  "JWT_SECRET",
];

requiredEnvVariables.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`${variable} is not defined`);
  }
});

export const config = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI as string,
  redisUrl: process.env.REDIS_URL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  nodeEnv: process.env.NODE_ENV || "development",
};