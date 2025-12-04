
import express from 'express';
import { authenticate, adminOnly } from '../middleware/auth';

const router = express.Router();

// Mock Data Store
const mockStats = {
  totalUsers: 1250,
  activeUsers: 843,
  totalGenerations: 15420,
  revenue: 45200,
  systemHealth: 'Healthy'
};

const mockLogs = [
  { id: '1', timestamp: new Date().toISOString(), level: 'info', action: 'User Login', details: 'User ID 123 logged in' },
  { id: '2', timestamp: new Date(Date.now() - 10000).toISOString(), level: 'warn', action: 'Rate Limit', details: 'IP 192.168.1.1 exceeded limit' },
  { id: '3', timestamp: new Date(Date.now() - 50000).toISOString(), level: 'error', action: 'AI Timeout', details: 'Gemini API timed out after 30s' },
  { id: '4', timestamp: new Date(Date.now() - 100000).toISOString(), level: 'info', action: 'Payment', details: 'Subscription renewed for User 456' },
];

const mockUsers = [
  { id: 'u1', name: 'Juan Dela Cruz', email: 'juan@law.ph', role: 'student', plan: 'Free', status: 'Active' },
  { id: 'u2', name: 'Maria Santos', email: 'maria@firm.ph', role: 'attorney', plan: 'Premium', status: 'Active' },
  { id: 'u3', name: 'Admin User', email: 'admin@legalph.com', role: 'admin', plan: 'Enterprise', status: 'Active' },
];

const mockQueues = [
  { id: 'job_1', type: 'Case Digest', status: 'active', progress: 45 },
  { id: 'job_2', type: 'Mock Bar', status: 'waiting', progress: 0 },
  { id: 'job_3', type: 'Contract', status: 'completed', progress: 100 },
];

// --- Routes ---

router.get('/stats', authenticate, adminOnly, (req, res) => {
  res.json(mockStats);
});

router.get('/users', authenticate, adminOnly, (req, res) => {
  res.json(mockUsers);
});

router.get('/logs', authenticate, adminOnly, (req, res) => {
  res.json(mockLogs);
});

router.get('/queues', authenticate, adminOnly, (req, res) => {
  res.json(mockQueues);
});

// User Management Actions
router.patch('/users/:id/role', authenticate, adminOnly, (req, res) => {
  const { role } = req.body;
  res.json({ message: `Role updated to ${role}` });
});

router.delete('/users/:id', authenticate, adminOnly, (req, res) => {
  res.json({ message: 'User deleted' });
});

// System Actions
router.post('/maintenance', authenticate, adminOnly, (req, res) => {
  res.json({ message: 'Maintenance mode toggled' });
});

router.post('/queues/clear', authenticate, adminOnly, (req, res) => {
  res.json({ message: 'Queues cleared' });
});

export default router;
