import dotenv from "dotenv";

dotenv.config();

const parsedPort = Number(process.env.PORT);

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 4000,
  corsOrigin: process.env.CORS_ORIGIN || "*",
};
