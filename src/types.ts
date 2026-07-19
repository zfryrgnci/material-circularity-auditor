export interface MaterialAudit {
  id: string;
  name: string;
  category: string; // e.g., "Steel", "Timber", "Glass", "Concrete", "Electrical", "HVAC", "Finishes"
  quantity: string;
  unit: string;
  reusePotential: "High" | "Medium" | "Low" | "REQUIRES VERIFICATION";
  reuseChannel: string;
  co2SavingsKg: number; // estimated CO2 saved in kg
  justification: string;
  notes?: string;
}

export interface AuditProject {
  id: string;
  name: string;
  description: string;
  location?: string;
  date: string;
  materials: MaterialAudit[];
  totalCO2SavingsKg: number;
  circularityScore: number; // 0 - 100
}

export interface ApiSnippet {
  language: string;
  code: string;
}
