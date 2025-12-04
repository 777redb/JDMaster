
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Mock User Database
const users: any[] = [
  {
    id: 'admin-seed-id',
    email: 'admin@legalph.com',
    password: 'admin', // In prod: $2b$10$hashed...
    name: 'Reid Bach (Admin)',
    role: 'admin',
    subscription: 'enterprise',
    quotaUsed: 0,
    quotaLimit: 999999
  }
];

// Helper to generate tokens
const generateTokens = (user: any) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role, name: user.name }, 
    JWT_SECRET, 
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { id: user.id }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// --- Routes ---

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // In production: Use await bcrypt.compare(password, user.passwordHash)
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ accessToken, user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/register', (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In prod: await bcrypt.hash(password, 10)
      name,
      role: role || 'student',
      subscription: role === 'admin' ? 'enterprise' : role === 'attorney' ? 'premium' : 'free',
      quotaUsed: 0,
      quotaLimit: role === 'student' ? 5 : 50
    };

    users.push(newUser);

    const { accessToken, refreshToken } = generateTokens(newUser);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ accessToken, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
});

router.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET) as any;
    const user = users.find(u => u.id === payload.id);

    if (!user) return res.status(401).json({ error: 'User not found' });

    const tokens = generateTokens(user);
    
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

router.get('/me', (req, res) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ error: 'No token' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = users.find(u => u.id === payload.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
