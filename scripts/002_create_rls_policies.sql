-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for settings table (admin only for now, but allowing read for all authenticated users)
CREATE POLICY "Authenticated users can view settings" ON public.settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Service role can manage settings" ON public.settings FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for teams table
CREATE POLICY "Team members can view their teams" ON public.teams FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.team_members 
    WHERE team_id = teams.id AND user_id = auth.uid()
  )
);
CREATE POLICY "Users can create teams" ON public.teams FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Team creators can update their teams" ON public.teams FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for team_members table
CREATE POLICY "Team members can view team membership" ON public.team_members FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.team_members tm 
    WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid()
  )
);
CREATE POLICY "Team members can be added by team creators" ON public.team_members FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.teams 
    WHERE id = team_id AND created_by = auth.uid()
  )
);

-- RLS Policies for projects table
CREATE POLICY "Team members can view team projects" ON public.projects FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.team_members 
    WHERE team_id = projects.team_id AND user_id = auth.uid()
  )
);
CREATE POLICY "Team members can create projects" ON public.projects FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.team_members 
    WHERE team_id = projects.team_id AND user_id = auth.uid()
  )
);
CREATE POLICY "Team members can update team projects" ON public.projects FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.team_members 
    WHERE team_id = projects.team_id AND user_id = auth.uid()
  )
);

-- RLS Policies for tasks table
CREATE POLICY "Team members can view project tasks" ON public.tasks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.team_members tm ON p.team_id = tm.team_id
    WHERE p.id = tasks.project_id AND tm.user_id = auth.uid()
  )
);
CREATE POLICY "Team members can create tasks" ON public.tasks FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.team_members tm ON p.team_id = tm.team_id
    WHERE p.id = tasks.project_id AND tm.user_id = auth.uid()
  )
);
CREATE POLICY "Team members can update project tasks" ON public.tasks FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.team_members tm ON p.team_id = tm.team_id
    WHERE p.id = tasks.project_id AND tm.user_id = auth.uid()
  )
);

-- RLS Policies for subtasks table
CREATE POLICY "Team members can view subtasks" ON public.subtasks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.tasks t
    JOIN public.projects p ON t.project_id = p.id
    JOIN public.team_members tm ON p.team_id = tm.team_id
    WHERE t.id = subtasks.task_id AND tm.user_id = auth.uid()
  )
);
CREATE POLICY "Team members can manage subtasks" ON public.subtasks FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.tasks t
    JOIN public.projects p ON t.project_id = p.id
    JOIN public.team_members tm ON p.team_id = tm.team_id
    WHERE t.id = subtasks.task_id AND tm.user_id = auth.uid()
  )
);

-- RLS Policies for comments table
CREATE POLICY "Team members can view comments" ON public.comments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.tasks t
    JOIN public.projects p ON t.project_id = p.id
    JOIN public.team_members tm ON p.team_id = tm.team_id
    WHERE t.id = comments.task_id AND tm.user_id = auth.uid()
  )
);
CREATE POLICY "Team members can create comments" ON public.comments FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tasks t
    JOIN public.projects p ON t.project_id = p.id
    JOIN public.team_members tm ON p.team_id = tm.team_id
    WHERE t.id = comments.task_id AND tm.user_id = auth.uid()
  ) AND user_id = auth.uid()
);

-- RLS Policies for files table
CREATE POLICY "Team members can view files" ON public.files FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.tasks t
    JOIN public.projects p ON t.project_id = p.id
    JOIN public.team_members tm ON p.team_id = tm.team_id
    WHERE t.id = files.task_id AND tm.user_id = auth.uid()
  )
);
CREATE POLICY "Team members can upload files" ON public.files FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tasks t
    JOIN public.projects p ON t.project_id = p.id
    JOIN public.team_members tm ON p.team_id = tm.team_id
    WHERE t.id = files.task_id AND tm.user_id = auth.uid()
  ) AND uploaded_by = auth.uid()
);

-- RLS Policies for notifications table
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- RLS Policies for time_logs table
CREATE POLICY "Team members can view time logs" ON public.time_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.tasks t
    JOIN public.projects p ON t.project_id = p.id
    JOIN public.team_members tm ON p.team_id = tm.team_id
    WHERE t.id = time_logs.task_id AND tm.user_id = auth.uid()
  )
);
CREATE POLICY "Users can log their own time" ON public.time_logs FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tasks t
    JOIN public.projects p ON t.project_id = p.id
    JOIN public.team_members tm ON p.team_id = tm.team_id
    WHERE t.id = time_logs.task_id AND tm.user_id = auth.uid()
  ) AND user_id = auth.uid()
);
