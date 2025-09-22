-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) CHECK (role IN ('admin', 'member', 'viewer')) DEFAULT 'member',
  email VARCHAR(100) UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can view all users in their projects
CREATE POLICY "users_select_all" ON public.users FOR SELECT USING (true);
-- Users can update their own profile
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);
-- Users can insert their own profile
CREATE POLICY "users_insert_own" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  deadline DATE,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Users can view projects they are members of
CREATE POLICY "projects_select_members" ON public.projects FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.project_members 
    WHERE project_id = projects.id AND user_id = auth.uid()
  ) OR created_by = auth.uid()
);

-- Project creators can update their projects
CREATE POLICY "projects_update_creator" ON public.projects FOR UPDATE USING (created_by = auth.uid());
-- Users can create projects
CREATE POLICY "projects_insert_auth" ON public.projects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create project members table
CREATE TABLE IF NOT EXISTS public.project_members (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(50) CHECK (role IN ('admin', 'member', 'viewer')) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Enable RLS for project members
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Users can view project members for projects they belong to
CREATE POLICY "project_members_select" ON public.project_members FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.project_members pm 
    WHERE pm.project_id = project_members.project_id AND pm.user_id = auth.uid()
  )
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES public.projects(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(50) CHECK (status IN ('todo', 'in_progress', 'done')) DEFAULT 'todo',
  priority VARCHAR(20) CHECK (priority IN ('urgent','high','medium','low')) DEFAULT 'medium',
  assignee_id UUID REFERENCES public.users(id),
  created_by UUID REFERENCES public.users(id),
  due_date DATE,
  estimated_hours INT,
  actual_hours INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS for tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Users can view tasks for projects they are members of
CREATE POLICY "tasks_select_members" ON public.tasks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.project_members 
    WHERE project_id = tasks.project_id AND user_id = auth.uid()
  )
);

-- Users can update tasks they are assigned to or created
CREATE POLICY "tasks_update_assigned" ON public.tasks FOR UPDATE USING (
  assignee_id = auth.uid() OR created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.project_members 
    WHERE project_id = tasks.project_id AND user_id = auth.uid() AND role IN ('admin', 'member')
  )
);

-- Users can create tasks in projects they are members of
CREATE POLICY "tasks_insert_members" ON public.tasks FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.project_members 
    WHERE project_id = tasks.project_id AND user_id = auth.uid() AND role IN ('admin', 'member')
  )
);

-- Create subtasks table
CREATE TABLE IF NOT EXISTS public.subtasks (
  id SERIAL PRIMARY KEY,
  task_id INT REFERENCES public.tasks(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS for subtasks
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;

-- Users can view subtasks for tasks they can view
CREATE POLICY "subtasks_select" ON public.subtasks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.tasks t
    JOIN public.project_members pm ON t.project_id = pm.project_id
    WHERE t.id = subtasks.task_id AND pm.user_id = auth.uid()
  )
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id SERIAL PRIMARY KEY,
  task_id INT REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS for comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Users can view comments for tasks they can view
CREATE POLICY "comments_select" ON public.comments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.tasks t
    JOIN public.project_members pm ON t.project_id = pm.project_id
    WHERE t.id = comments.task_id AND pm.user_id = auth.uid()
  )
);

-- Create files table
CREATE TABLE IF NOT EXISTS public.files (
  id SERIAL PRIMARY KEY,
  task_id INT REFERENCES public.tasks(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INT,
  uploaded_by UUID REFERENCES public.users(id),
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS for files
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Users can view files for tasks they can view
CREATE POLICY "files_select" ON public.files FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.tasks t
    JOIN public.project_members pm ON t.project_id = pm.project_id
    WHERE t.id = files.task_id AND pm.user_id = auth.uid()
  )
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only view their own notifications
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- Create time logs table
CREATE TABLE IF NOT EXISTS public.time_logs (
  id SERIAL PRIMARY KEY,
  task_id INT REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  duration INTERVAL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS for time logs
ALTER TABLE public.time_logs ENABLE ROW LEVEL SECURITY;

-- Users can view time logs for tasks they can view
CREATE POLICY "time_logs_select" ON public.time_logs FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.tasks t
    JOIN public.project_members pm ON t.project_id = pm.project_id
    WHERE t.id = time_logs.task_id AND pm.user_id = auth.uid()
  )
);
