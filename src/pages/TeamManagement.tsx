import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Dropdown from "../components/Dropdown";
import Modal from "../components/Modal";
import DataTable from "../components/DataTable";
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Check, 
  Clock, 
  UserCheck, 
  Mail, 
  ShieldAlert 
} from "lucide-react";

export default function TeamManagement() {
  const { team, addTeamMember, removeTeamMember, addToast } = useApp();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Invite Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("Developer");
  const [status, setStatus] = useState<string>("active");

  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>({});

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; email?: string } = {};

    if (!name.trim()) errors.name = "Full name is a required field.";
    if (!email.trim()) {
      errors.email = "Email address is a required field.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please specify a valid email format.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Submit state and trigger AppContext team modifier
    addTeamMember({
      name,
      email,
      role: role as any,
      status: status as any,
      performance: status === "active" ? 90 : 0
    });

    // Reset Form
    setName("");
    setEmail("");
    setRole("Developer");
    setStatus("active");
    setFormErrors({});
    setIsInviteOpen(false);
  };

  const getStatusBadge = (stat: string) => {
    switch (stat) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Active
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] bg-gray-500/10 text-gray-400 border border-gray-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            Inactive
          </span>
        );
    }
  };

  const columns = [
    {
      key: "name",
      header: "Member Info",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.avatar} 
            alt={row.name} 
            className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-900 object-cover" 
          />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-gray-900 dark:text-gray-50 text-xs sm:text-sm">{row.name}</span>
            <span className="text-[10px] text-gray-400 truncate max-w-[140px] sm:max-w-none">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      key: "role",
      header: "Workspace Role",
      sortable: true,
      render: (row: any) => (
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
          {row.role}
        </span>
      )
    },
    {
      key: "status",
      header: "Auth Status",
      sortable: true,
      render: (row: any) => getStatusBadge(row.status)
    },
    {
      key: "performance",
      header: "Performance Index",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center gap-2">
          {row.status === "pending" ? (
            <span className="text-gray-400">---</span>
          ) : (
            <>
              <div className="w-16 bg-gray-100 dark:bg-gray-900 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${row.performance > 92 ? 'bg-blue-500' : 'bg-amber-500'}`}
                  style={{ width: `${row.performance}%` }}
                />
              </div>
              <span className="text-xs font-bold text-gray-900 dark:text-gray-50 font-mono">
                {row.performance}%
              </span>
            </>
          )}
        </div>
      )
    },
    {
      key: "actions",
      header: "Operations",
      render: (row: any) => (
        <div className="flex items-center gap-1.5">
          {row.role !== "Owner" ? (
            <button
              onClick={() => {
                removeTeamMember(row.id);
              }}
              className="p-1.5 rounded text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              title="Revoke workspace access token"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 py-1">Immutable</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 uppercase">
            Team management
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium font-sans">
            Oversee collaborative workspace tokens, assign project access guidelines, and track developer performance.
          </p>
        </div>

        <Button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 font-bold py-1.5 px-4 shadow-md text-xs"
        >
          <UserPlus className="w-3.5 h-3.5 text-white" />
          <span>INVITE NEW DEVELOPER</span>
        </Button>
      </div>

      {/* COMPARATIVE TEAM CARDS BENTO COMPONENT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex items-center justify-between p-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Workspace Seats</span>
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 font-sans">
              {team.filter(t => t.status === 'active').length} / 10
            </span>
          </div>
          <div className="p-3 bg-emerald-55/10 bg-emerald-500/5 dark:bg-emerald-950/20 text-emerald-500 rounded-lg">
            <UserCheck className="w-5 h-5" />
          </div>
        </Card>

        <Card className="flex items-center justify-between p-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Invitations</span>
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 font-mono">
              {team.filter(t => t.status === 'pending').length}
            </span>
          </div>
          <div className="p-3 bg-amber-55/10 bg-amber-500/5 dark:bg-amber-950/20 text-amber-500 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        <Card className="flex items-center justify-between p-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Average Productivity index</span>
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 font-mono">
              {94}%
            </span>
          </div>
          <div className="p-3 bg-blue-55/10 bg-blue-500/5 dark:bg-blue-950/20 text-blue-500 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* MAIN DATA TABLE SECTION */}
      <Card header="Registered Workspace Collaborators">
        <DataTable
          data={team}
          columns={columns}
          searchPlaceholder="Filter developers by name or role..."
          searchKey="name"
          pageSize={5}
        />
      </Card>

      {/* INVITE DIALOG FLOW */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite New Workspace Seats"
        size="md"
      >
        <form onSubmit={handleInviteSubmit} className="flex flex-col gap-4 font-sans text-xs">
          
          <div className="bg-blue-500/[0.02] border border-blue-500/10 p-3 rounded flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              New team members will receive an automated mail link to complete OAuth authentication.
            </p>
          </div>

          <Input
            label="Full Name of Member"
            placeholder="Sarah Connor"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={formErrors.name}
            leftIcon={<UserCheck className="w-4 h-4" />}
          />

          <Input
            label="E-Mail Address"
            placeholder="sarah@company.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={formErrors.email}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div className="grid grid-cols-2 gap-4">
            <Dropdown
              label="Collaborator Role"
              options={[
                { value: "Developer", label: "Developer" },
                { value: "UI/UX Designer", label: "UI/UX Designer" },
                { value: "Product Manager", label: "Product Manager" },
                { value: "Admin", label: "Administrator" }
              ]}
              selectedValue={role}
              onChange={(val) => setRole(val)}
            />

            <Dropdown
              label="Immediate Status"
              options={[
                { value: "active", label: "Active seat" },
                { value: "pending", label: "Queued (Pending)" }
              ]}
              selectedValue={status}
              onChange={(val) => setStatus(val)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-gray-100 dark:border-gray-900/50 pt-4 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsInviteOpen(false)}
              className="px-4 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="px-4 text-xs font-bold"
            >
              <Check className="w-3.5 h-3.5 text-white mr-1.5" />
              <span>Send Invite</span>
            </Button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
