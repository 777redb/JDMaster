
import express from 'express';
import { authenticate } from '../middleware/auth';
import { checkQuota } from '../middleware/quota';
import { getQueue } from '../lib/queue';

const router = express.Router();
const queue = getQueue('contracts');

router.post('/generate', authenticate, checkQuota(3), async (req, res) => {
  try {
    const { type, parties, terms } = req.body;
    
    const { id } = await queue.add('contract-job', { 
      type, parties, terms, userId: req.user?.id 
    });

    res.json({ jobId: id, status: 'queued' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to queue job' });
  }
});

router.get('/status/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const job = await queue.getJob(id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  res.json({
    id,
    status: await job.getState(),
    result: job.returnvalue,
    error: job.failedReason
  });
});

export default router;
