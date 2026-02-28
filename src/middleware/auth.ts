import { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { supabaseAdmin } from '../config/supabase';

const JWKS_URL = `${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

export const authenticateRequest = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Verify JWT using jose and remote JWKS
    const { payload } = await jwtVerify(token, JWKS);
    
    if (!payload.sub) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    // 2. Fetch user role from profiles table
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', payload.sub)
      .single();

    if (error || !profile) {
      return res.status(403).json({ error: 'User profile not found or unauthorized' });
    }

    // 3. Attach user info to request
    req.user = {
      id: payload.sub,
      email: payload.email as string,
      role: profile.role
    };

    next();
  } catch (error: any) {
    console.error('Auth verification error:', error);
    return res.status(401).json({ error: 'Invalid or expired token', details: error.message });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
  next();
};
