'use client';

import React, { useState } from 'react';
import { Sparkles, Edit3, Check, Copy, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface SOAPSection {
  id: string;
  label: string;
  key: 'subjective' | 'objective' | 'assessment' | 'plan';
  content: string;
  aiGenerated: boolean;
  expanded: boolean;
}

const initialSections: SOAPSection[] = [
  {
    id: 'soap-s',
    label: 'S — Subjective',
    key: 'subjective',
    aiGenerated: true,
    expanded: true,
    content: `Chief Complaint: New onset hypertension with associated headaches × 3 weeks.

HPI: Ms. Chandrasekaran is a 38-year-old female presenting as a new patient with a 3-week history of persistent headaches, predominantly occipital in distribution and worse in the mornings. She reports a pharmacy blood pressure reading of 150/95 mmHg approximately 1 week ago. She denies chest pain but reports dyspnea on exertion when climbing stairs. No syncope, no visual changes, no epistaxis.

PMH: Hyperlipidemia (noted 2 years ago, not followed up or treated).
Medications: Ibuprofen PRN for headaches. No prescription medications.
Allergies: Penicillin (anaphylaxis), Sulfonamides (rash).
Family History: Father — myocardial infarction at age 62.
Social History: Non-smoker, non-drinker. Works as software engineer. Sedentary lifestyle.
ROS: Positive for headache, dyspnea on exertion. Negative for chest pain, palpitations, edema, visual changes.`,
  },
  {
    id: 'soap-o',
    label: 'O — Objective',
    key: 'objective',
    aiGenerated: true,
    expanded: true,
    content: `Vitals: BP 148/92 mmHg (elevated), HR 88 bpm (regular), RR 18, SpO₂ 97% on room air, Temp 98.6°F, Wt 62 kg, BMI 24.1.

Physical Examination:
• General: Alert, oriented ×3, in no acute distress.
• Cardiovascular: Regular rate and rhythm. No S3 or S4 gallop. No murmurs, rubs, or gallops. No peripheral edema.
• Pulmonary: Clear to auscultation bilaterally. No wheezes, rales, or rhonchi.
• Neurological: Cranial nerves II–XII intact. No focal deficits. Fundoscopic exam: no papilledema, no AV nicking noted.
• Abdomen: Soft, non-tender, non-distended. No renal bruits.`,
  },
  {
    id: 'soap-a',
    label: 'A — Assessment',
    key: 'assessment',
    aiGenerated: true,
    expanded: true,
    content: `1. New onset hypertension (I10) — Stage 1 hypertension per JNC 8 criteria (BP 148/92). Contributing factors likely include: sedentary lifestyle, untreated hyperlipidemia, NSAID use (ibuprofen), and positive family history of premature cardiovascular disease.

2. Hyperlipidemia, unspecified (E78.5) — Previously identified, not on statin therapy. Requires fasting lipid panel.

3. Dyspnea on exertion (R06.09) — In context of new hypertension and family history; requires cardiac evaluation to rule out hypertensive cardiomyopathy.

4. Occipital headache (R51.9) — Likely hypertension-related given clinical context and morning predominance.

Risk Stratification: Moderate-high cardiovascular risk given family history of premature MI, untreated hyperlipidemia, and sustained hypertension.`,
  },
  {
    id: 'soap-p',
    label: 'P — Plan',
    key: 'plan',
    aiGenerated: true,
    expanded: false,
    content: `1. Hypertension Management:
   • Initiate amlodipine 5mg PO daily (CCB preferred given no contraindications, age <60).
   • Discontinue ibuprofen — switch to acetaminophen PRN for headaches (NSAID-induced BP elevation).
   • DASH diet counseling provided. Exercise 30 min/day × 5 days/week.
   • Home BP monitoring: log twice daily, return in 4 weeks for recheck.

2. Hyperlipidemia:
   • Order fasting lipid panel, CMP, TSH, HbA1c, CBC.
   • If LDL ≥130 mg/dL: initiate atorvastatin 20mg daily.

3. Cardiac Evaluation:
   • Order 12-lead ECG today.
   • Refer to cardiology for stress echocardiogram given dyspnea on exertion + family history.
   • Prior authorization submitted for cardiac stress test + echo (CPT 93306).

4. Follow-up: 4 weeks or sooner if BP >160/100, chest pain, or worsening symptoms.
5. Patient education: hypertension management, DASH diet, medication compliance, warning signs.`,
  },
];

export default function SOAPNoteEditor() {
  const [sections, setSections] = useState<SOAPSection[]>(initialSections);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, expanded: !s.expanded } : s))
    );
  };

  const handleEdit = (id: string) => setEditingId(id);

  const handleSave = (id: string) => {
    setEditingId(null);
    toast.success('SOAP section saved');
  };

  const handleContentChange = (id: string, value: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content: value, aiGenerated: false } : s))
    );
  };

  const handleRegenerate = (id: string) => {
    setRegenerating(id);
    // Backend: POST /api/soap/regenerate { sectionKey, transcriptId, encounterId }
    setTimeout(() => {
      setRegenerating(null);
      toast.success('Section regenerated by Medical LLM');
    }, 1800);
  };

  const handleCopy = (content: string) => {
    toast.success('Section copied to clipboard');
  };

  return (
    <div className="card-base flex flex-col overflow-hidden flex-1">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">AI-Generated SOAP Note</h2>
          <span className="badge-info text-xs">AI Draft</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Medical LLM · temp=0.1</span>
          <button
            onClick={() => toast.success('Full SOAP note regenerated')}
            className="btn-secondary flex items-center gap-1 text-xs py-1"
          >
            <RefreshCw size={11} />
            Regen All
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
        {sections.map((section) => (
          <div
            key={section.id}
            className="rounded-lg border border-border overflow-hidden"
          >
            {/* Section header */}
            <div
              className="flex items-center justify-between px-3 py-2.5 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-all duration-150"
              onClick={() => toggleExpand(section.id)}
            >
              <div className="flex items-center gap-2">
                <div className="soap-section-border pl-2">
                  <span className="text-xs font-semibold text-primary">{section.label}</span>
                </div>
                {section.aiGenerated && (
                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <Sparkles size={9} className="text-primary" />
                    AI
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleCopy(section.content)}
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                  title="Copy section"
                >
                  <Copy size={12} />
                </button>
                <button
                  onClick={() => handleRegenerate(section.id)}
                  className={`p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all ${regenerating === section.id ? 'animate-spin' : ''}`}
                  title="Regenerate with AI"
                  disabled={regenerating === section.id}
                >
                  <RefreshCw size={12} />
                </button>
                {editingId === section.id ? (
                  <button
                    onClick={() => handleSave(section.id)}
                    className="p-1 rounded text-success hover:bg-success/10 transition-all"
                    title="Save edits"
                  >
                    <Check size={12} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(section.id)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                    title="Edit section"
                  >
                    <Edit3 size={12} />
                  </button>
                )}
                {section.expanded ? (
                  <ChevronUp size={13} className="text-muted-foreground" />
                ) : (
                  <ChevronDown size={13} className="text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Section content */}
            {section.expanded && (
              <div className="fade-in">
                {regenerating === section.id ? (
                  <div className="p-4 space-y-2">
                    {[100, 85, 92, 70].map((w, i) => (
                      <div
                        key={`skel-${section.id}-${i}`}
                        className="h-3 animate-pulse bg-muted rounded"
                        style={{ width: `${w}%` }}
                      />
                    ))}
                  </div>
                ) : editingId === section.id ? (
                  <textarea
                    className="w-full p-3 bg-muted/20 text-xs text-foreground leading-relaxed font-mono-data resize-none focus:outline-none focus:bg-primary/5 transition-all"
                    rows={12}
                    value={section.content}
                    onChange={(e) => handleContentChange(section.id, e.target.value)}
                    autoFocus
                  />
                ) : (
                  <div className="p-3">
                    <pre className="text-xs text-foreground/85 leading-relaxed whitespace-pre-wrap font-sans">
                      {section.content}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="px-4 py-2.5 border-t border-border flex items-center justify-between flex-shrink-0">
        <p className="text-xs text-muted-foreground">
          4 sections · <span className="text-success">Auto-generated from transcript</span>
        </p>
        <button
          onClick={() => toast.success('SOAP note finalized and queued for EMR sync')}
          className="btn-primary text-xs py-1.5 flex items-center gap-1"
        >
          <Check size={12} />
          Finalize Note
        </button>
      </div>
    </div>
  );
}