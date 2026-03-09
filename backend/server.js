import { config } from "dotenv";
import app from "./src/app.js";
import logger from "./src/utils/logger.js";

config({ path: "./.env" });

const PORT = process.env.APP_PORT;

app.listen(PORT, () => {
    logger.info(`Server is started`, { port: PORT });
});

