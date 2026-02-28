import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert([{ name, email, message }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Message sent successfully', data });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to send message', details: error.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
  }
};

export const updateMessageStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['unread', 'read', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabaseAdmin
      .from('messages')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update message', details: error.message });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Message deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete message', details: error.message });
  }
};
