-- ==============================================================================
-- 🚀 100% FREE TIER POSTGRESQL SCHEMA FOR SUPABASE
-- Project: AI Personal Tutor Platform
-- Run this script directly in the Supabase SQL Editor (supabase.com)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Students & Profiles Table (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT 'Scholar',
  email TEXT UNIQUE,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 120,
  streak_days INTEGER DEFAULT 1,
  mastery_percentage INTEGER DEFAULT 45,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Courses Catalog Table
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  domain_id TEXT NOT NULL,
  domain_name TEXT NOT NULL,
  description TEXT,
  total_modules INTEGER DEFAULT 3,
  video_lecture JSONB,
  tiers JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Course Enrollment & Progress
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  current_tier TEXT DEFAULT 'basics',
  current_module_index INTEGER DEFAULT 0,
  current_section_index INTEGER DEFAULT 0,
  completed_sections JSONB DEFAULT '[]'::jsonb,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 5. Daily Examination Submissions & AI Rubrics
CREATE TABLE IF NOT EXISTS public.exam_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id TEXT,
  course_title TEXT NOT NULL,
  module_title TEXT NOT NULL,
  objective_score NUMERIC(5,2) NOT NULL,
  writing_score NUMERIC(5,2) DEFAULT 0,
  max_writing_score NUMERIC(5,2) DEFAULT 5,
  total_percentage INTEGER NOT NULL,
  status TEXT CHECK (status IN ('passed', 'needs_revision')),
  ai_feedback TEXT,
  writing_evaluation JSONB,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Video Lecture Quizzes (80% Qualifying Gateway)
CREATE TABLE IF NOT EXISTS public.video_quiz_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_title TEXT NOT NULL,
  module_title TEXT,
  score INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  total_questions INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Audit Log & Student Telemetry (Admin Password: 3791552)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  course_title TEXT,
  module_title TEXT,
  section_index INTEGER,
  details TEXT,
  payload JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 9. Public Read & Write Policies for Free Tier (Idempotent: Safe to re-run anytime)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Courses are viewable by all users." ON public.courses;
CREATE POLICY "Courses are viewable by all users." ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Courses can be inserted by authenticated users." ON public.courses;
CREATE POLICY "Courses can be inserted by authenticated users." ON public.courses FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own exam submissions." ON public.exam_submissions;
CREATE POLICY "Users can view own exam submissions." ON public.exam_submissions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own exam submissions." ON public.exam_submissions;
CREATE POLICY "Users can insert own exam submissions." ON public.exam_submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own video quiz results." ON public.video_quiz_results;
CREATE POLICY "Users can view own video quiz results." ON public.video_quiz_results FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own video quiz results." ON public.video_quiz_results;
CREATE POLICY "Users can insert own video quiz results." ON public.video_quiz_results FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Audit logs can be written by any active session." ON public.audit_logs;
CREATE POLICY "Audit logs can be written by any active session." ON public.audit_logs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Audit logs can be read for admin review." ON public.audit_logs;
CREATE POLICY "Audit logs can be read for admin review." ON public.audit_logs FOR SELECT USING (true);

-- 10. Automatically Create Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'Scholar'), new.email, new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
