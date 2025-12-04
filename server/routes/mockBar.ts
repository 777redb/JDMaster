
import express from 'express';
import { authenticate } from '../middleware/auth';
import { checkQuota } from '../middleware/quota';
import { getQueue } from '../lib/queue';

const router = express.Router();
const queue = getQueue('mock-bar');

router.post('/generate', authenticate, checkQuota(2), async (req, res) => {
  try {
    const { subject, difficulty, type } = req.body;
    
    const { id } = await queue.add('mock-bar-job', { 
      subject, difficulty, type, userId: req.user?.id 
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
