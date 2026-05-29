import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Dropdown from "../components/Dropdown";
import { 
  Settings, 
  User, 
  Bell, 
  Key, 
  Check, 
  Globe, 
  ShieldAlert, 
  Mail,
  HelpCircle
} from "lucide-react";

export default function SettingsPage() {
  const { user, theme, toggleTheme, addToast } = useApp();

  // Profile fields state
  const [profileName, setProfileName] = useState(user?.name || "Demo Administrator");
  const [profileEmail, setProfileEmail] = useState(user?.email || "admin@nexus-ai.com");
  const [permissionLevel, setPermissionLevel] = useState("admin");

  // Notifications checkboxes state
  const [notifInvocations, setNotifInvocations] = useState(true);
  const [notifCostSpikes, setNotifCostSpikes] = useState(true);
  const [notifWeeklyLedger, setNotifWeeklyLedger] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      addToast("Profile Saved", "Workspace profile metadata successfully updated on edge keys.", "success");
    }, 1200);
  };

  const activeModelsKeys = [
    { name: "NEXUS_MAIN_TOKEN", value: "sk_live_51P...a8b5e", access: "Read/Write", created: "05/12/2026" },
    { name: "GEMINI_SERVER_SECRET", value: "sk_live_9a...71fa8", access: "Immutable", created: "Yesterday" }
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER PAGE SECTION */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 uppercase">
          Workspace settings
        </h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium font-sans">
          Configure profile metadata, regulate telemetry exception digests, toggle layouts, and retrieve active credentials tokens.
        </p>
      </div>

      {/* THREE PANES FLEX LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FIRST PANE - PERSONAL METADATA */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card header="Personal Profile Metadata">
            <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Workspace Name"
                  placeholder="Demo Client"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  leftIcon={<User className="w-4 h-4 text-gray-400" />}
                />

                <Input
                  label="Secured Email address"
                  type="email"
                  placeholder="user@example.com"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
                />
              </div>

              <Dropdown
                label="Workspace Permission Level"
                options={[
                  { value: "admin", label: "Workspace Administrator" },
                  { value: "developer", label: "Core Developer permissions" },
                  { value: "viewer", label: "Read-only workspace telemetry" }
                ]}
                selectedValue={permissionLevel}
                onChange={(val) => setPermissionLevel(val)}
              />

              <div className="flex items-center justify-end border-t border-gray-100 dark:border-gray-900/50 pt-4 mt-2">
                <Button
                  type="submit"
                  size="sm"
                  isLoading={savingProfile}
                  className="px-4 text-xs font-bold"
                >
                  <Check className="w-3.5 h-3.5 text-white mr-1.5" />
                  <span>SAVE CHANGES</span>
                </Button>
              </div>

            </form>
          </Card>

          {/* TELEMETRY CREDENTIALS TOKENS CARD */}
          <Card header="Access Tokens ledger">
            <div className="font-sans text-xs flex flex-col gap-4"> 
              
              <div className="bg-blue-500/[0.015] border border-blue-500/10 rounded p-3 flex gap-3 items-start">
                <Key className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  These tokens authorize external micro-services to poll this database's model cost endpoints securely. Keep secret credentials safe.
                </p>
              </div>

              <div className="overflow-x-auto border border-gray-100 dark:border-gray-900 rounded">
                <table className="w-full text-left font-sans">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/10 font-bold text-gray-500 uppercase">
                      <th className="px-3.5 py-2.5">Key Name</th>
                      <th className="px-3.5 py-2.5">Token Value</th>
                      <th className="px-3.5 py-2.5">Permissions</th>
                      <th className="px-3.5 py-2.5 text-right">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-900 text-gray-700 dark:text-gray-300">
                    {activeModelsKeys.map((key) => (
                      <tr key={key.name} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/5 transition-colors">
                        <td className="px-3.5 py-2 font-semibold font-mono">{key.name}</td>
                        <td className="px-3.5 py-2 font-mono text-gray-400 scale-95 origin-left">{key.value}</td>
                        <td className="px-3.5 py-2 font-medium">{key.access}</td>
                        <td className="px-3.5 py-2 text-right text-gray-400">{key.created}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        {/* SECOND PANE - WORKSPACE PREFERENCES, THEME, AND EXCEPTION NOTIFICATIONS */}
        <div className="flex flex-col gap-4">
          <Card header="Theme Customization">
            <div className="flex flex-col gap-3 font-sans text-xs text-gray-500">
              <p>Alter the visual color theme of the analytics gateway dashboard instantly.</p>
              
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="font-bold text-gray-700 dark:text-gray-300">Active Theme Color</span>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={toggleTheme}
                  className="w-full text-xs font-semibold py-2 outline-none border-gray-200"
                >
                  <span>SET {theme === "light" ? "DARK THEME" : "LIGHT THEME"}</span>
                </Button>
              </div>
            </div>
          </Card>

          <Card header="Telemetry Alerts Dispatch">
            <div className="flex flex-col gap-4 font-sans text-xs text-gray-650 dark:text-gray-400">
              <p className="text-gray-500 leading-normal mb-2">Configure email exception reports according to resource criteria priorities.</p>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notifInvocations}
                  onChange={(e) => setNotifInvocations(e.target.checked)}
                  className="w-4 h-4 text-blue-500 border-gray-200 rounded focus:ring-blue-500/20 mt-0.5"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Edge Gateway exceptions</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Email alert if API latency drifts beyond 450ms budget limits.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notifCostSpikes}
                  onChange={(e) => setNotifCostSpikes(e.target.checked)}
                  className="w-4 h-4 text-blue-500 border-gray-200 rounded focus:ring-blue-500/20 mt-0.5"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Critical cost spikes</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Push notify if cumulative month platform spend spikes 25% above trend lines.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notifWeeklyLedger}
                  onChange={(e) => setNotifWeeklyLedger(e.target.checked)}
                  className="w-4 h-4 text-blue-500 border-gray-200 rounded focus:ring-blue-500/20 mt-0.5"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Weekly revenue ledger digests</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Weekly summary files showing MRR indexes and usage tables.</span>
                </div>
              </label>

              <div className="border-t border-gray-100 dark:border-gray-900 pt-3.5 mt-2 flex justify-between">
                <span className="text-[10px] font-bold text-gray-400">AUDIT ENDPOINT STATUS</span>
                <span className="text-[10px] text-emerald-500 font-extrabold uppercase bg-emerald-500/10 px-1.5 rounded">CONNECTED</span>
              </div>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
