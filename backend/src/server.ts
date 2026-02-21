import app from "./app";
import { env } from "./config/env";

app.listen(env.port, (error?: Error) => {
  if (error) {
    console.error("Failed to start backend API:", error.message);
    process.exit(1);
  }

  console.log(`Backend API listening on http://localhost:${env.port}`);
});
