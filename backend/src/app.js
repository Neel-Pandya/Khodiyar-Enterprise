import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { ApiError } from "./utils/ApiError.js";

const app = express();

// ── Core Middleware ───────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({ message: "Backend Running....." });
});

// ── Global Error Handler ───────────────────────────────────────────────────────
app.use(errorHandler);

export default app; 