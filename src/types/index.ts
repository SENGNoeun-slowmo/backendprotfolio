export interface Profile {
  id: string;
  full_name: string;
  title?: string;
  bio?: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  short_description?: string;
  description?: string;
  role?: string;
  duration?: string;
  year?: number;
  technologies: string[];
  featured: boolean;
  order: number;
  images: string[];
  github_url?: string;
  live_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
  level: number;
  icon?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface AuthContext {
  id: string;
  email?: string;
  role?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthContext;
    }
  }
}
