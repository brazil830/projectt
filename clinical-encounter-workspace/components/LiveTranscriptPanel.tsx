'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileText, Copy, Trash2, ChevronDown } from 'lucide-react';

interface TranscriptSegment {
  id: string;
  speaker: 'Physician' | 'Patient';
  text: string;
  timestamp: string;
  medTerms: string[];
  confidence: number;
}

const staticTranscript: TranscriptSegment[] = [
  {
    id: 'seg-001',
    speaker: 'Physician',
    text: 'Good morning, Ms. Chandrasekaran. I see you\'re visiting us today for a new patient evaluation. Can you describe what\'s been going on?',
    timestamp: '09:02:14',
    medTerms: [],
    confidence: 99,
  },
  {
    id: 'seg-002',
    speaker: 'Patient',
    text: 'Yes, I\'ve been having really bad headaches for about three weeks now, and my pharmacist mentioned my blood pressure was high when I checked it at the pharmacy last week — it was one-fifty over ninety-five.',
    timestamp: '09:02:31',
    medTerms: ['hypertension', 'blood pressure'],
    confidence: 97,
  },
  {
    id: 'seg-003',
    speaker: 'Physician',
    text: 'Any family history of hypertension or cardiovascular disease? Any chest pain, palpitations, or shortness of breath associated with the headaches?',
    timestamp: '09:03:05',
    medTerms: ['hypertension', 'cardiovascular disease', 'palpitations'],
    confidence: 99,
  },
  {
    id: 'seg-004',
    speaker: 'Patient',
    text: 'My father had a heart attack at sixty-two. No chest pain, but I do get a little short of breath when I climb stairs. The headaches are mostly in the morning, occipital region.',
    timestamp: '09:03:28',
    medTerms: ['myocardial infarction', 'dyspnea on exertion', 'occipital headache'],
    confidence: 96,
  },
  {
    id: 'seg-005',
    speaker: 'Physician',
    text: 'Any current medications? Any history of renal disease, diabetes, or hyperlipidemia? Are you a smoker?',
    timestamp: '09:04:01',
    medTerms: ['renal disease', 'diabetes mellitus', 'hyperlipidemia'],
    confidence: 99,
  },
  {
    id: 'seg-006',
    speaker: 'Patient',
    text: 'I take ibuprofen sometimes for the headaches, that\'s it. No other medications. No smoking. I had high cholesterol noted two years ago but never followed up on it.',
    timestamp: '09:04:22',
    medTerms: ['hyperlipidemia', 'NSAID use'],
    confidence: 95,
  },
];

const liveSegments: TranscriptSegment[] = [
  {
    id: 'seg-007',
    speaker: 'Physician',
    text: 'On examination today, blood pressure is one-forty-eight over ninety-two, heart rate eighty-eight, regular rhythm. Lungs clear to auscultation bilaterally. No S3 or S4 gallop. No peripheral edema.',
    timestamp: '09:05:10',
    medTerms: ['auscultation', 'S3 gallop', 'S4 gallop', 'peripheral edema'],
    confidence: 98,
  },
];

interface LiveTranscriptPanelProps {
  isRecording: boolean;
}

export default function LiveTranscriptPanel({ isRecording }: LiveTranscriptPanelProps) {
  const [segments, setSegments] = useState<TranscriptSegment[]>(staticTranscript);
  const [showLive, setShowLive] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRecording && !showLive) {
      const timeout = setTimeout(() => {
        setSegments((prev) => [...prev, ...liveSegments]);
        setShowLive(true);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [isRecording, showLive]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [segments]);

  const highlightMedTerms = (text: string, terms: string[]) => {
    if (!terms.length) return <span>{text}</span>;
    let result = text;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const lowerText = text.toLowerCase();

    terms.forEach((term) => {
      const idx = lowerText.indexOf(term.toLowerCase());
      if (idx !== -1) {
        if (idx > lastIndex) parts.push(<span key={`pre-${term}`}>{text.slice(lastIndex, idx)}</span>);
        parts.push(
          <span
            key={`term-${term}`}
            className="bg-primary/20 text-primary px-0.5 rounded border-b border-primary/40 cursor-help"
            title={`Medical term: ${term}`}
          >
            {text.slice(idx, idx + term.length)}
          </span>
        );
        lastIndex = idx + term.length;
      }
    });
    if (lastIndex < text.length) parts.push(<span key="tail">{text.slice(lastIndex)}</span>);
    return parts.length > 0 ? <>{parts}</> : <span>{result}</span>;
  };

  return (
    <div className="card-base flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileText size={15} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Live Transcript</h2>
          {isRecording && (
            <span className="badge-danger flex items-center gap-1 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
              Live
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            title="Copy transcript"
          >
            <Copy size={13} />
          </button>
          <button
            className="p-1.5 rounded text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all"
            title="Clear transcript"
          >
            <Trash2 size={13} />
          </button>
          <button className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            <ChevronDown size={13} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3" style={{ maxHeight: '420px' }}>
        {segments.map((seg) => (
          <div
            key={seg.id}
            className={`fade-in flex gap-3 ${seg.speaker === 'Physician' ? '' : 'flex-row-reverse'}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5 ${
                seg.speaker === 'Physician' ?'bg-primary/20 text-primary border border-primary/30' :'bg-muted border border-border text-muted-foreground'
              }`}
            >
              {seg.speaker === 'Physician' ? 'DR' : 'PT'}
            </div>
            <div className={`flex-1 max-w-[85%] ${seg.speaker === 'Patient' ? 'text-right' : ''}`}>
              <div
                className={`inline-block px-3 py-2 rounded-xl text-xs leading-relaxed ${
                  seg.speaker === 'Physician' ?'bg-primary/10 border border-primary/20 text-foreground' :'bg-muted border border-border text-foreground'
                }`}
              >
                {highlightMedTerms(seg.text, seg.medTerms)}
              </div>
              <div className={`flex items-center gap-2 mt-1 ${seg.speaker === 'Patient' ? 'justify-end' : ''}`}>
                <span className="text-xs font-mono-data text-muted-foreground">{seg.timestamp}</span>
                <span className="text-xs text-muted-foreground">
                  {seg.confidence}% conf.
                </span>
                {seg.medTerms.length > 0 && (
                  <span className="text-xs text-primary">
                    {seg.medTerms.length} term{seg.medTerms.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isRecording && (
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0 mt-0.5">
              DR
            </div>
            <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20">
              {[0, 1, 2].map((i) => (
                <div
                  key={`dot-${i}`}
                  className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-2 border-t border-border flex items-center justify-between flex-shrink-0">
        <p className="text-xs text-muted-foreground">
          <span className="font-mono-data text-foreground/70">{segments.length}</span> segments ·{' '}
          <span className="text-primary">Medical terms highlighted</span>
        </p>
        <span className="text-xs text-muted-foreground">PHI processing in-memory only</span>
      </div>
    </div>
  );
}