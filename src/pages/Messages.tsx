import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import Card from "../components/Card";
import Button from "../components/Button";
import { 
  Send, 
  Sparkles, 
  Trash2, 
  MessageSquare, 
  Bot, 
  ShieldAlert,
  ArrowRight,
  Zap,
  Clock
} from "lucide-react";
import { motion } from "motion/react";

interface DirectChannel {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: 'online' | 'offline';
  isAi: boolean;
  unreadCount: number;
}

export default function Messages() {
  const { 
    chatHistory, 
    sendChatMessage, 
    clearChat, 
    isChatLoading,
    team,
    addToast
  } = useApp();

  const [activeChannelId, setActiveChannelId] = useState<string>("nexus_ai");
  const [inputText, setInputText] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Mapped Direct Channels list
  const docChannels: DirectChannel[] = [
    {
      id: "nexus_ai",
      name: "Nexus AI Analyst",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80",
      role: "Platform Copilot",
      status: "online",
      isAi: true,
      unreadCount: 0
    },
    ...team.map(t => ({
      id: t.id,
      name: t.name,
      avatar: t.avatar,
      role: t.role,
      status: (t.status === "active" ? "online" : "offline") as 'online' | 'offline',
      isAi: false,
      unreadCount: t.status === "pending" ? 0 : 1
    }))
  ];

  const activeChannel = docChannels.find(c => c.id === activeChannelId) || docChannels[0];

  // Simulated direct messages pool for ordinary team threads to make things look filled
  const [ordinaryThreads, setOrdinaryThreads] = useState<Record<string, Array<{ sender: string; text: string; time: string; isUser: boolean }>>>({
    "team_1": [
      { sender: "Sarah Chen", text: "Did you verify the load benchmarks on Singapore backup region?", time: "10:14 AM", isUser: false },
      { sender: "You", text: "Yes, standard proxy round-robin is holding solid at 120ms average.", time: "10:30 AM", isUser: true },
      { sender: "Sarah Chen", text: "Phenomenal! Let's schedule the main DNS propagation for tomorrow.", time: "10:32 AM", isUser: false }
    ],
    "team_2": [
      { sender: "Alex Mercer", text: "Hey! The SAML metadata signature is failing on Azure AD integration. Any tips?", time: "09:05 AM", isUser: false },
      { sender: "You", text: "Make sure you include the custom claims mapping payload in setting preferences.", time: "09:40 AM", isUser: true }
    ],
    "team_4": [
      { sender: "Elsa Frost", text: "Uploaded the revised Figma telemetry cards with glassmorphic assets. Check mockups.", time: "Yesterday", isUser: false }
    ]
  });

  // Scroll to bottom of threads when elements resize
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, activeChannelId, ordinaryThreads, isChatLoading]);

  // Submit action: direct message or AI endpoint dispatch
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const message = inputText;
    setInputText("");

    if (activeChannel.isAi) {
      // Direct dispatch to Gemini on Node back-end
      await sendChatMessage(message);
    } else {
      // Local simulated direct team messages list
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setOrdinaryThreads(prev => {
        const currentList = prev[activeChannelId] || [];
        const nextList = [
          ...currentList,
          { sender: "You", text: message, time: timestamp, isUser: true }
        ];
        return {
          ...prev,
          [activeChannelId]: nextList
        };
      });

      // Quick simulated reply after some seconds
      addToast("Message Sent", `Dispatched to ${activeChannel.name}`, "info");
      setTimeout(() => {
        setOrdinaryThreads(prev => {
          const currentList = prev[activeChannelId] || [];
          const nextList = [
            ...currentList,
            { sender: activeChannel.name, text: "Acknowledged! Reviewing telemetry dashboards right now and will get back shortly.", time: "Just now", isUser: false }
          ];
          return {
            ...prev,
            [activeChannelId]: nextList
          };
        });
        addToast("Reply Received", `Message from ${activeChannel.name}`, "success");
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 uppercase">
          Communication panel
        </h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium font-sans">
          Message team collaborators directly or ask the Gemini telemetry assistant specific questions about system costs.
        </p>
      </div>

      {/* CORE SPLIT VIEW CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-4 border border-gray-150/60 dark:border-gray-900 bg-white dark:bg-gray-950 rounded-xl overflow-hidden shadow-lg h-[64vh] min-h-[480px]">
        
        {/* LEFT COLUMN: CHANNELS LIST */}
        <div className="lg:col-span-1 border-r border-gray-150/60 dark:border-gray-900 flex flex-col bg-gray-50/20 dark:bg-black/20">
          <div className="p-4 border-b border-gray-150/60 dark:border-gray-900 flex justify-between items-center bg-gray-50/50 dark:bg-gray-950/20">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Channels</span>
            <span className="text-[10px] text-gray-400 font-mono font-bold">UTC 16:01</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
            {docChannels.map((channel) => {
              const isActive = activeChannelId === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannelId(channel.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all ${
                    isActive 
                      ? "bg-blue-600 border border-blue-500 text-white shadow" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-900/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={channel.avatar} 
                        alt={channel.name} 
                        className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-800 object-cover" 
                      />
                      {channel.status === 'online' && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-950" />
                      )}
                    </div>

                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className={`text-[11px] font-bold truncate ${isActive ? 'text-white' : 'text-gray-900 dark:text-gray-50'}`}>
                        {channel.name}
                      </span>
                      <span className={`text-[9px] truncate tracking-tight font-medium ${isActive ? 'text-blue-200' : 'text-gray-400'}`}>
                        {channel.role}
                      </span>
                    </div>
                  </div>

                  {channel.isAi ? (
                    <Bot className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white animate-bounce-slow' : 'text-blue-500'}`} />
                  ) : (
                    channel.unreadCount > 0 && !isActive && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    )
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: RECEPTIVE CHAT VIEWPORT */}
        <div className="lg:col-span-3 flex flex-col bg-white dark:bg-gray-950 h-full">
          
          {/* Viewport header */}
          <div className="p-4 border-b border-gray-150/60 dark:border-gray-900 flex items-center justify-between bg-gray-50/10 dark:bg-black/10">
            <div className="flex items-center gap-3">
              <img 
                src={activeChannel.avatar} 
                alt={activeChannel.name} 
                className="w-8 h-8 rounded-full object-cover border border-gray-100 dark:border-gray-900" 
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900 dark:text-gray-50 uppercase tracking-wide">
                  {activeChannel.name}
                </span>
                <span className="text-[10px] text-gray-400 font-semibold leading-none">{activeChannel.role}</span>
              </div>
            </div>

            {/* AI Control: clear logs */}
            {activeChannel.isAi && (
              <button
                onClick={clearChat}
                className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors focus:outline-none"
                title="Flush assistant context history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* ACTIVE THREAD MESSAGE CONTAINER */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            
            {/* If AI Channel: render server side Gemini logs */}
            {activeChannel.isAi ? (
              <>
                {chatHistory.map((item) => {
                  const isUser = item.role === "user";
                  return (
                    <div 
                      key={item.id} 
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`p-4 rounded-xl text-xs leading-relaxed max-w-[85%] border shadow-sm ${
                        isUser 
                          ? 'bg-blue-600 border-blue-500 text-white rounded-br-none' 
                          : 'bg-gray-50/50 dark:bg-gray-900/30 border-gray-100 dark:border-gray-900 text-gray-800 dark:text-gray-150 rounded-bl-none'
                      }`}>
                        
                        {!isUser && (
                          <div className="flex items-center gap-1 mb-2 font-bold text-blue-500 uppercase text-[9px] tracking-wider">
                            <Sparkles className="w-3 h-3 text-blue-500 fill-blue-500 animate-pulse" />
                            <span>Telemetry insight response</span>
                          </div>
                        )}

                        {/* Render simple simulation tag */}
                        {item.id.includes("init") && (
                          <div className="mb-2 bg-blue-500/15 border border-blue-500/20 rounded p-2 text-[10px] leading-snug text-blue-600 dark:text-blue-300">
                            🔒 **Protected server network proxy active**: Data indices are bound locally. Messages are parsed securely server-side before execution.
                          </div>
                        )}

                        <span dangerouslySetInnerHTML={{ 
                          __html: item.text
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>')
                            .replace(/\n/g, '<br/>')
                        }} />

                        <div className="flex items-center justify-end gap-1 text-[8px] text-gray-400 font-semibold mt-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{item.timestamp}</span>
                        </div>

                      </div>
                    </div>
                  );
                })}

                {/* AI RESPONDING LOADING STATE */}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="p-4 rounded-xl text-xs bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-900 text-gray-500 rounded-bl-none flex flex-col gap-2">
                      <div className="flex items-center gap-1 text-[9px] font-bold text-blue-500 uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-blue-500 animate-spin" />
                        <span>Generating Gemini insights...</span>
                      </div>
                      
                      {/* Responsive loading pulse dots */}
                      <div className="flex gap-1.5 py-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Else: ordinary simulated template direct messages
              (ordinaryThreads[activeChannelId] || []).map((item, idx) => {
                const isUser = item.isUser;
                return (
                  <div 
                    key={idx} 
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`p-3.5 rounded-xl text-xs leading-relaxed max-w-[80%] border shadow-sm ${
                      isUser 
                        ? 'bg-blue-600 border-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-50/40 dark:bg-gray-900/20 border-gray-100 dark:border-gray-900 text-gray-700 dark:text-gray-300 rounded-bl-none'
                    }`}>
                      <p>{item.text}</p>
                      <span className="text-[8px] text-gray-400 mt-1 block text-right">{item.time}</span>
                    </div>
                  </div>
                );
              })
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* BOTTOM FORM INPUT ACTION BAR */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-150/60 dark:border-gray-900 flex gap-2">
            <input
              type="text"
              placeholder={activeChannel.isAi ? "Ask about model latency, active SLA revenue, budgets..." : `Send direct message to ${activeChannel.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full text-xs font-sans rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-950 px-3.5 py-2.5 text-gray-900 dark:text-gray-150 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner"
            />
            
            <Button
              type="submit"
              size="md"
              disabled={!inputText.trim() || isChatLoading}
              className="flex-shrink-0 font-bold flex items-center gap-1 py-2"
            >
              <span>SEND</span>
              <Send className="w-3.5 h-3.5 text-white" />
            </Button>
          </form>

        </div>

      </div>

    </div>
  );
}
