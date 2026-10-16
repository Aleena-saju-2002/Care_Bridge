import { createClient } from "redis";

import logger from "../utils/logger";
import { config } from "./env";

const redisClient = createClient({
  url: config.redisUrl,
});

redisClient.on("error", (error) => {
  logger.error(`Redis error: ${error}`);
});

redisClient.on("connect", () => {
  logger.info("Redis connected");
});

export default redisClient;