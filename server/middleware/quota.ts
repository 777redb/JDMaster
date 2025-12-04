
import { Request, Response, NextFunction } from 'express';

// In-memory quota tracking (In prod: Redis or DB)
const usageMap: Record<string, { used: number, lastReset: number }> = {};

export const checkQuota = (cost: number = 1) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Admins bypass quota
    if (req.user?.role === 'admin') {
      return next();
    }

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Initialize or Reset Quota (Daily)
    const now = Date.now();
    if (!usageMap[userId]) {
      usageMap[userId] = { used: 0, lastReset: now };
    }
    
    // Check for daily reset (24 hours)
    if (now - usageMap[userId].lastReset > 24 * 60 * 60 * 1000) {
      usageMap[userId] = { used: 0, lastReset: now };
    }

    // Determine Limit based on Role (This should ideally come from User DB object)
    // For demo, we infer logic or use the req.user data if updated
    const limit = req.user?.role === 'student' ? 5 : req.user?.role === 'attorney' ? 50 : 100;
    const currentUsage = usageMap[userId].used;

    if (currentUsage + cost > limit) {
      return res.status(402).json({ 
        error: 'Quota exceeded', 
        message: 'You have reached your daily limit. Please upgrade your plan or wait 24 hours.' 
      });
    }

    // Increment usage
    usageMap[userId].used += cost;
    next();
  };
};
