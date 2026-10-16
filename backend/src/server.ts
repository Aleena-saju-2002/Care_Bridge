import "./config/env";
import app from "./app";
import connectDB from "./config/db";
import redisClient from "./config/redis";
import logger from "./utils/logger";
import { config } from "./config/env";
const PORT = config.port;

// const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await redisClient.connect();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Server startup failed", error);
    process.exit(1);
  }
};

startServer();