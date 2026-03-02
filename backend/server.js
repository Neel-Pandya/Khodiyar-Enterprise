import { config } from "dotenv";
import app from "./src/app.js";

config({ path: "./.env" });

const PORT = process.env.APP_PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

