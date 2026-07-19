import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileSearch,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Server,
  Terminal,
  Save,
  HelpCircle,
  FileCheck,
  LayoutDashboard
} from "lucide-react";
import { AuditProject, MaterialAudit } from "./types";
import SpatialModel from "./components/SpatialModel";
import ApiCodeSnippets from "./components/ApiCodeSnippets";
import SampleManager from "./components/SampleManager";
import AuditReport from "./components/AuditReport";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [auditProgressMessage, setAuditProgressMessage] = useState("");
  
  // Active selected project
  const [activeProject, setActiveProject] = useState<AuditProject | null>(null);
  // List of all projects (including pre-loaded ones)
  const [projects, setProjects] = useState<AuditProject[]>([]);
  // Synced category filter between Spatial Model and Table list
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // Whether current active project has been archived
  const [isSaved, setIsSaved] = useState(false);

  // Load projects from API on startup
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        // Load the first project as active on start
        if (data.length > 0 && !activeProject) {
          setActiveProject(data[0]);
          setIsSaved(true);
        }
      }
    } catch (err) {
      console.error("Failed to load preloaded projects:", err);
    }
  };

  // Reassuring messages during audit stream
  const progressSteps = [
    "Dismantling inventory text arrays...",
    "Reconstructing material metrics...",
    "Identifying structural classifications...",
    "Calculating displacement CO₂ bounds...",
    "Analyzing localized secondary marketplaces...",
    "Securing circular economy recommendations..."
  ];

  const runAudit = async () => {
    if (!inputText.trim()) {
      setAuditError("Please paste or load inventory text to audit.");
      return;
    }

    setIsAuditing(true);
    setAuditError(null);
    setActiveProject(null);
    setIsSaved(false);

    // Rotate progress messages for highly professional feedback
    let stepIdx = 0;
    setAuditProgressMessage(progressSteps[0]);
    const progressInterval = setInterval(() => {
      stepIdx = (stepIdx + 1) % progressSteps.length;
      setAuditProgressMessage(progressSteps[stepIdx]);
    }, 2500);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.details || errData.error || "Failed to audit elements");
      }

      const auditData = await response.json();
      
      // Post-calculate circularity parameters
      const materialsWithIds: MaterialAudit[] = auditData.materials.map((m: any, idx: number) => ({
        ...m,
        id: `mat-run-${Date.now()}-${idx}`
      }));

      const totalCO2Savings = materialsWithIds.reduce((sum, m) => sum + m.co2SavingsKg, 0);
      
      // Calculate a distinct circularity score
      // High count: +20, Medium count: +10, Low count: +2, Verification: +5
      const potentials = materialsWithIds.map(m => m.reusePotential);
      const scoreWeight = potentials.reduce((sum, p) => {
        if (p === "High") return sum + 20;
        if (p === "Medium") return sum + 10;
        if (p === "Low") return sum + 2;
        return sum + 5;
      }, 0);
      const maxScore = potentials.length * 20;
      const circularityScore = maxScore > 0 ? Math.round((scoreWeight / maxScore) * 100) : 50;

      const newProject: AuditProject = {
        id: `proj-run-${Date.now()}`,
        name: auditData.projectName || "Custom Audited Building",
        description: auditData.description || "Inferred circular economy properties and carbon offset potential.",
        date: new Date().toISOString().split("T")[0],
        materials: materialsWithIds,
        totalCO2SavingsKg: totalCO2Savings,
        circularityScore
      };

      setActiveProject(newProject);
    } catch (err: any) {
      console.error(err);
      setAuditError(err.message || "An unexpected error occurred during the circularity audit.");
    } finally {
      clearInterval(progressInterval);
      setIsAuditing(false);
    }
  };

  const saveProjectToStore = async () => {
    if (!activeProject || isSaved) return;

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activeProject),
      });

      if (response.ok) {
        const savedProject = await response.json();
        setProjects((prev) => [savedProject, ...prev]);
        setActiveProject(savedProject);
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Failed to archive audited project:", err);
    }
  };

  const exportManifestJson = () => {
    if (!activeProject) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeProject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${activeProject.name.toLowerCase().replace(/\s+/g, '_')}_manifest.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-sleek-bg text-slate-300 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300 antialiased">
      {/* HUD Margin lines and decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(30,34,43,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,34,43,0.2)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      {/* Main Top Header Navigation */}
      <header className="h-16 border-b border-sleek-border bg-sleek-panel-alt backdrop-blur-md sticky top-0 z-40 px-6 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black font-extrabold text-base shadow-md shadow-emerald-500/20">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold tracking-tight text-white">
                StructuraLoop <span className="text-emerald-500 text-xs font-normal ml-1">v2.4.0</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono">Active Project</span>
            <span className="text-xs text-slate-200 font-medium truncate max-w-[240px]">
              {activeProject ? activeProject.name : "No Active Audit Selected"}
            </span>
          </div>
          {activeProject && (
            <>
              <div className="hidden sm:block h-8 w-px bg-slate-800"></div>
              <button
                onClick={exportManifestJson}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-md transition-colors shadow-md shadow-emerald-600/10 cursor-pointer"
              >
                Generate API Export
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Core Layout Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 relative z-10">
        
        {/* Top Interactive Workspace Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Column 1: Input Control Center (size 5/12) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Input Form Box */}
            <div className="bg-sleek-panel border border-sleek-border rounded-2xl p-5 flex flex-col justify-between h-[420px] shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
                      Workspace Input
                    </h3>
                  </div>
                  <button
                    onClick={() => setInputText("")}
                    className="text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    CLEAR CANVAS
                  </button>
                </div>
                
                <p className="text-xs text-slate-400 mb-3 leading-normal">
                  Paste raw Bills of Quantities (BOQ), structural manifests, or demolition inventories to estimate lifecycle potential.
                </p>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Project: Commercial Retrofit. Inventory:&#10;• 500sqm Solid Oak timber boarding (Excellent condition).&#10;• 200 lin.yds heavy gauge steel structural beam structures.&#10;• 40x dual-pane copper-coated office window sheets..."
                className="flex-1 bg-sleek-bg border border-sleek-border rounded-xl p-4 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 resize-none leading-relaxed transition-colors mb-4"
              />

              <button
                onClick={runAudit}
                disabled={isAuditing}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  isAuditing
                    ? "bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/10"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {isAuditing ? "PARSING INVENTORY ELEMENTS..." : "RUN CIRCULARITY AUDIT"}
              </button>
            </div>

            {/* Preloaded Reference Sample Manager */}
            <SampleManager
              onSelectSample={(text) => {
                setInputText(text);
                // Clear active selection to force them to click "Run Audit" for an amazing experience
                setActiveProject(null);
                setAuditError(null);
              }}
            />
          </div>

          {/* Column 2: Audit Results Desk (size 7/12) */}
          <div className="lg:col-span-7 h-[620px] lg:h-[650px] flex flex-col">
            <AnimatePresence mode="wait">
              {/* STATE 1: Auditing loading screen */}
              {isAuditing && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-sleek-panel border border-sleek-border rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full flex-1"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin" />
                    <Sparkles className="w-6 h-6 text-emerald-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-200">Processing Circular Economy Audit</h3>
                  <p className="text-xs text-emerald-400 font-mono mt-2 min-h-[20px] transition-all">
                    {auditProgressMessage}
                  </p>
                  <div className="max-w-xs mt-6 p-4 bg-sleek-bg/60 border border-sleek-border rounded-lg text-[10px] text-slate-400 leading-normal text-left font-mono">
                    <strong className="text-slate-300 block mb-1 uppercase">AUDIT METRICS GENERATION:</strong>
                    Evaluating material life-cycle, localized exchange options, and displacing equivalent primary smelting carbon loads.
                  </div>
                </motion.div>
              )}

              {/* STATE 2: Error screen */}
              {!isAuditing && auditError && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-sleek-panel border border-rose-900/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full flex-1"
                >
                  <div className="p-3.5 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20 mb-4">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-semibold text-rose-400">Analysis Halted</h3>
                  <p className="text-xs text-slate-400 mt-2 max-w-sm leading-normal">
                    {auditError}
                  </p>
                  <button
                    onClick={runAudit}
                    className="mt-6 px-5 py-2.5 bg-sleek-bg hover:bg-slate-900 text-slate-200 border border-sleek-border rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Retry Audit Execution
                  </button>
                </motion.div>
              )}

              {/* STATE 3: Onboarding state / No active project */}
              {!isAuditing && !auditError && !activeProject && (
                <motion.div
                  key="onboarding"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-sleek-panel border border-sleek-border rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full flex-1"
                >
                  <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 mb-5 animate-pulse">
                    <FileSearch className="w-10 h-10" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-200">No Active Audit Selected</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs leading-normal">
                    Pristine structural models and circularity carbon curves are generated upon processing a bill of quantities manifest.
                  </p>

                  <div className="mt-8 w-full max-w-sm text-left">
                    <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block mb-3 text-center">
                      OR SELECT AN ARCHIVED COMPLETED PROJECT
                    </span>
                    <div className="space-y-2">
                      {projects.map((proj) => (
                        <button
                          key={proj.id}
                          onClick={() => {
                            setActiveProject(proj);
                            setIsSaved(true);
                          }}
                          className="w-full flex items-center justify-between p-3.5 bg-sleek-bg hover:bg-sleek-bg/60 border border-sleek-border hover:border-slate-700 rounded-xl transition-all text-left group"
                        >
                          <div className="overflow-hidden">
                            <span className="font-semibold text-xs text-slate-200 block truncate group-hover:text-emerald-400 transition-colors">
                              {proj.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block truncate">
                              {proj.materials.length} components • {(proj.totalCO2SavingsKg / 1000).toFixed(1)}t saved
                            </span>
                          </div>
                          <LayoutDashboard className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors shrink-0 ml-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STATE 4: Displaying beautiful parsed report */}
              {!isAuditing && activeProject && (
                <motion.div
                  key="report"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full overflow-y-auto pr-1"
                >
                  <AuditReport
                    project={activeProject}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    onSaveToHistory={saveProjectToStore}
                    isSaved={isSaved}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Spatial Architecture & Code Snippets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Spatial Auditor Model (size 7/12) */}
          <div className="lg:col-span-7 h-[460px]">
            <SpatialModel
              materials={activeProject ? activeProject.materials : []}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Copyable API Snippets Sandbox (size 5/12) */}
          <div className="lg:col-span-5 h-[460px]">
            <ApiCodeSnippets />
          </div>
        </div>

      </main>

      {/* Bottom Status Bar */}
      <footer className="h-10 border-t border-sleek-border px-6 flex items-center justify-between bg-sleek-panel-alt text-[10px] text-slate-500 font-mono">
        <div className="flex gap-4">
          <span>SYSTEM: STABLE</span>
          <span>LATENCY: 48ms</span>
          <span>PIPELINE: SECURE</span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            AUDIT_ENGINE_V2_LIVE
          </div>
          <span className="opacity-70 uppercase hidden sm:inline">© 2026 StructuraLoop Circularity Auditor</span>
        </div>
      </footer>
    </div>
  );
}
