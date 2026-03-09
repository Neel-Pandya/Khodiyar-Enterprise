import logger from "../utils/logger.js";
import db from "./pool.js";
import { createUsersTableQuery } from "./queries.js";

const migrate = async () => {
    try {
        await db.query(createUsersTableQuery);
        logger.info("Migration Successfull", {
            table: ["users"],
        })
    } catch (err) {
        logger.error("Migration failed", {
            error: err.message,
            stack: err.stack,
            table: "users",
        });
        console.error("Migration failed:", err);
    } finally {
        await db.end();
    }
};

migrate();