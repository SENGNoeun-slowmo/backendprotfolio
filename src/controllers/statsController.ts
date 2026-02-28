import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

export const getStats = async (req: Request, res: Response) => {
  try {
    // 1. Get total products
    const { count: totalProducts, error: productsError } = await supabaseAdmin
      .from('projects')
      .select('*', { count: 'exact', head: true });

    if (productsError) throw productsError;

    // 2. Get total skills
    const { count: totalSkills, error: skillsError } = await supabaseAdmin
      .from('skills')
      .select('*', { count: 'exact', head: true });

    if (skillsError) throw skillsError;

    // 3. Get total users (profiles)
    const { count: totalUsers, error: usersError } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (usersError) throw usersError;

    // 4. Get message stats
    const { count: totalMessages, error: messagesError } = await supabaseAdmin
      .from('messages')
      .select('*', { count: 'exact', head: true });

    const { count: unreadMessages, error: unreadError } = await supabaseAdmin
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'unread');

    const { data: recentMessages, error: recentMessagesError } = await supabaseAdmin
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    const stats = {
      totalProducts: totalProducts || 0,
      totalSkills: totalSkills || 0,
      totalUsers: totalUsers || 0,
      totalMessages: totalMessages || 0,
      unreadMessages: unreadMessages || 0,
      revenue: 12500, // Placeholder
      recentActivity: [
        ...(recentMessages?.map(m => ({
          id: `msg-${m.id}`,
          type: 'message_received',
          message: `Transmission from ${m.name}`,
          date: m.created_at
        })) || []),
        { id: 'custom-1', type: 'project_added', message: 'New project "SaaS Dashboard" added', date: new Date().toISOString() },
      ]
    };

    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
