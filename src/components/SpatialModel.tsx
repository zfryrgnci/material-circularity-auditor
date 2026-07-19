import React, { useState } from "react";
import { MaterialAudit } from "../types";
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react";

interface SpatialModelProps {
  materials: MaterialAudit[];
  onSelectCategory: (category: string | null) => void;
  selectedCategory: string | null;
}

export default function SpatialModel({
  materials,
  onSelectCategory,
  selectedCategory,
}: SpatialModelProps) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Group materials by structural system to determine color-coding
  const getCircularityStatus = (categories: string[]) => {
    const matched = materials.filter((m) =>
      categories.some((c) => m.category.toLowerCase() === c.toLowerCase())
    );

    if (matched.length === 0) return { color: "stroke-slate-400 fill-slate-500/10", label: "No Audited Data", status: "none", rating: "N/A" };

    // Determine aggregate potential
    const potentials = matched.map((m) => m.reusePotential);
    if (potentials.includes("High")) {
      // If we have mostly high potential
      const highs = potentials.filter((p) => p === "High").length;
      if (highs >= potentials.length / 2) {
        return {
          color: "stroke-emerald-500 fill-emerald-500/10 hover:fill-emerald-500/20 shadow-emerald-500/20",
          label: "High Circularity",
          status: "high",
          rating: "High"
        };
      }
    }
    if (potentials.includes("Low")) {
      const lows = potentials.filter((p) => p === "Low").length;
      if (lows >= potentials.length / 2) {
        return {
          color: "stroke-rose-500 fill-rose-500/10 hover:fill-rose-500/20 shadow-rose-500/20",
          label: "Low Circularity / Waste",
          status: "low",
          rating: "Low"
        };
      }
    }
    if (potentials.includes("REQUIRES VERIFICATION")) {
      return {
        color: "stroke-sky-500 fill-sky-500/10 hover:fill-sky-500/20 shadow-sky-500/20",
        label: "Requires Verification",
        status: "verification",
        rating: "Verification"
      };
    }
    return {
      color: "stroke-amber-500 fill-amber-500/10 hover:fill-amber-500/20 shadow-amber-500/20",
      label: "Medium Circularity",
      status: "medium",
      rating: "Medium"
    };
  };

  // Sections definitions mapping to material categories
  const sections = {
    roof: {
      categories: ["Timber", "Roofing"],
      name: "Roof & Ceiling Structure",
      desc: "Trusses, purlins, insulation, and outer protective panels"
    },
    facade: {
      categories: ["Glass", "Finishes", "Masonry"],
      name: "Facade & Openings",
      desc: "Glazing panels, framing assemblies, and external paneling"
    },
    structure: {
      categories: ["Concrete", "Steel"],
      name: "Structural Columns & Slabs",
      desc: "Core load-bearing skeletons, reinforced concrete beams, columns, and sub-bases"
    },
    services: {
      categories: ["Electrical", "HVAC", "Plumbing"],
      name: "Technical Services & Infrastructure",
      desc: "Ductwork, cabling manifolds, and environment controls"
    }
  };

  const roofStatus = getCircularityStatus(sections.roof.categories);
  const facadeStatus = getCircularityStatus(sections.facade.categories);
  const structureStatus = getCircularityStatus(sections.structure.categories);
  const servicesStatus = getCircularityStatus(sections.services.categories);

  const getPotentialIcon = (rating: string) => {
    switch (rating) {
      case "High":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "Medium":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "Low":
        return <XCircle className="w-4 h-4 text-rose-500" />;
      default:
        return <HelpCircle className="w-4 h-4 text-sky-500" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "high":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "low":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "verification":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div id="spatial-model-viewer" className="bg-sleek-panel border border-sleek-border rounded-xl p-6 relative overflow-hidden flex flex-col h-full justify-between shadow-sm">
      {/* HUD Header */}
      <div className="z-10">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-mono text-[10px] text-emerald-400 tracking-widest uppercase">SPATIAL AUDIT MODEL</span>
            <h3 className="text-lg font-semibold text-slate-100 mt-1">Asset Circularity Mapping</h3>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs text-slate-400 bg-sleek-bg px-2.5 py-1 rounded border border-sleek-border">
              ORTHOGRAPHIC VIEW
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Interactive building wireframe. Click highlighted segments to inspect localized material groups.
        </p>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative flex-1 min-h-[300px] flex items-center justify-center py-4">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

        <svg
          viewBox="0 0 600 420"
          className="w-full max-w-[500px] h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] select-none"
        >
          {/* Isometric Building Wireframe Group */}
          <g transform="translate(0, 10)">
            
            {/* === SECTION: STRUCTURE (CONCRETE BASE, COLUMNS, SLABS) === */}
            <g
              className={`cursor-pointer transition-all duration-300 ${
                selectedCategory === "Concrete" || selectedCategory === "Steel" ? "opacity-100 scale-102" : ""
              }`}
              onClick={() => {
                const active = selectedCategory === "Concrete" ? null : "Concrete";
                onSelectCategory(active);
              }}
              onMouseEnter={() => setHoveredSection("structure")}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {/* Foundation Slab */}
              <polygon
                points="300,340 180,280 300,220 420,280"
                className={`transition-colors stroke-2 ${structureStatus.color}`}
              />
              <polygon
                points="180,280 180,300 300,360 300,340"
                className={`transition-colors stroke-2 ${structureStatus.color}`}
              />
              <polygon
                points="300,340 300,360 420,300 420,280"
                className={`transition-colors stroke-2 ${structureStatus.color}`}
              />

              {/* Floor Slab 1 */}
              <polygon
                points="300,240 180,180 300,120 420,180"
                className={`transition-colors stroke-2 ${structureStatus.color}`}
              />

              {/* Core Columns (Back Left, Back Right, Front, Left, Right) */}
              {/* Back Column */}
              <line x1="300" y1="120" x2="300" y2="220" className={`transition-colors stroke-2 ${structureStatus.color}`} strokeDasharray="3,3" />
              {/* Left Column */}
              <line x1="180" y1="180" x2="180" y2="280" className={`transition-colors stroke-2 ${structureStatus.color}`} />
              {/* Right Column */}
              <line x1="420" y1="180" x2="420" y2="280" className={`transition-colors stroke-2 ${structureStatus.color}`} />
              {/* Center Column */}
              <line x1="300" y1="240" x2="300" y2="340" className={`transition-colors stroke-2 ${structureStatus.color}`} />
              
              {/* Sub-Beams */}
              <line x1="180" y1="180" x2="300" y2="240" className={`transition-colors stroke-2 ${structureStatus.color}`} />
              <line x1="300" y1="240" x2="420" y2="180" className={`transition-colors stroke-2 ${structureStatus.color}`} />
            </g>

            {/* === SECTION: TECHNICAL SERVICES (DUCTS, HVAC, PIPES) === */}
            <g
              className={`cursor-pointer transition-all duration-300 ${
                selectedCategory === "HVAC" || selectedCategory === "Electrical" ? "opacity-100" : "opacity-80"
              }`}
              onClick={() => {
                const active = selectedCategory === "HVAC" ? null : "HVAC";
                onSelectCategory(active);
              }}
              onMouseEnter={() => setHoveredSection("services")}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {/* Isometric conduit pipelines along structure */}
              <path
                d="M 210,240 L 210,140 L 270,170"
                className={`fill-none stroke-2 stroke-dasharray-4 ${servicesStatus.color}`}
                strokeDasharray="4,4"
              />
              <path
                d="M 390,240 L 390,140 L 330,170"
                className={`fill-none stroke-2 stroke-dasharray-4 ${servicesStatus.color}`}
                strokeDasharray="4,4"
              />
              {/* Server/Plant cylinders in back */}
              <rect
                x="285"
                y="150"
                width="30"
                height="45"
                rx="5"
                className={`transition-colors stroke-2 ${servicesStatus.color}`}
              />
              <line x1="300" y1="150" x2="300" y2="195" className={`transition-colors stroke-2 ${servicesStatus.color}`} />
            </g>

            {/* === SECTION: FACADE, GLAZING & WINDOWS === */}
            <g
              className={`cursor-pointer transition-all duration-300 ${
                selectedCategory === "Glass" || selectedCategory === "Finishes" ? "opacity-100 scale-102" : ""
              }`}
              onClick={() => {
                const active = selectedCategory === "Glass" ? null : "Glass";
                onSelectCategory(active);
              }}
              onMouseEnter={() => setHoveredSection("facade")}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {/* Front-Left Glazed Wall Partition */}
              <polygon
                points="180,180 300,240 300,340 180,280"
                className={`transition-colors stroke-1.5 ${facadeStatus.color}`}
              />
              {/* Glass Mullions */}
              <line x1="220" y1="200" x2="220" y2="300" className={`transition-colors stroke-1 opacity-70 ${facadeStatus.color}`} />
              <line x1="260" y1="220" x2="260" y2="320" className={`transition-colors stroke-1 opacity-70 ${facadeStatus.color}`} />
              
              {/* Front-Right Glazed Wall Partition */}
              <polygon
                points="300,240 420,180 420,280 300,340"
                className={`transition-colors stroke-1.5 ${facadeStatus.color}`}
              />
              <line x1="340" y1="220" x2="340" y2="320" className={`transition-colors stroke-1 opacity-70 ${facadeStatus.color}`} />
              <line x1="380" y1="200" x2="380" y2="300" className={`transition-colors stroke-1 opacity-70 ${facadeStatus.color}`} />
            </g>

            {/* === SECTION: ROOFING & CEILING TIMBERS === */}
            <g
              className={`cursor-pointer transition-all duration-300 ${
                selectedCategory === "Roofing" || selectedCategory === "Timber" ? "opacity-100 scale-102" : ""
              }`}
              onClick={() => {
                const active = selectedCategory === "Roofing" ? null : "Roofing";
                onSelectCategory(active);
              }}
              onMouseEnter={() => setHoveredSection("roof")}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {/* Isometric Timber Truss Frame */}
              <polygon
                points="300,120 180,180 300,240 420,180"
                className="fill-none stroke-slate-600 stroke-1"
                strokeDasharray="2,2"
              />
              
              {/* Real Roof Peak Structure */}
              <polygon
                points="300,80 180,140 300,200 420,140"
                className="fill-none stroke-slate-500 stroke-1"
              />

              {/* Roof Panels (Left Facet) */}
              <polygon
                points="300,80 180,140 180,180 300,120"
                className={`transition-colors stroke-2 ${roofStatus.color}`}
              />
              <line x1="210" y1="135" x2="210" y2="175" className={`transition-colors stroke-1 opacity-50 ${roofStatus.color}`} />
              <line x1="240" y1="120" x2="240" y2="160" className={`transition-colors stroke-1 opacity-50 ${roofStatus.color}`} />
              <line x1="270" y1="105" x2="270" y2="145" className={`transition-colors stroke-1 opacity-50 ${roofStatus.color}`} />

              {/* Roof Panels (Right Facet) */}
              <polygon
                points="300,80 420,140 420,180 300,120"
                className={`transition-colors stroke-2 ${roofStatus.color}`}
              />
              <line x1="390" y1="135" x2="390" y2="175" className={`transition-colors stroke-1 opacity-50 ${roofStatus.color}`} />
              <line x1="360" y1="120" x2="360" y2="160" className={`transition-colors stroke-1 opacity-50 ${roofStatus.color}`} />
              <line x1="330" y1="105" x2="330" y2="145" className={`transition-colors stroke-1 opacity-50 ${roofStatus.color}`} />

              {/* Peak ridge */}
              <line x1="180" y1="140" x2="300" y2="80" className={`transition-colors stroke-3 ${roofStatus.color}`} />
              <line x1="300" y1="80" x2="420" y2="140" className={`transition-colors stroke-3 ${roofStatus.color}`} />
            </g>

          </g>
        </svg>

        {/* Dynamic Float Details */}
        {hoveredSection && (
          <div className="absolute bottom-4 left-4 right-4 bg-sleek-bg/95 border border-sleek-border rounded-lg p-3 backdrop-blur-md transition-all duration-300">
            {hoveredSection === "roof" && (
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-xs text-slate-200">{sections.roof.name}</h4>
                  <p className="text-[10px] text-slate-400">{sections.roof.desc}</p>
                </div>
                <div className={`text-xs px-2 py-0.5 rounded border font-mono flex items-center gap-1.5 ${getStatusBadgeClass(roofStatus.status)}`}>
                  {getPotentialIcon(roofStatus.rating)}
                  {roofStatus.label}
                </div>
              </div>
            )}
            {hoveredSection === "facade" && (
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-xs text-slate-200">{sections.facade.name}</h4>
                  <p className="text-[10px] text-slate-400">{sections.facade.desc}</p>
                </div>
                <div className={`text-xs px-2 py-0.5 rounded border font-mono flex items-center gap-1.5 ${getStatusBadgeClass(facadeStatus.status)}`}>
                  {getPotentialIcon(facadeStatus.rating)}
                  {facadeStatus.label}
                </div>
              </div>
            )}
            {hoveredSection === "structure" && (
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-xs text-slate-200">{sections.structure.name}</h4>
                  <p className="text-[10px] text-slate-400">{sections.structure.desc}</p>
                </div>
                <div className={`text-xs px-2 py-0.5 rounded border font-mono flex items-center gap-1.5 ${getStatusBadgeClass(structureStatus.status)}`}>
                  {getPotentialIcon(structureStatus.rating)}
                  {structureStatus.label}
                </div>
              </div>
            )}
            {hoveredSection === "services" && (
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-xs text-slate-200">{sections.services.name}</h4>
                  <p className="text-[10px] text-slate-400">{sections.services.desc}</p>
                </div>
                <div className={`text-xs px-2 py-0.5 rounded border font-mono flex items-center gap-1.5 ${getStatusBadgeClass(servicesStatus.status)}`}>
                  {getPotentialIcon(servicesStatus.rating)}
                  {servicesStatus.label}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Model Legend */}
      <div className="border-t border-sleek-border pt-4 flex flex-wrap gap-x-4 gap-y-2 justify-center bg-sleek-bg -mx-6 -mb-6 p-4 rounded-b-xl">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block border border-emerald-400" />
          <span className="text-[10px] text-slate-400 font-mono">High Reuse Potential</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block border border-amber-400" />
          <span className="text-[10px] text-slate-400 font-mono">Medium Reuse Potential</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block border border-rose-400" />
          <span className="text-[10px] text-slate-400 font-mono">Low Reuse / Recycling</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 block border border-sky-400" />
          <span className="text-[10px] text-slate-400 font-mono">Verification Required</span>
        </div>
      </div>
    </div>
  );
}
