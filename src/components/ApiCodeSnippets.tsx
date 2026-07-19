import React, { useState } from "react";
import { Code2, Copy, Check, Info } from "lucide-react";

export default function ApiCodeSnippets() {
  const [activeTab, setActiveTab] = useState<"curl" | "js" | "python">("curl");
  const [copied, setCopied] = useState(false);

  const getAppUrl = () => {
    // Falls back to standard origin or the AI Studio development environment URL injected
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "https://circularity-auditor.yourdomain.com";
  };

  const snippets = {
    curl: {
      lang: "Bash / cURL",
      code: `curl -X POST "${getAppUrl()}/api/audit" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Project: Office Retrofit. Inventory: 200sqm Laminated Parquet (Good condition). 50x Industrial Light Fixtures (Fluorescent, 2010 model)."
  }'`
    },
    js: {
      lang: "JavaScript",
      code: `async function runCircularityAudit(inventoryText) {
  const response = await fetch("${getAppUrl()}/api/audit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: inventoryText })
  });
  
  if (!response.ok) {
    throw new Error("Circularity Audit failed");
  }
  
  const auditReport = await response.json();
  console.log("Project Name:", auditReport.projectName);
  console.log("Audited Materials:", auditReport.materials);
  return auditReport;
}`
    },
    python: {
      lang: "Python",
      code: `import requests

def audit_materials(inventory_text):
    url = "${getAppUrl()}/api/audit"
    payload = {
        "text": inventory_text
    }
    
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        audit_report = response.json()
        print(f"Project Name: {audit_report['projectName']}")
        print(f"Description: {audit_report['description']}")
        return audit_report
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None`
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-sleek-panel border border-sleek-border rounded-xl p-6 h-full flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] text-emerald-400 tracking-widest uppercase">API ACCESSIBILITY</span>
            <h3 className="text-lg font-semibold text-slate-100 mt-0.5">Programmatic API Integration</h3>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Enable construction firms and demolition contractors to automate their workflows. Integrate StructuraLoop's material parsing directly into custom ERP, BIM software (Revit), or spreadsheet exports.
        </p>

        {/* Language Tabs */}
        <div className="flex border-b border-sleek-border mb-4">
          {(Object.keys(snippets) as Array<keyof typeof snippets>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 text-xs font-mono border-b-2 -mb-px transition-all cursor-pointer ${
                activeTab === key
                  ? "border-emerald-500 text-emerald-400 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {snippets[key].lang}
            </button>
          ))}
        </div>

        {/* Code Block */}
        <div className="relative bg-sleek-bg border border-sleek-border rounded-lg p-4 font-mono text-xs overflow-x-auto text-slate-300 leading-relaxed min-h-[180px] max-h-[220px]">
          <pre className="whitespace-pre">{snippets[activeTab].code}</pre>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-1.5 bg-sleek-panel hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded border border-sleek-border transition-colors cursor-pointer"
            title="Copy code to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="mt-5 p-3.5 bg-sleek-bg/60 border border-sleek-border rounded-lg flex gap-3 items-start">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-[11px] text-slate-400 leading-normal">
          <strong className="text-slate-200 block mb-0.5">JSON Schema Enforcement</strong>
          All responses are strictly formatted with structured JSON arrays detailing Category, Quantity, Unit, Reuse Potential, Suggested Reuse Channel, and CO2 Savings (kg).
        </div>
      </div>
    </div>
  );
}
