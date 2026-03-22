import express from 'express';
import { errorHandler } from './handlers/error.handler.js';
import routes from './routes/index.routes.js';
import logger from './utils/logger.js';
import morgan from 'morgan';
const app = express();

// ── Core Middleware ───────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -- Logger ──────────────────────────────────────────────────────────────
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: logger.stream,
  })
);

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/api/', (req, res) => {
  res.json({ message: 'Backend Running.....' });
});

app.use('/api/', routes);
// ── Global Error Handler ───────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
