-- Portfolio Backend Database Setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    short_description TEXT,
    description TEXT,
    role TEXT,
    duration TEXT,
    year INTEGER,
    technologies TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT FALSE,
    "order" INTEGER DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    github_url TEXT,
    live_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT,
    level INTEGER CHECK (level >= 1 AND level <= 10),
    icon TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role = 'admin'
        FROM public.profiles
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id OR is_admin());

-- RLS Policies for Projects
CREATE POLICY "Projects are viewable by everyone" 
ON public.projects FOR SELECT USING (true);

CREATE POLICY "Only admins can modify projects" 
ON public.projects FOR ALL USING (is_admin());

-- RLS Policies for Skills
CREATE POLICY "Skills are viewable by everyone" 
ON public.skills FOR SELECT USING (true);

CREATE POLICY "Only admins can modify skills" 
ON public.skills FOR ALL USING (is_admin());

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 4. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send messages" 
ON public.messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view/modify messages" 
ON public.messages FOR ALL USING (public.is_admin());
