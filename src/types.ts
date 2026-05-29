/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SystemMetrics {
  dau: number;
  dauTrend: string;
  dauHistory: Array<{ date: string; value: number }>;
  
  latency: number;
  latencyTrend: string;
  latencyHistory: Array<{ date: string; value: number }>;
  
  cost: number;
  costTrend: string;
  costHistory: Array<{ date: string; value: number }>;
  
  successRate: number;
  errorRate: number;
  activeIncidents: number;
  projectCount: number;
  
  revenue: number;
  revenueTrend: string;
  revenueHistory: Array<{ name: string; revenue: number; cost: number }>;
  
  aiModelsAllocation: Array<{ name: string; value: number; color: string }>;
}

export interface ActivityLog {
  id: string;
  type: 'api_call' | 'user_join' | 'deploy' | 'incident' | 'milestone';
  user: string;
  avatarUrl?: string;
  description: string;
  time: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Developer' | 'UI/UX Designer' | 'Product Manager';
  status: 'active' | 'inactive' | 'pending';
  performance: number; // percentage index, e.g. 96
  avatar: string;
  tasksCompleted: number;
}

export interface ProjectTask {
  id: string;
  title: string;
  assignedTo: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  lead: string;
  progress: number;
  status: 'Active' | 'Paused' | 'Shipped';
  priority: 'Low' | 'Medium' | 'High';
  tasks: ProjectTask[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface FeedbackNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface AppState {
  theme: 'light' | 'dark';
  user: AuthUser | null;
  activePage: 'overview' | 'analytics' | 'team' | 'projects' | 'messages' | 'notifications' | 'settings';
  metrics: SystemMetrics;
  activities: ActivityLog[];
  team: TeamMember[];
  projects: Project[];
  chatHistory: ChatMessage[];
  notifications: FeedbackNotification[];
}
