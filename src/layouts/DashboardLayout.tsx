import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Search,
  User,
  Shield,
  HelpCircle,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { 
    theme, 
    toggleTheme, 
    user, 
    logout, 
    activePage, 
    setActivePage,
    notifications,
    markAllNotificationsAsRead,
    addToast
  } = useApp();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'messages', label: 'AI Assistant', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setIsMobileOpen(false);
  };

  const currentLocalTimeStr = "16:01 UTC";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-150 flex flex-row transition-colors duration-300">
      
      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 sticky top-0 h-screen z-20">
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white shadow-md text-sm">
              N
            </div>
            <span className="text-sm font-bold tracking-tight text-gray-900 dark:text-gray-50 uppercase">
              Nexus Analytics
            </span>
          </div>
          <div className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-1.5 py-0.5 rounded border border-blue-500/20">
            SaaS
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold rounded-md transition-all duration-200 group relative ${
                  isActive 
                    ? "bg-blue-600 border border-blue-500 text-white shadow-sm" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform ${isActive ? "scale-105" : "group-hover:scale-105"}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === "messages" && (
                  <span className="text-[9px] bg-purple-500/25 text-purple-600 dark:text-purple-300 px-1 py-0.5 rounded font-bold uppercase shrink-0">
                    Live
                  </span>
                )}
                {item.badge && item.badge > 0 ? (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'}`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Workspace Quick-State */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-900/50 flex flex-col gap-2 bg-gray-50/50 dark:bg-gray-900/10">
          <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
            <Clock className="w-3 h-3 text-gray-400" />
            <span>Time: 16:01 UTC</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse-slow" />
            <span className="text-[10px] font-bold tracking-tight text-gray-500 dark:text-gray-400 uppercase">
              All Pipelines Green
            </span>
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-[1px]"
            />

            {/* Sidebar content */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="relative w-64 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-900 h-full flex flex-col z-10"
            >
              <div className="p-5 border-b border-gray-100 dark:border-gray-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white shadow-md text-sm">
                    N
                  </div>
                  <span className="text-sm font-bold tracking-tight text-gray-900 dark:text-gray-50 uppercase">
                    Nexus
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-155 dark:hover:bg-gray-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-md transition-all ${
                        isActive 
                          ? "bg-blue-600 text-white shadow-sm font-semibold" 
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900/50 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && item.badge > 0 ? (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'}`}>
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-gray-100 dark:border-gray-900/50 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/10">
                <span className="text-[10px] font-bold text-gray-400">TELEMETRY RUNNING</span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CORE BODY WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER / TOP NAVBAR */}
        <header className="sticky top-0 z-30 flex items-center h-14 border-b border-gray-150/60 dark:border-gray-900/50 bg-white/70 dark:bg-black/60 backdrop-blur-md px-4 lg:px-6 transition-colors duration-300">
          
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-xs">
                N
              </div>
            </div>
          </div>

          {/* Quick Universal Search Interface */}
          <div className="hidden md:flex items-center relative flex-1 max-w-xs ml-4 lg:ml-0">
            <Search className="absolute left-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search workspaces... (press '/' to focus)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1 text-xs font-sans rounded-md border border-gray-200/60 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-950/45 text-gray-900 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex-1 md:none" />

          {/* Header Action Items */}
          <div className="flex items-center gap-2 lg:gap-3.5 ml-auto">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors focus:outline-none"
              title="Toggle theme mode"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Notifications Dropdown Panel */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors focus:outline-none relative"
                title="Workspace events alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full animate-pulse-slow" />
                )}
              </button>

              <AnimatePresence>
                {isNotifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-950 border border-gray-250/20 dark:border-gray-900 rounded-lg shadow-xl overflow-hidden z-40 outline-none"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-900 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-50 uppercase tracking-wide">
                        Notifications ({notifications.length})
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[10px] font-bold text-blue-500 hover:underline"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-900">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={`p-3 text-xs flex flex-col gap-0.5 transition-colors cursor-pointer ${
                              notif.read ? "bg-white dark:bg-gray-950" : "bg-blue-50/[0.15] dark:bg-blue-950/[0.05]"
                            }`}
                            onClick={() => setActivePage("notifications")}
                          >
                            <div className="flex justify-between font-semibold text-gray-950 dark:text-gray-50">
                              <span className="mr-2 truncate">{notif.title}</span>
                              <span className="text-[9px] font-medium text-gray-400 shrink-0">{notif.timestamp}</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 leading-normal">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-5 text-center text-xs text-gray-400">
                          Active alerts sandbox empty
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-55/30 dark:bg-gray-900/20 p-2 border-t border-gray-100 dark:border-gray-900 text-center">
                      <button 
                        onClick={() => {
                          setActivePage("notifications");
                          setIsNotifDropdownOpen(false);
                        }}
                        className="text-[10px] font-bold text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 uppercase"
                      >
                        View all notification histories
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown Component */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none"
              >
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                  alt="Profile Avatar"
                  className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-gray-800"
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-950 border border-gray-250/20 dark:border-gray-900 rounded-lg shadow-xl overflow-hidden z-45"
                  >
                    {/* User credentials */}
                    <div className="px-4 py-3 bg-gray-50/50 dark:bg-gray-900/10 border-b border-gray-100 dark:border-gray-900">
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-50">{user?.name || "Anonymous SaaS User"}</p>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">{user?.email || "user@example.com"}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActivePage("settings");
                          setIsProfileOpen(false);
                          addToast("Settings Navigated", "Access your customizable security fields.", "info");
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/60"
                      >
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>Profile details</span>
                      </button>
                      <button
                        onClick={() => {
                          setActivePage("settings");
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/60"
                      >
                        <Shield className="w-3.5 h-3.5 text-gray-400" />
                        <span>Workspace security</span>
                      </button>
                      <button
                        onClick={() => {
                          addToast("Help Desk Open", "Direct links to active support centers.", "info");
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/60"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                        <span>Technical documentation</span>
                      </button>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-900 py-1 bg-red-500/[0.01]">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign out of Nexus</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </header>

        {/* MAIN COMPONENT CONTENT FRAME */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {children}
          </div>
        </main>
        
      </div>

    </div>
  );
}
