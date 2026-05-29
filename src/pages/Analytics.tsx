import { useState } from "react";
import { useApp } from "../context/AppContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  RefreshCcw, 
  Calendar,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
  Search
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { motion } from "motion/react";

export default function Analytics() {
  const { metrics, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'financial' | 'latency' | 'telemetry'>('financial');
  const [dateRange, setDateRange] = useState("7d");
  const [isExporting, setIsExporting] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      addToast("Telemetry Exported", "Core analytics platform ledger downloaded to CSV format.", "success");
    }, 1500);
  };

  const dropdownIntervals = [
    { value: "24h", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last Quarter" }
  ];

  const filterMetricsModelList = [
    { id: "mod_1", name: "gemini-3.5-flash", requests: "3,124,560", latency: "142ms", cost: "$5,420.50", success: "99.98%" },
    { id: "mod_2", name: "gemini-3.1-flash-lite", requests: "1,245,110", latency: "89ms", cost: "$1,842.10", success: "99.99%" },
    { id: "mod_3", name: "imagen-4.0", requests: "48,900", latency: "1,450ms", cost: "$4,240.20", success: "99.82%" },
    { id: "mod_4", name: "legacy-finetunes", requests: "12,400", latency: "310ms", cost: "$1,120.40", success: "99.91%" }
  ].filter(m => m.name.toLowerCase().includes(searchFilter.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 uppercase">
            Platform Analytics
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            Financial telemetry, system response rates, and comparative model usage details.
          </p>
        </div>

        {/* Toolbar items */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Calendar Interval Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-950 p-1 border border-gray-100 dark:border-gray-900 rounded-md shadow-sm">
            <span className="p-1 text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
            </span>
            <Dropdown
              options={dropdownIntervals}
              selectedValue={dateRange}
              onChange={(val) => {
                setDateRange(val);
                addToast("Interval Switched", `Analytics recalculating for interval ${val}`, "info");
              }}
              className="min-w-[125px]"
            />
          </div>

          <Button 
            onClick={handleExport}
            isLoading={isExporting}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 text-xs font-semibold py-1 px-3.5 border-gray-200 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            <span>EXPORT WORKSPACE Reports</span>
          </Button>

          <Button
            onClick={() => addToast("Database Refreshed", "Latest telemetry indices synchronized.", "success")}
            variant="secondary"
            size="sm"
            className="p-2 border border-gray-250/20 shadow-sm"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* SEGMENTED TABS CONTROLLER */}
      <div className="flex gap-2 border-b border-gray-150 dark:border-gray-900 pb-px">
        <button
          onClick={() => setActiveTab('financial')}
          className={`px-4 py-2.5 text-xs font-bold uppercase transition-all relative ${
            activeTab === 'financial' 
              ? "text-blue-500 font-bold" 
              : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          <span>SaaS Financials</span>
          {activeTab === 'financial' && (
            <motion.div layoutId="track_active_tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('latency')}
          className={`px-4 py-2.5 text-xs font-bold uppercase transition-all relative ${
            activeTab === 'latency' 
              ? "text-blue-500 font-bold" 
              : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          <span>Response latency Metrics</span>
          {activeTab === 'latency' && (
            <motion.div layoutId="track_active_tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
      </div>

      {/* RENDER DYNAMIC CHARTS BASED ON TAB SELECT */}
      {activeTab === 'financial' ? (
        <div className="grid grid-cols-1 gap-6">
          <Card 
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>SaaS Revenue Ledger and Cumulative Operational Cost</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">VALUES IN USD</span>
              </div>
            }
          >
            <div className="h-80 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={metrics.revenueHistory}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.01}/>
                    </linearGradient>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" strokeOpacity={0.06} />
                  <XAxis 
                    dataKey="name" 
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
                      fontSize: '11px', 
                      border: '1px solid #1f2937',
                      color: '#fff' 
                    }} 
                  />
                  <Legend verticalAlign="top" height={36} iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Subscription MRR" 
                    stroke="#10B981" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cost" 
                    name="Tokens Expenditure" 
                    stroke="#8B5CF6" 
                    fillOpacity={1} 
                    fill="url(#colorCost)" 
                    strokeWidth={1.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center gap-3 bg-blue-500/[0.03] border border-blue-500/10 p-3.5 rounded mt-4">
              <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <p className="text-[11px] text-gray-500">
                Nexus Financial model: Operational gross margin for model pipelines is currently averaging **89.33%**, keeping subscription accounts highly profitable.
              </p>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card 
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Avg API Model Latency historical ledger</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">VALUES IN MILLISECONDS</span>
              </div>
            }
          >
            <div className="h-80 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={metrics.latencyHistory}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" strokeOpacity={0.06} />
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
                      fontSize: '11px', 
                      color: '#fff',
                      border: '1px solid #1f2937'
                    }} 
                  />
                  <Bar 
                    dataKey="value" 
                    name="API Latency" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-3 bg-emerald-500/[0.03] border border-emerald-500/10 p-3.5 rounded mt-4">
              <AlertCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <p className="text-[11px] text-gray-500">
                Our global edge caching policy reduced processing latency by **16.2%** as compared to last week benchmarks. Peak processing SLA remains fully backed.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* METRIC BREAKDOWN TABLE */}
      <Card 
        header={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-500" />
              <span>Comparative Downstream Model Usage</span>
            </div>
            
            {/* Table internal filtering panel */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              <input 
                type="text" 
                placeholder="Search models..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 pr-2.5 py-1 text-[11px] rounded border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 font-sans outline-none focus:border-blue-500"
              />
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-900 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-900/10">
                <th className="px-4 py-3">Model Name</th>
                <th className="px-4 py-3 text-right">API Calls</th>
                <th className="px-4 py-3 text-right">Avg Latency</th>
                <th className="px-4 py-3 text-right">Total Opex</th>
                <th className="px-4 py-3 text-right">Success Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-900/80 text-xs text-gray-700 dark:text-gray-300">
              {filterMetricsModelList.length > 0 ? (
                filterMetricsModelList.map((model) => (
                  <tr key={model.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10 transition-colors">
                    <td className="px-4 py-3 font-semibold font-mono text-gray-900 dark:text-white">{model.name}</td>
                    <td className="px-4 py-3 text-right">{model.requests}</td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-500">{model.latency}</td>
                    <td className="px-4 py-3 text-right font-semibold">{model.cost}</td>
                    <td className="px-4 py-3 text-right text-emerald-500">{model.success}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 dark:text-gray-600">
                    No matching model records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
