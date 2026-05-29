import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Dropdown from "../components/Dropdown";
import Modal from "../components/Modal";
import { 
  Plus, 
  CheckSquare, 
  Trash2, 
  FolderLock, 
  FolderPlus,
  Play,
  TrendingUp,
  Award,
  Circle
} from "lucide-react";
import { motion } from "motion/react";

export default function Projects() {
  const { projects, addProject, toggleTaskStatus, team, addToast } = useApp();
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  // Form states
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectLead, setProjectLead] = useState("");
  const [projectPriority, setProjectPriority] = useState<'Low' | 'Medium' | 'High'>("Medium");

  const [formErr, setFormErr] = useState("");

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !projectDesc.trim() || !projectLead) {
      setFormErr("All project metadata and lead assignments must be provided.");
      return;
    }

    addProject(projectName, projectDesc, projectLead, projectPriority);
    
    // Reset Form
    setProjectName("");
    setProjectDesc("");
    setProjectLead("");
    setProjectPriority("Medium");
    setFormErr("");
    setIsNewProjectOpen(false);
  };

  const priorityColors = {
    Low: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
    Medium: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    High: "bg-red-500/10 text-red-500 border border-red-500/20"
  };

  const statusColors = {
    Active: "bg-blue-500 text-white",
    Paused: "bg-gray-400 text-white",
    Shipped: "bg-emerald-500 text-white"
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 uppercase">
            Workspace Projects
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium font-sans">
            Track active developer deliverables, schedule milestones, and update granular checklist progress metrics.
          </p>
        </div>

        <Button
          onClick={() => {
            if (team.length === 0) {
              addToast("Access Restricted", "You cannot initialize projects without workspace collaborators.", "error");
              return;
            }
            setIsNewProjectOpen(true);
          }}
          className="flex items-center gap-2 font-bold py-1.5 px-4 shadow-md text-xs"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          <span>CREATE NEW PROJECT</span>
        </Button>
      </div>

      {/* METRIC CARD BOXES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/[0.01] to-transparent">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Boards Tracker</span>
            <span className="text-xl font-extrabold text-blue-500">{projects.filter(p => p.status === 'Active').length} Platforms</span>
          </div>
          <Play className="w-5 h-5 text-blue-500" />
        </Card>

        <Card className="flex items-center justify-between p-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Shipped Deliverables</span>
            <span className="text-xl font-extrabold text-emerald-500">{projects.filter(p => p.status === 'Shipped').length} Libraries</span>
          </div>
          <Award className="w-5 h-5 text-emerald-500" />
        </Card>

        <Card className="flex items-center justify-between p-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Global Work Percentage</span>
            <span className="text-xl font-extrabold text-purple-500">
              {projects.length > 0 ? (
                Math.round(projects.reduce((acc, curr) => acc + curr.progress, 0) / projects.length)
              ) : 0}% Done
            </span>
          </div>
          <TrendingUp className="w-5 h-5 text-purple-500" />
        </Card>
      </div>

      {/* PROJECT Grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => (
          <motion.div
            key={proj.id}
            whileHover={{ y: -2 }}
            className="flex"
          >
            <Card 
              className="flex-1 flex flex-col justify-between"
              header={
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-gray-50 uppercase max-w-[140px] truncate">
                    {proj.name}
                  </h3>
                  <div className="flex gap-1.5 items-center">
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${priorityColors[proj.priority]}`}>
                      {proj.priority}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${statusColors[proj.status]}`}>
                      {proj.status}
                    </span>
                  </div>
                </div>
              }
            >
              <div className="flex flex-col gap-4">
                {/* Description and Lead */}
                <div className="flex flex-col gap-1.5 h-16 max-h-16 overflow-hidden">
                  <p className="text-xs text-gray-550 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                  <p className="text-[10px] text-gray-400 font-semibold font-mono">
                    Owner: <span className="text-blue-500 select-none">{proj.lead}</span>
                  </p>
                </div>

                {/* Progress Bar meter */}
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-gray-450">Completion</span>
                    <span className="text-gray-950 dark:text-gray-250 font-mono">{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-900 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        proj.progress === 100 
                          ? 'bg-emerald-500' 
                          : proj.progress > 50 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                {/* granular checklists list */}
                <div className="flex flex-col gap-2 border-t border-gray-100 dark:border-gray-900/50 pt-3">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Incremental Backlogs</span>
                  <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {proj.tasks.length > 0 ? (
                      proj.tasks.map((task) => {
                        const isDone = task.status === "Done";
                        return (
                          <div 
                            key={task.id} 
                            onClick={() => toggleTaskStatus(proj.id, task.id)}
                            className="flex items-center justify-between gap-3 p-2 bg-gray-50/20 dark:bg-gray-950/40 hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors border border-gray-100 dark:border-gray-900 rounded cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              {isDone ? (
                                <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                              )}
                              <span className={`text-[11px] font-medium leading-none ${isDone ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-300'}`}>
                                {task.title}
                              </span>
                            </div>
                            
                            <span className="text-[9px] text-gray-400 shrink-0 font-mono scale-90">{task.assignedTo.split(' ')[0]}</span>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-xs text-gray-400">Backlog checklist clear.</span>
                    )}
                  </div>
                </div>

              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* NEW PROJECT ADD DIALOG */}
      <Modal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        title="Initialize SaaS Venture Board"
        size="md"
      >
        <form onSubmit={handleCreateProject} className="flex flex-col gap-4 font-sans text-xs">
          {formErr && (
            <div className="bg-red-500/10 border border-red-500/20 rounded p-2 text-xs flex items-center gap-2 text-red-550 dark:text-red-400 font-semibold">
              <FolderLock className="w-4 h-4 shrink-0" />
              <span>{formErr}</span>
            </div>
          )}

          <Input
            label="Venture Name"
            placeholder="Aether Model proxy"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            leftIcon={<FolderPlus className="w-4 h-4 text-gray-400" />}
          />

          <div className="flex flex-col gap-1 w-full text-xs">
            <label className="font-semibold tracking-tight text-gray-700 dark:text-gray-300">Venture Description</label>
            <textarea
              placeholder="What core operational goals does this venture deliver..."
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              rows={3}
              className="w-full font-sans text-sm p-3 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 h-20 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Dropdown
              label="Assigned Owner (Lead)"
              options={team.map(t => ({ value: t.name, label: t.name }))}
              selectedValue={projectLead}
              onChange={(val) => setProjectLead(val)}
            />

            <Dropdown
              label="Deliverable Priority"
              options={[
                { value: "Low", label: "Low Priority" },
                { value: "Medium", label: "Medium Priority" },
                { value: "High", label: "High Priority" }
              ]}
              selectedValue={projectPriority}
              onChange={(val) => setProjectPriority(val as any)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-gray-100 dark:border-gray-900/50 pt-4 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewProjectOpen(false)}
              className="px-4 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="px-4 text-xs font-bold"
            >
              Create Venture
            </Button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
