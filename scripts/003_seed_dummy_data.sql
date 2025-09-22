-- Insert dummy users (these will be created when users sign up)
-- We'll create the project and tasks assuming these users exist

-- Insert the main project
INSERT INTO public.projects (name, description, deadline, created_by) 
VALUES (
  'Wakanda PM System v1.0',
  'A futuristic project management system inspired by Wakanda technology with AI assistant capabilities',
  '2025-11-30',
  (SELECT id FROM auth.users LIMIT 1)
) ON CONFLICT DO NOTHING;

-- Get the project ID for reference
DO $$
DECLARE
    project_id_var INT;
    user_id_var UUID;
BEGIN
    SELECT id INTO project_id_var FROM public.projects WHERE name = 'Wakanda PM System v1.0' LIMIT 1;
    SELECT id INTO user_id_var FROM auth.users LIMIT 1;
    
    IF project_id_var IS NOT NULL AND user_id_var IS NOT NULL THEN
        -- Insert tasks
        INSERT INTO public.tasks (project_id, title, description, status, priority, created_by) VALUES
        (project_id_var, 'Design System Setup', 'Create Vibranium Purple + Neon Blue palette, Typography Orbitron/Exo2, UI kit holographic components', 'done', 'high', user_id_var),
        (project_id_var, 'Database Schema Design', 'Users, Projects, Tasks, Subtasks, Comments, Files, Reports, Notifications, Prisma migrations', 'done', 'high', user_id_var),
        (project_id_var, 'Kanban Board UI', 'Drag & drop board, Zustand state management, Neon hover hologram effects', 'in_progress', 'high', user_id_var),
        (project_id_var, 'AI Subtask Generator', 'NLP parsing for descriptions, TensorFlow ML model, FastAPI → NestJS API integration', 'in_progress', 'medium', user_id_var),
        (project_id_var, 'Repo Setup & CI/CD', 'Monorepo (frontend, backend, AI), GitHub Actions, Initial deploy (Vercel + Railway)', 'done', 'urgent', user_id_var),
        (project_id_var, 'Authentication System', 'JWT security, user roles, protected routes', 'todo', 'high', user_id_var),
        (project_id_var, 'Real-time Notifications', 'Socket.IO integration, live updates', 'todo', 'medium', user_id_var);
        
        -- Insert subtasks for some tasks
        INSERT INTO public.subtasks (task_id, title, is_completed, created_by) 
        SELECT t.id, 'Color palette implementation', true, user_id_var
        FROM public.tasks t WHERE t.title = 'Design System Setup' AND t.project_id = project_id_var;
        
        INSERT INTO public.subtasks (task_id, title, is_completed, created_by) 
        SELECT t.id, 'Typography setup', true, user_id_var
        FROM public.tasks t WHERE t.title = 'Design System Setup' AND t.project_id = project_id_var;
        
        INSERT INTO public.subtasks (task_id, title, is_completed, created_by) 
        SELECT t.id, 'Holographic components', false, user_id_var
        FROM public.tasks t WHERE t.title = 'Design System Setup' AND t.project_id = project_id_var;
    END IF;
END $$;
