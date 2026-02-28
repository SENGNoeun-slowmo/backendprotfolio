import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { uploadToSupabase } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

// Public Endpoints
export const getProjects = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('featured', { ascending: false })
      .order('order', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch projects', details: error.message });
  }
};

export const getProjectBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch project', details: error.message });
  }
};

// Admin Endpoints
export const adminGetProjects = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch projects for admin', details: error.message });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const projectData = req.body;
    const files = req.files as Express.Multer.File[];
    
    // 1. Upload images if any
    const imageUrls: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const path = `projects/${uuidv4()}-${file.originalname}`;
        const url = await uploadToSupabase('portfolio-assets', path, file);
        imageUrls.push(url);
      }
    }

    // 2. Insert project record
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert([{
        ...projectData,
        images: imageUrls,
        technologies: typeof projectData.technologies === 'string' 
          ? JSON.parse(projectData.technologies) 
          : projectData.technologies
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create project', details: error.message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const projectData = req.body;
    const files = req.files as Express.Multer.File[];

    // Handle image updates if new files are uploaded
    let imageUrls: string[] = projectData.existingImages 
      ? (typeof projectData.existingImages === 'string' ? JSON.parse(projectData.existingImages) : projectData.existingImages)
      : [];

    if (files && files.length > 0) {
      for (const file of files) {
        const path = `projects/${uuidv4()}-${file.originalname}`;
        const url = await uploadToSupabase('portfolio-assets', path, file);
        imageUrls.push(url);
      }
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update({
        ...projectData,
        images: imageUrls,
        technologies: typeof projectData.technologies === 'string' 
          ? JSON.parse(projectData.technologies) 
          : projectData.technologies
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update project', details: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Optional: Fetch project first to delete images from storage
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete project', details: error.message });
  }
};
