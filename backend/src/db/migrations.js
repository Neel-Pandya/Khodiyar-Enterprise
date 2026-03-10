import logger from "../utils/logger.js";
import db from "./pool.js";
import { createUsersTableQuery , dropUsersTableQuery} from "./queries.js";

const migrate = async () => {
    try {
        logger.info("Migration started: Creating Tables", {
            table: ["users"],
        });
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

const drop = async () => {
    try {
        logger.info("Migration started: Dropping tables", {
            table: ["users"],
        });
        await db.query(dropUsersTableQuery);
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
}

switch (process.argv[2]) {
    case "create":
        migrate();
        break;
    case "drop":
        drop();
        break;
    default:
        logger.error("Invalid migration command", {
            command: process.argv[2],
        });
        break;
}