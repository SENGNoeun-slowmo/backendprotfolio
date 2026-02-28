import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { uploadToSupabase } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('role', 'admin')
      .limit(1)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Admin profile not found' });
    }
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { full_name, title, bio } = req.body;
    let userId = req.user?.id;
    const file = req.file as Express.Multer.File;

    console.log('Update Request - UserID:', userId, 'Body:', req.body);

    // 1. If no userId (dev mode), find the admin ID
    if (!userId && process.env.NODE_ENV === 'development') {
      const { data: admin, error: adminError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1)
        .single();
      
      if (adminError || !admin) {
        console.error('Dev Mode: Admin profile not found for update');
        return res.status(404).json({ error: 'Admin profile not found for development update' });
      }
      userId = admin.id;
      console.log('Dev Mode: Targeted Admin ID:', userId);
    }

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: No user identity found' });
    }

    // 2. Handle Avatar Upload
    let avatarUrl = req.body.avatar_url;
    if (file) {
      console.log('Processing avatar upload:', file.originalname);
      const path = `avatars/${uuidv4()}-${file.originalname}`;
      avatarUrl = await uploadToSupabase('portfolio-assets', path, file);
    }

    // 3. Update Profile
    const updateData: any = {
      full_name,
      title,
      bio,
      updated_at: new Date().toISOString()
    };

    if (avatarUrl) {
      updateData.avatar_url = avatarUrl;
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase Update Error:', error);
      throw error;
    }

    console.log('Profile updated successfully:', data.id);
    res.json(data);
  } catch (error: any) {
    console.error('Critical Profile Update Failure:', error);
    res.status(500).json({ 
      error: 'Failed to update profile', 
      details: error.message 
    });
  }
};
