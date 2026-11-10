import app from "./app.js";
import { env } from "./config/env.js";

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Klyro API is running"
  });
});

app.listen(env.port, () => {
  console.log(`Klyro API running on port ${env.port}`);
});
