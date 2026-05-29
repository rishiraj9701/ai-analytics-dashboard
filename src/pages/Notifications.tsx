import { useApp } from "../context/AppContext";
import Card from "../components/Card";
import Button from "../components/Button";
import { 
  Bell, 
  Check, 
  AlertTriangle, 
  Info, 
  AlertCircle,
  Sparkles,
  Trash2
} from "lucide-react";

export default function Notifications() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, addToast } = useApp();

  const iconMapper = {
    info: <Info className="w-4 h-4 text-blue-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse-slow" />,
    success: <Check className="w-4 h-4 text-emerald-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />
  };

  const borderThemes = {
    info: "border-blue-500/10 bg-white dark:bg-gray-950",
    warning: "border-amber-500/15 bg-amber-500/[0.01]",
    success: "border-emerald-500/10 bg-white dark:bg-gray-950",
    error: "border-red-500/15 bg-red-500/[0.01]"
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 uppercase">
            Notifications ledger
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium font-sans">
            Review audit announcements, model gateway violations, and collaborative workspaces invitations.
          </p>
        </div>

        {notifications.some(n => !n.read) && (
          <Button
            onClick={markAllNotificationsAsRead}
            variant="outline"
            className="flex items-center gap-1.5 font-bold py-1.5 text-xs shadow-sm border-gray-250/20"
          >
            <Check className="w-3.5 h-3.5" />
            <span>MARK ALL READ</span>
          </Button>
        )}
      </div>

      {/* CHRONOLOGICAL CARDS LIST */}
      <div className="flex flex-col gap-3 max-w-2xl">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 border rounded-lg transition-all flex items-start gap-4 shadow-sm relative overflow-hidden ${
                borderThemes[notif.type]
              } ${!notif.read ? "border-l-2 border-l-blue-530 border-l-blue-500" : ""}`}
            >
              
              <div className="flex-shrink-0 p-2 bg-gray-50/50 dark:bg-gray-900/30 rounded-lg border border-gray-100 dark:border-gray-900">
                {iconMapper[notif.type]}
              </div>

              <div className="flex-1 flex flex-col gap-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-50 uppercase tracking-wide">
                    {notif.title}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 font-mono">
                    {notif.timestamp}
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal font-medium mt-0.5">
                  {notif.message}
                </p>
                
                {!notif.read && (
                  <button
                    onClick={() => {
                      markNotificationAsRead(notif.id);
                      addToast("Marked Read", "Acknowledged system alert.", "info");
                    }}
                    className="text-[10px] text-blue-500 hover:text-blue-600 font-bold self-start mt-2 hover:underline focus:outline-none"
                  >
                    Mark as acknowledged
                  </button>
                )}
              </div>

            </div>
          ))
        ) : (
          <Card className="p-8 text-center flex flex-col items-center justify-center gap-2">
            <Bell className="w-8 h-8 text-gray-400/60" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Workspace alerts cleared</span>
            <p className="text-xs text-gray-400 leading-normal max-w-sm">
              Any security telemetry audits or token exceptions will appear here as they are detected.
            </p>
          </Card>
        )}
      </div>

    </div>
  );
}
