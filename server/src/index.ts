import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
  console.log(`Allowed CORS origins: ${env.corsOrigins.join(", ")}`);
});
