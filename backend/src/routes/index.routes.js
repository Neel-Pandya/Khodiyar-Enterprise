import { Router } from "express";
import authRoutes from "./auth.routes.js";

const router = Router();

// ── Import Route Modules ───────────────────────────────────────────────────────
router.use("/auth", authRoutes);

export default router;