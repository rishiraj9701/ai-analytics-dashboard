import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  SystemMetrics, 
  ActivityLog, 
  TeamMember, 
  Project, 
  ChatMessage, 
  FeedbackNotification, 
  AuthUser 
} from "../types";

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: AuthUser | null;
  login: (email: string, name: string) => Promise<boolean>;
  signup: (email: string, name: string) => Promise<boolean>;
  logout: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
  metrics: SystemMetrics;
  activities: ActivityLog[];
  team: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id' | 'avatar' | 'tasksCompleted'>) => void;
  removeTeamMember: (id: string) => void;
  projects: Project[];
  addProject: (name: string, description: string, lead: string, priority: 'Low' | 'Medium' | 'High') => void;
  toggleTaskStatus: (projectId: string, taskId: string) => void;
  chatHistory: ChatMessage[];
  sendChatMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  isChatLoading: boolean;
  notifications: FeedbackNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  toasts: Array<{ id: string; title: string; message: string; type: 'success' | 'info' | 'warning' | 'error' }>;
  addToast: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  aiInsights: string[];
  fetchAIInsights: () => Promise<void>;
  isGeneratingInsights: boolean;
  insightsSimulated: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialMetrics: SystemMetrics = {
  dau: 12450,
  dauTrend: "+12.4%",
  dauHistory: [
    { date: "May 23", value: 10100 },
    { date: "May 24", value: 10800 },
    { date: "May 25", value: 11200 },
    { date: "May 26", value: 11500 },
    { date: "May 27", value: 12050 },
    { date: "May 28", value: 11950 },
    { date: "May 29", value: 12450 }
  ],
  latency: 142,
  latencyTrend: "-4.2%",
  latencyHistory: [
    { date: "May 23", value: 165 },
    { date: "May 24", value: 158 },
    { date: "May 25", value: 152 },
    { date: "May 26", value: 147 },
    { date: "May 27", value: 145 },
    { date: "May 28", value: 143 },
    { date: "May 29", value: 142 }
  ],
  cost: 14200,
  costTrend: "+8.6%",
  costHistory: [
    { date: "May 23", value: 13200 },
    { date: "May 24", value: 13400 },
    { date: "May 25", value: 13650 },
    { date: "May 26", value: 13900 },
    { date: "May 27", value: 14050 },
    { date: "May 28", value: 14120 },
    { date: "May 29", value: 14200 }
  ],
  successRate: 99.96,
  errorRate: 0.04,
  activeIncidents: 0,
  projectCount: 5,
  revenue: 142500,
  revenueTrend: "+8.2%",
  revenueHistory: [
    { name: "Jan", revenue: 85000, cost: 8900 },
    { name: "Feb", revenue: 94000, cost: 9500 },
    { name: "Mar", revenue: 108000, cost: 11200 },
    { name: "Apr", revenue: 121000, cost: 12400 },
    { name: "May", revenue: 142500, cost: 14200 }
  ],
  aiModelsAllocation: [
    { name: "gemini-3.5-flash", value: 65, color: "#3B82F6" },
    { name: "gemini-3.1-flash-lite", value: 20, color: "#10B981" },
    { name: "imagen-4.0", value: 10, color: "#8B5CF6" },
    { name: "legacy-models", value: 5, color: "#EF4444" }
  ]
};

const initialActivities: ActivityLog[] = [
  {
    id: "act_1",
    type: "deploy",
    user: "Sarah Chen",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    description: "Shipped Analytics Export SDK v2 deployment to main production nodes.",
    time: "2 hours ago",
    status: "success"
  },
  {
    id: "act_2",
    type: "api_call",
    user: "Automation bot",
    description: "Peak concurrency benchmark test completed on model cluster.",
    time: "4 hours ago",
    status: "info"
  },
  {
    id: "act_3",
    type: "user_join",
    user: "Alex Mercer",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    description: "Joined the engineering workspace through OAuth token grant.",
    time: "6 hours ago",
    status: "success"
  },
  {
    id: "act_4",
    type: "incident",
    user: "Billing Agent",
    description: "AI operation costs exceeded 90% of projected monthly allowance.",
    time: "1 day ago",
    status: "warning"
  },
  {
    id: "act_5",
    type: "milestone",
    user: "Daniel K.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    description: "Enterprise Subscription signed by Acme Corp. Standard billing applied.",
    time: "2 days ago",
    status: "success"
  }
];

const initialTeam: TeamMember[] = [
  {
    id: "team_1",
    name: "Sarah Chen",
    email: "sarah.chen@nexus-ai.com",
    role: "Owner",
    status: "active",
    performance: 98,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    tasksCompleted: 42
  },
  {
    id: "team_2",
    name: "Alex Mercer",
    email: "alex.mercer@nexus-ai.com",
    role: "Developer",
    status: "active",
    performance: 94,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    tasksCompleted: 31
  },
  {
    id: "team_3",
    name: "Daniel K.",
    email: "daniel.k@nexus-ai.com",
    role: "Product Manager",
    status: "active",
    performance: 89,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    tasksCompleted: 18
  },
  {
    id: "team_4",
    name: "Elsa Frost",
    email: "elsa.frost@nexus-ai.com",
    role: "UI/UX Designer",
    status: "active",
    performance: 95,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
    tasksCompleted: 24
  },
  {
    id: "team_5",
    name: "James Miller",
    email: "james.m@nexus-ai.com",
    role: "Developer",
    status: "pending",
    performance: 0,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80",
    tasksCompleted: 0
  }
];

const initialProjects: Project[] = [
  {
    id: "proj_1",
    name: "AI Core Gateway",
    description: "Main reverse proxy service routed to balance multiple downstream model instances dynamically.",
    lead: "Sarah Chen",
    progress: 85,
    status: "Active",
    priority: "High",
    tasks: [
      { id: "task_1_1", title: "Configure secondary backup clusters in Singapore", assignedTo: "Alex Mercer", status: "In Progress", priority: "Medium" },
      { id: "task_1_2", title: "Complete load testing up to 10k RPS", assignedTo: "Sarah Chen", status: "Done", priority: "High" },
      { id: "task_1_3", title: "Implement key caching headers", assignedTo: "Alex Mercer", status: "Todo", priority: "Low" }
    ]
  },
  {
    id: "proj_2",
    name: "Enterprise Workspace SSO",
    description: "SAML and OpenID Connect identity federation layer for streamlined authentication.",
    lead: "Alex Mercer",
    progress: 40,
    status: "Active",
    priority: "Medium",
    tasks: [
      { id: "task_2_1", title: "Verify metadata parsing against Azure AD", assignedTo: "Alex Mercer", status: "In Progress", priority: "High" },
      { id: "task_2_2", title: "Design login interface for Enterprise users", assignedTo: "Elsa Frost", status: "Done", priority: "Medium" },
      { id: "task_2_3", title: "Write audit logging specs for workspace actions", assignedTo: "Daniel K.", status: "Todo", priority: "Low" }
    ]
  },
  {
    id: "proj_3",
    name: "Analytics Export SDK v2",
    description: "Client side lightweight library supporting real-time chart synchronization directly onto custom websites.",
    lead: "Sarah Chen",
    progress: 100,
    status: "Shipped",
    priority: "Low",
    tasks: [
      { id: "task_3_1", title: "Write technical documentation for developer website", assignedTo: "Daniel K.", status: "Done", priority: "Medium" },
      { id: "task_3_2", title: "Minimize bundle size to less than 25kb", assignedTo: "Sarah Chen", status: "Done", priority: "High" }
    ]
  }
];

const initialNotifications: FeedbackNotification[] = [
  {
    id: "notif_1",
    title: "System Latency Elevated",
    message: "Regional API response latency bumped beyond 200ms temporarily.",
    type: "warning",
    timestamp: "10 minutes ago",
    read: false
  },
  {
    id: "notif_2",
    title: "Project Milestone Reached",
    message: "Analytics Export SDK v2 has been completely shipped to npm.",
    type: "success",
    timestamp: "2 hours ago",
    read: false
  },
  {
    id: "notif_3",
    title: "New Team Member Invited",
    message: "James Miller invited to the workspace under Developer permissions.",
    type: "info",
    timestamp: "1 day ago",
    read: true
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  // Theme state: defaults to dark for premium SaaS feel
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem("nexus_theme");
    return (saved as 'light' | 'dark') || 'dark';
  });

  // User state (null to start with, redirecting to Auth page; can pre-log in for convenience)
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem("nexus_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [activePage, setActivePage] = useState<string>("overview");

  // Dynamic lists
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [notifications, setNotifications] = useState<FeedbackNotification[]>(initialNotifications);
  
  // Custom toast notifications for visual feedback
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; message: string; type: 'success' | 'info' | 'warning' | 'error' }>>([]);

  // AI Insights states
  const [aiInsights, setAiInsights] = useState<string[]>([
    "📈 **Analytics Engine Loaded**: Click the 'Generate Live Insights' button to query server-side telemetry filters.",
    "✨ **Operational Cost Insight**: Our monthly spend is within 5% of our limit. Requesting cache policies is highly encouraged."
  ]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [insightsSimulated, setInsightsSimulated] = useState(false);

  // AI Assistant Chatbot state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "chat_init",
      role: "model",
      text: "Hello! I am your Nexus AI SaaS Telemetry Analyst. I have deep context about your team members, active engineering projects, and real-time latency indicators. What details can I analyze for you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Sync theme with HTML class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem("nexus_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    addToast("Theme Changed", `Dashboard set to ${theme === 'light' ? 'Dark' : 'Light'} mode`, "info");
  };

  // Toast actions
  const addToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    const id = "toast_" + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    // Auto remove after 4s
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth operations
  const login = async (email: string, name: string): Promise<boolean> => {
    try {
      const mockUser: AuthUser = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        name: name || "Demo User",
        email: email,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        role: "Workspace Administrator"
      };
      setUser(mockUser);
      localStorage.setItem("nexus_user", JSON.stringify(mockUser));
      addToast("Authentication Successful", `Welcome back, ${mockUser.name}!`, "success");
      setActivePage("overview");
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (email: string, name: string): Promise<boolean> => {
    return login(email, name);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nexus_user");
    addToast("Logged Out", "You have successfully signed out of the workspace.", "info");
  };

  // Team operations
  const addTeamMember = (member: Omit<TeamMember, 'id' | 'avatar' | 'tasksCompleted'>) => {
    const newMember: TeamMember = {
      ...member,
      id: "team_" + (team.length + 1),
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
      tasksCompleted: 0
    };
    setTeam(prev => [...prev, newMember]);
    addToast("Team Member Invited", `${member.name} has been notified.`, "success");
    
    // Add activity log
    const newAct: ActivityLog = {
      id: "act_" + Math.random().toString(36).substring(2, 9),
      type: "user_join",
      user: member.name,
      description: `Invited as ${member.role} with permissions.`,
      time: "Just now",
      status: "info"
    };
    setProjects(prev => {
      // Create new list
      return prev;
    });
  };

  const removeTeamMember = (id: string) => {
    const target = team.find(t => t.id === id);
    if (target) {
      setTeam(prev => prev.filter(t => t.id !== id));
      addToast("Member Removed", `${target.name} is no longer part of this workspace.`, "warning");
    }
  };

  // Project actions
  const addProject = (name: string, description: string, lead: string, priority: 'Low' | 'Medium' | 'High') => {
    const newProject: Project = {
      id: "proj_" + (projects.length + 1),
      name,
      description,
      lead,
      progress: 0,
      status: "Active",
      priority,
      tasks: []
    };
    setProjects(prev => [...prev, newProject]);
    addToast("Project Created", `${name} is successfully initialized.`, "success");
  };

  const toggleTaskStatus = (projectId: string, taskId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updatedTasks = p.tasks.map(t => {
          if (t.id === taskId) {
            const nextStatus = t.status === "Done" ? "Todo" : "Done" as any;
            return { ...t, status: nextStatus };
          }
          return t;
        });
        
        // Recalculate progress based on 'Done' tasks
        const doneCount = updatedTasks.filter(t => t.status === "Done").length;
        const nextProgress = updatedTasks.length ? Math.round((doneCount / updatedTasks.length) * 100) : 0;
        
        return {
          ...p,
          tasks: updatedTasks,
          progress: nextProgress
        };
      }
      return p;
    }));
  };

  // Fetch AI Actionable Insights
  const fetchAIInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics: initialMetrics })
      });
      const data = await response.json();
      if (data.success && data.insights) {
        setAiInsights(data.insights);
        setInsightsSimulated(!!data.isSimulated);
        addToast("Insights Generated", "Successfully synthesized platform metrics via Gemini API.", "success");
      } else {
        throw new Error("Invalid insights feedback model.");
      }
    } catch (err: any) {
      console.error(err);
      addToast("Generation Error", "AI backend is unreachable. Utilizing core analytical models.", "error");
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  // Send Chat message to AI Data Assistant
  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: "msg_" + Math.random().toString(36).substring(2, 9),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      // Map current chat history for backend (avoid sending system instruction)
      const mappedHistory = chatHistory
        .filter(c => c.id !== "chat_init")
        .map(h => ({
          role: h.role,
          text: h.text
        }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: mappedHistory })
      });

      const data = await res.json();
      if (data.success) {
        const modelMessage: ChatMessage = {
          id: "msg_" + Math.random().toString(36).substring(2, 9),
          role: 'model',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev, modelMessage]);
      } else {
        throw new Error(data.error || "Generation error");
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: "msg_err_" + Math.random().toString(36).substring(2, 9),
        role: 'model',
        text: "⚡ **Network Connection Anomaly**: The server-side Gemini gateway is currently experiencing congestion. Please try sending your query again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([
      {
        id: "chat_init",
        role: "model",
        text: "Chat memory cleared successfully. Ready for new telemetry questions!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast("Notifications Cleared", "All platform warnings and announcements marked as read.", "success");
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      user,
      login,
      signup,
      logout,
      activePage,
      setActivePage,
      metrics: initialMetrics,
      activities: initialActivities,
      team,
      addTeamMember,
      removeTeamMember,
      projects,
      addProject,
      toggleTaskStatus,
      chatHistory,
      sendChatMessage,
      clearChat,
      isChatLoading,
      notifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      toasts,
      addToast,
      removeToast,
      aiInsights,
      fetchAIInsights,
      isGeneratingInsights,
      insightsSimulated
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used inside an AppProvider context hierarchy.");
  }
  return context;
}
