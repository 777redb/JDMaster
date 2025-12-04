
import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Mock Store
let documents: any[] = [];
let folders: any[] = [];

router.get('/documents', authenticate, (req, res) => {
  // In prod: filter by req.user.id
  res.json(documents);
});

router.post('/documents', authenticate, (req, res) => {
  const { title, content, type } = req.body;
  const newDoc = {
    id: Date.now().toString(),
    title,
    content,
    type,
    createdAt: Date.now(),
    tags: []
  };
  documents.unshift(newDoc);
  res.json(newDoc);
});

router.delete('/documents/:id', authenticate, (req, res) => {
  const { id } = req.params;
  documents = documents.filter(d => d.id !== id);
  res.json({ success: true });
});

router.post('/folders', authenticate, (req, res) => {
  const { name } = req.body;
  const folder = { id: `folder_${Date.now()}`, name };
  folders.push(folder);
  res.json(folder);
});

export default router;
