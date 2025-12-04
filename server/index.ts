import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth';
import caseDigestRoutes from './routes/caseDigest';
import mockBarRoutes from './routes/mockBar';
import caseBuildRoutes from './routes/caseBuild';
import reviewerRoutes from './routes/reviewer';
import contractRoutes from './routes/contracts';
import legalPadRoutes from './routes/legalPad';
import adminRoutes from './routes/admin';

import { createWorker } from './lib/queue';

const app = express();
const PORT = process.env.PORT || 3000;

// --- Security Middleware ---
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser() as any);
app.use(express.json());

// --- Monitoring Middleware (Mock Sentry/Prometheus) ---
app.use((req, res, next) => {
  // Prometheus: usage_counter.inc({ route: req.path });
  // Sentry: Sentry.addBreadcrumb({ category: 'http', message: req.path });
  next();
});

// --- Rate Limiting ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Core Features
app.use('/api/case-digest', caseDigestRoutes);
app.use('/api/mock-bar', mockBarRoutes);
app.use('/api/case-build', caseBuildRoutes);
app.use('/api/reviewer', reviewerRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/legal-pad', legalPadRoutes);

// --- Background Workers Setup (BullMQ simulation) ---
// This handles the async processing of jobs queued by the routes above
const workers = [
  { name: 'case-digest', output: 'MOCK DIGEST: The case of X vs Y established...' },
  { name: 'mock-bar', output: 'QUESTION: Explain the doctrine of... \n MODEL ANSWER: ...' },
  { name: 'case-build', output: '<h3>Research Results</h3><p>Found 5 relevant cases...</p>' },
  { name: 'reviewer', output: '# Civil Law Reviewer\n## Key Doctrines\n...' },
  { name: 'contracts', output: 'LEASE AGREEMENT\n\nKNOW ALL MEN BY THESE PRESENTS...' }
];

workers.forEach(w => {
  createWorker(w.name, async (job) => {
    // In production, this would call Python scripts or OpenAI/Gemini APIs
    // job.updateProgress(10);
    // await runHeavyTask();
    return w.output + ` [Processed for ${job.data.userId}]`;
  });
});

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', uptime: (process as any).uptime() }));

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;