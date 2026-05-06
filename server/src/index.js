import app from "./app.js";
import { env } from "./config/constant.js";

app.listen(env.port, () => {
  console.log("server running on port: ", env.port);
});


process.on("unhandledRejection", async (err) => {
  console.error("Unhandled Rejecton:", err.message);
  process.exit(1);
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("SIGTERM", async (err) => {
  console.error("sigterm error:", err.message);
  process.exit(1);
});
