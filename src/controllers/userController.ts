import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const { data: user, error } = await supabaseAdmin
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(user);
  } catch (error: any) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};
