import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import { env } from "./config/env";
import apiRoutes from "./routes";

type HttpError = Error & { status?: number };

const app = express();

app.use(
  cors({
    origin: env.corsOrigin === "*" ? true : env.corsOrigin,
  }),
);
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Backend API is running",
  });
});

app.use("/api", apiRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.use(
  (
    error: HttpError,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    if (env.nodeEnv !== "test") {
      console.error(error);
    }

    res.status(error.status || 500).json({
      error: "Internal server error",
    });
  },
);

export default app;
