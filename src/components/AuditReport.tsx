import React, { useState } from "react";
import { AuditProject, MaterialAudit } from "../types";
import {
  TreePine,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  BadgeAlert,
  Layers,
  ArrowRight,
  Filter
} from "lucide-react";

interface AuditReportProps {
  project: AuditProject;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onSaveToHistory?: () => void;
  isSaved?: boolean;
}

export default function AuditReport({
  project,
  selectedCategory,
  onSelectCategory,
  onSaveToHistory,
  isSaved = false,
}: AuditReportProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Group categories for filtering list
  const allCategories = Array.from(
    new Set(project.materials.map((m) => m.category))
  );

  // Filter materials based on selected category
  const filteredMaterials = selectedCategory
    ? project.materials.filter(
        (m) => m.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    : project.materials;

  // Calculate stats for equivalent environmental impact
  // e.g. 1 tree absorbs ~22kg of CO2 per year
  const equivalentTrees = Math.round(project.totalCO2SavingsKg / 22);
  // e.g. average car emits ~120g of CO2 per km -> 10,000km is 1200kg of CO2
  const equivalentCarKm = Math.round(project.totalCO2SavingsKg / 0.12);

  const getPotentialBadge = (rating: string) => {
    switch (rating) {
      case "High":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            High
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Medium
          </span>
        );
      case "Low":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Low / Recycle
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Verify
          </span>
        );
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "steel":
        return "bg-slate-400 text-slate-100";
      case "timber":
        return "bg-amber-800 text-amber-100";
      case "glass":
        return "bg-cyan-500 text-slate-900";
      case "concrete":
        return "bg-neutral-500 text-neutral-100";
      case "electrical":
        return "bg-yellow-500 text-slate-900";
      case "hvac":
        return "bg-teal-500 text-slate-900";
      case "finishes":
        return "bg-purple-500 text-purple-100";
      default:
        return "bg-slate-500 text-slate-100";
    }
  };

  // Group CO2 Savings by category for a custom mini dashboard visualization
  const savingsByCategory = project.materials.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.co2SavingsKg;
    return acc;
  }, {} as Record<string, number>);

  const maxSaving = Math.max(...Object.values(savingsByCategory), 1);

  return (
    <div id="audit-report-visualization" className="bg-sleek-panel border border-sleek-border rounded-2xl p-6 shadow-sm">
      {/* Report Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-sleek-border pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 uppercase">
              AUDITED REPORT
            </span>
            {project.location && (
              <span className="text-xs text-slate-400 font-mono">
                • {project.location}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mt-1">{project.name}</h2>
          <p className="text-sm text-slate-400 mt-1 leading-normal max-w-2xl">
            {project.description}
          </p>
        </div>

        {onSaveToHistory && (
          <button
            onClick={onSaveToHistory}
            disabled={isSaved}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              isSaved
                ? "bg-slate-900 text-slate-500 border border-slate-800 cursor-default"
                : "bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-600/10 cursor-pointer"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {isSaved ? "Saved to Audit Pipeline" : "Archive Audit Project"}
          </button>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* KPI 1: Circularity score */}
        <div className="bg-sleek-bg/80 border border-sleek-border rounded-xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-300" />
          <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">CIRCULARITY SCORE</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold text-slate-50 tracking-tight">{project.circularityScore}%</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3 rotate-180" />
              Optimal
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2.5 leading-normal">
            Calculated material circularity based on structural integrity, decay lifecycle, and direct localized reuse pathways.
          </p>
        </div>

        {/* KPI 2: Carbon Offsets */}
        <div className="bg-sleek-bg/80 border border-sleek-border rounded-xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-300" />
          <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">CARBON SAVINGS</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold text-slate-50 tracking-tight">
              {(project.totalCO2SavingsKg / 1000).toFixed(1)}t
            </span>
            <span className="text-xs text-slate-300 font-mono">CO₂ offset</span>
          </div>
          <div className="flex items-center gap-2 mt-2.5 text-xs text-emerald-400/90 font-mono">
            <TreePine className="w-4 h-4 shrink-0" />
            <span>Eq. to {equivalentTrees.toLocaleString()} trees growing for 1 yr</span>
          </div>
        </div>

        {/* KPI 3: Resource Efficiency */}
        <div className="bg-sleek-bg/80 border border-sleek-border rounded-xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-300" />
          <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">RESOURCE CONSERVATION</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold text-slate-50 tracking-tight">
              {project.materials.length}
            </span>
            <span className="text-xs text-slate-300 font-mono">Audited Assemblies</span>
          </div>
          <div className="flex items-center gap-2 mt-2.5 text-xs text-slate-400 font-mono">
            <Layers className="w-4 h-4 text-emerald-450 shrink-0" />
            <span>Saved ~{equivalentCarKm.toLocaleString()} km of commercial transit</span>
          </div>
        </div>
      </div>

      {/* Custom Category Carbon Chart */}
      <div className="bg-sleek-bg border border-sleek-border rounded-xl p-5 mb-8">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase mb-4 tracking-wider">
          Circularity Yield By Category (CO₂ kg Saved)
        </h3>
        <div className="space-y-3">
          {Object.entries(savingsByCategory).map(([category, value]) => {
            const pct = Math.round((value / maxSaving) * 100);
            return (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">{category}</span>
                  <span className="font-mono text-slate-400">{value.toLocaleString()} kg CO₂</span>
                </div>
                <div className="h-2 w-full bg-sleek-panel rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expandable Table Filter Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
            Audited Elements & Assemblies
          </h3>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all cursor-pointer ${
              selectedCategory === null
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold"
                : "bg-sleek-bg text-slate-400 border-sleek-border hover:text-slate-200 hover:border-emerald-500/20"
            }`}
          >
            All Materials ({project.materials.length})
          </button>
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all cursor-pointer ${
                selectedCategory?.toLowerCase() === category.toLowerCase()
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold"
                  : "bg-sleek-bg text-slate-400 border-sleek-border hover:text-slate-200 hover:border-emerald-500/20"
              }`}
            >
              {category} ({project.materials.filter((m) => m.category === category).length})
            </button>
          ))}
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-sleek-bg border border-sleek-border rounded-xl overflow-hidden">
        {filteredMaterials.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">
            No audited materials found matching this filter category.
          </div>
        ) : (
          <div className="divide-y divide-sleek-border">
            {filteredMaterials.map((material) => {
              const isExpanded = expandedRow === material.id;
              return (
                <div key={material.id} className="transition-all hover:bg-sleek-panel/30">
                  {/* Summary Row */}
                  <div
                    onClick={() => setExpandedRow(isExpanded ? null : material.id)}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 cursor-pointer gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-medium ${getCategoryColor(material.category)}`}>
                          {material.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {material.quantity} {material.unit}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-100 mt-1 truncate">
                        {material.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-end gap-3 w-full md:w-auto shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block font-mono">SAVINGS</span>
                        <span className="text-xs font-bold text-slate-200 font-mono">
                          {material.co2SavingsKg > 0 ? `${material.co2SavingsKg.toLocaleString()} kg CO₂` : "REQUIRES EVAL"}
                        </span>
                      </div>
                      <div className="shrink-0">
                        {getPotentialBadge(material.reusePotential)}
                      </div>
                      <div className="text-slate-500 hover:text-slate-300 p-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expansion Panel */}
                  {isExpanded && (
                    <div className="bg-sleek-bg/95 border-t border-sleek-border p-5 text-xs text-slate-300 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-mono text-[9px] text-emerald-400 tracking-wider uppercase mb-1">
                            RECOMMENDED REUSE OUTLET
                          </h5>
                          <div className="flex items-center gap-2 text-slate-100 font-semibold p-2 bg-sleek-panel border border-sleek-border rounded">
                            <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            {material.reuseChannel}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-mono text-[9px] text-emerald-400 tracking-wider uppercase mb-1">
                            CARBON DISPLACEMENT JUSTIFICATION
                          </h5>
                          <p className="text-slate-300 leading-normal p-2 bg-sleek-panel border border-sleek-border rounded font-normal">
                            {material.justification}
                          </p>
                        </div>
                      </div>

                      {material.notes && (
                        <div className="pt-2 border-t border-sleek-border">
                          <span className="font-mono text-[9px] text-slate-500 block uppercase">
                            SOURCE MATERIAL NOTES
                          </span>
                          <span className="text-slate-400 italic block mt-0.5">
                            "{material.notes}"
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
