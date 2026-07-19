import React from "react";
import { FileText, Building, Hammer, Zap } from "lucide-react";

export interface SampleDoc {
  id: string;
  title: string;
  origin: string;
  icon: React.ReactNode;
  content: string;
}

interface SampleManagerProps {
  onSelectSample: (content: string) => void;
}

export default function SampleManager({ onSelectSample }: SampleManagerProps) {
  const samples: SampleDoc[] = [
    {
      id: "sophia",
      title: "GPL Sophia Stores Building",
      origin: "Guyana Power and Light Inc.",
      icon: <Building className="w-4 h-4 text-sky-400" />,
      content: `CLIENT: GUYANA POWER AND LIGHT INC.
PROJECT: COMPLETION OF SOPHIA STORES BUILDING (SOPHIA, GEORGETOWN)

BILL No. 3 - DEMOLITIONS/ALTERATIONS:
2.1 Carefully demolish existing defective reinforced concrete columns; 10" x 10" x 9' 6" high. Dispose of all unwanted materials offsite. Qty: 15 Nr.
2.2 Carefully demolish existing hollow concrete block walls; avg height 9' 0". Qty: 35 Syd.
2.7 Carefully remove all loose mortar and concrete. Qty: 1 sum.

BILL No. 7 - CARPENTRY & JOINERY:
7.1 Supply and install 1" x 3" G.H. facing to doors. Qty: 1400 ft.
7.4 Supply and install 2" X 4" G.H. ceiling joist. Qty: 9000 ft.

BILL No. 8 - WINDOWS AND DOORS:
8.1 Double leaf solid core six panel purple heart door; size 64" x 80". Qty: 1 Nr.
8.2 Metal door (Shop front) rolling door with motor 15' wide x 18' height. Qty: 2 Nr.
8.12 Aluminum frame sash window - 2'-6" wide x 4'-0" high. Qty: 8 Nr.

BILL No. 9 - METAL WORK:
9.1 2" dia galvanized pipe welded to steel pipe post support to form top, bottom and middle handrail. Qty: 660 Ln.yds.
9.2 2" dia. Galvanized pipe post support welded to hand rail and base steel plate. Qty: 165 Ln.yds.
9.6 16 gauge steel decking to concrete roof slab. Qty: 1250 Sq.yds.

BILL No. 10 - ROOFING:
10.1 26 swg galvalume trapezoidal profile pre-painted sheeting on 1" x 6" sheet laths. Qty: 34 Sq.yds.`
    },
    {
      id: "quezon",
      title: "U.P. Village Multi-Purpose Hall",
      origin: "Quezon City Government BOQ",
      icon: <Building className="w-4 h-4 text-emerald-400" />,
      content: `PROJECT TITLE: PROPOSED CONSTRUCTION OF TWO (2) STOREY MULTI PURPOSE HALL / SK HALL
LOCATION: BARANGAY U.P. VILLAGE, DISTRICT 4, QUEZON CITY

ITEM II - SITE WORKS:
Removal of existing CHB wall partition. Qty: 164 sq.m.
Removal of existing roofing and bended accessories. Qty: 165 sq.m.
Removal of existing roof framing. Qty: 44 sq.m.

ITEM III - CIVIL/STRUCTURAL WORKS (CONCRETING):
Ready Mix Concrete (28 MPa, 3/4" Gravel, 28 Days) for Columns. Qty: 12 cu.m.
Ready Mix Concrete for Footings & Beams. Qty: 19 cu.m.

REINFORCING STEEL BARS:
Grade 40: 10mmØ Column Stirrups (586 kg), 10mmØ Beam Stirrup (596 kg), 10mmØ Slab-on-fill (352 kg).
Grade 60: 16mmØ Column Footing (478 kg), 16mmØ Column (1,617 kg), 16mmØ Beams (832 kg).

METAL WORKS:
Truss Frame: 50mm x 50mm x 6mm Angle Bar (770 kg), 38mm x 38mm x 6mm Angle Bar (413 kg).
Sway Braces: 50mm x 50mm x 6mm Angle Bar (233 kg).
Metal Channel Bar (100mm x 50mm x 2mm). Qty: 841 kg.`
    },
    {
      id: "office-retrofit",
      title: "Commercial Office Retrofit",
      origin: "Standard Tenant Improvement BOM",
      icon: <Hammer className="w-4 h-4 text-amber-400" />,
      content: `Project: Office Retrofit & Modernization.
Inventory listing for floor dismantlement:

200 sqm Laminated Parquet (Good condition, minimal scratching, glue-down installation).
50x Industrial Light Fixtures (Fluorescent tubes, 2010 model, dual ballast).
2 tons of Concrete Debris (mixed, unreinforced partition remnants).
10x High-quality Aluminum Window Frames (Double glazed units, modular sizing).`
    }
  ];

  return (
    <div className="bg-sleek-panel border border-sleek-border rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-1.5 mb-3">
        <FileText className="w-4 h-4 text-emerald-400" />
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Pre-loaded Inventory References</h4>
      </div>
      <p className="text-xs text-slate-400 mb-4 leading-normal">
        Click any real-world construction document sample below to populate the input workspace with complex, messy structural data.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {samples.map((sample) => (
          <button
            key={sample.id}
            onClick={() => onSelectSample(sample.content)}
            className="flex items-start gap-3 p-3 bg-sleek-bg/60 hover:bg-sleek-bg border border-sleek-border hover:border-emerald-500/30 rounded-lg text-left transition-all group"
          >
            <div className="p-2 bg-sleek-panel group-hover:bg-slate-800 rounded border border-sleek-border transition-colors">
              {sample.icon}
            </div>
            <div className="overflow-hidden">
              <h5 className="text-xs font-semibold text-slate-200 truncate group-hover:text-emerald-400 transition-colors">
                {sample.title}
              </h5>
              <span className="text-[10px] text-slate-500 block truncate font-mono mt-0.5">
                {sample.origin}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
