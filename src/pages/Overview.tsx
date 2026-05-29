import { useState } from "react";
import { useApp } from "../context/AppContext";
import Card from "../components/Card";
import Button from "../components/Button";
import { 
  Users, 
  Cpu, 
  DollarSign, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { motion } from "motion/react";

export default function Overview() {
  const { 
    metrics, 
    activities, 
    aiInsights, 
    fetchAIInsights, 
    isGeneratingInsights, 
    insightsSimulated,
    setActivePage
  } = useApp();

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Stats mapped for cards
  const statsList = [
    {
      id: "dau",
      label: "Daily Active Users",
      value: metrics.dau.toLocaleString(),
      trend: metrics.dauTrend,
      isPositive: true,
      description: "Active API user accounts",
      icon: Users,
      color: "text-blue-500 bg-blue-55/10 bg-blue-500/10"
    },
    {
      id: "latency",
      label: "Avg model latency",
      value: `${metrics.latency}ms`,
      trend: metrics.latencyTrend,
      isPositive: true, // as negative latency is positive
      description: "Internal gateway processing SLA",
      icon: Cpu,
      color: "text-emerald-500 bg-emerald-500/10"
    },
    {
      id: "cost",
      label: "AI Platform Cost",
      value: `$${(metrics.cost / 1000).toFixed(1)}K`,
      trend: metrics.costTrend,
      isPositive: false,
      description: "Downstream API token utilization",
      icon: DollarSign,
      color: "text-amber-500 bg-amber-500/10"
    },
    {
      id: "successRate",
      label: "Pipeline Success",
      value: `${metrics.successRate}%`,
      trend: "100% SLA",
      isPositive: true,
      description: "Successful response delivery rate",
      icon: Activity,
      color: "text-purple-500 bg-purple-500/10"
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 uppercase">
            Overview
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            SaaS pipeline diagnostics, analytical graphs, and model performance.
          </p>
        </div>
        
        {/* Date Selector Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-gray-500 bg-white dark:bg-gray-950 px-3.5 py-1.5 border border-gray-100 dark:border-gray-900 rounded-md shadow-sm">
          <span>Active Window: Last 7 Days</span>
        </div>
      </div>

      {/* STATS BENTO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsList.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              onMouseEnter={() => setHoveredCard(stat.id)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 p-5 rounded-lg shadow-sm relative flex flex-col gap-2 overflow-hidden group hover:shadow-md transition-all cursor-pointer"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Value and Trend */}
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                  {stat.value}
                </span>
                <span className={`text-[10px] font-bold flex items-center gap-0.5 ${stat.isPositive ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </span>
              </div>

              {/* Sub-description */}
              <p className="text-[11px] text-gray-400 font-medium">{stat.description}</p>
              
              {/* Subtle underline color animation on card hover */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </motion.div>
          );
        })}
      </div>

      {/* MID SECTION - CHARTS AND GEMINI INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Line graph (occupies 2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card 
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span>Interactive System Telemetry Trends</span>
                </div>
                <span className="text-[10px] font-semibold text-gray-400">DAILY USAGE (DAU)</span>
              </div>
            }
          >
            <div className="h-64 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={metrics.dauHistory}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" strokeOpacity={0.07} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9ca3af" 
                    fontSize={10} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.85)', 
                      borderRadius: '6px', 
                      border: '1px solid #1f2937',
                      fontSize: '11px',
                      color: '#fff'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Daily active users"
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#3B82F6', strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-900 mt-4 pt-3.5">
              <span className="text-[10px] text-gray-400">Total volume is tracking ahead of projected Monthly Active limit.</span>
              <button 
                onClick={() => setActivePage("analytics")}
                className="text-[10px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-0.5 hover:underline"
              >
                <span>Deep telemetry views</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        </div>

        {/* SECURE GEMINI SAAS INSIGHTS PANEL */}
        <div className="flex flex-col">
          <Card 
            className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50/20 dark:from-gray-950 dark:to-black/30 border-blue-500/... dark:border-blue-900/30"
            header={
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500 fill-blue-500 animate-pulse" />
                <span className="uppercase text-xs font-bold tracking-widest text-[#3B82F6]">Gemini AI Insights</span>
              </div>
            }
          >
            <div className="flex flex-col gap-4 h-full justify-between">
              
              {/* Introduction Text */}
              <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans flex flex-col gap-3">
                <p>
                  Nexus AI analyzes backend system logs, database states, and active cost margins in real-time.
                </p>

                {/* Simulated indication banner */}
                {insightsSimulated && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded p-2 text-[10px] flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Operating in localized fallback mode. Credentials not mounted.</span>
                  </div>
                )}

                {/* Insights Listing wrapper */}
                <div className="flex flex-col gap-2.5 mt-2 max-h-56 overflow-y-auto pr-1">
                  {aiInsights.map((ins, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className="bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-900 p-2.5 rounded text-[11px] leading-normal"
                    >
                      {/* Check if markdown text and style roughly */}
                      <span dangerouslySetInnerHTML={{ 
                        __html: ins
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>')
                          .replace(/📈/g, '📈')
                          .replace(/⚡/g, '⚡')
                          .replace(/👥/g, '👥')
                      }} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Insights CTA */}
              <div className="border-t border-gray-100 dark:border-gray-900/50 pt-3 mt-4">
                <Button
                  onClick={fetchAIInsights}
                  isLoading={isGeneratingInsights}
                  className="w-full text-xs py-1.5 flex items-center gap-2 justify-center font-bold"
                  variant="primary"
                >
                  <Zap className="w-3.5 h-3.5 text-white animate-bounce-slow" />
                  <span>GENERATE LIVE INSIGHTS</span>
                </Button>
              </div>

            </div>
          </Card>
        </div>

      </div>

      {/* LOWER SECTION - MODEL DISTRIBUTION AND ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Model Distribution circular chart (1 col) */}
        <div>
          <Card header="Gemini API Model Allocation">
            <div className="h-44 flex flex-col items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.aiModelsAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {metrics.aiModelsAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.85)', 
                      borderRadius: '6px', 
                      fontSize: '11px', 
                      color: '#fff' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Abs center overlay label */}
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Main</span>
                <span className="text-sm font-extrabold text-[#3B82F6]">gemini-3.5</span>
              </div>
            </div>

            {/* Model legend listing */}
            <div className="flex flex-col gap-1.5 border-t border-gray-100 dark:border-gray-900/50 pt-3.5 mt-2">
              {metrics.aiModelsAllocation.map((model) => (
                <div key={model.name} className="flex items-center justify-between text-[11px] font-medium text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: model.color }} />
                    <span className="font-mono text-gray-600 dark:text-gray-400">{model.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{model.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activities feed (occupies 2 cols) */}
        <div className="lg:col-span-2">
          <Card header="Recent Workspace Activities">
            <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
              {activities.map((log) => {
                const statusTheme = {
                  success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                  warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
                  error: "bg-red-500/10 text-red-500 border-red-500/20",
                  info: "bg-blue-500/10 text-blue-500 border-blue-500/20"
                };

                return (
                  <div 
                    key={log.id} 
                    className="flex items-start gap-4 p-3 border border-gray-100 dark:border-gray-900 rounded-lg bg-white dark:bg-gray-950 hover:bg-gray-50/50 dark:hover:bg-gray-900/10 transition-colors"
                  >
                    {/* Log Status Label or Creator Photo */}
                    <div className="flex-shrink-0">
                      {log.avatarUrl ? (
                        <img 
                          src={log.avatarUrl} 
                          alt={log.user} 
                          className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-900 object-cover" 
                        />
                      ) : (
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs uppercase ${statusTheme[log.status]}`}>
                          {log.user.substring(0, 2)}
                        </div>
                      )}
                    </div>

                    {/* Log message body */}
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-50">
                          {log.user}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-400 font-mono">
                          {log.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-550 dark:text-gray-400 select-none">
                        {log.description}
                      </p>
                    </div>

                    <div className="flex-shrink-0 self-center">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${statusTheme[log.status]}`}>
                        {log.type}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
