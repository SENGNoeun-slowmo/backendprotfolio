import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

export const getSkills = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('skills')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch skills', details: error.message });
  }
};

export const createSkill = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('skills')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create skill', details: error.message });
  }
};

export const updateSkill = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabaseAdmin
      .from('skills')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update skill', details: error.message });
  }
};

export const deleteSkill = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { error } = await supabaseAdmin
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete skill', details: error.message });
  }
};
