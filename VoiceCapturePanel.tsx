'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Pause, RotateCcw, Volume2, Settings2 } from 'lucide-react';

interface VoiceCapturePanelProps {
  isRecording: boolean;
  setIsRecording: (v: boolean) => void;
}

const BAR_COUNT = 40;

export default function VoiceCapturePanel({ isRecording, setIsRecording }: VoiceCapturePanelProps) {
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRecording, isPaused]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const handleStop = () => {
    setIsRecording(false);
    setIsPaused(false);
    setElapsed(0);
  };

  return (
    <div className="card-base p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Mic size={15} className={isRecording ? 'text-danger' : 'text-muted-foreground'} />
          <h2 className="text-sm font-semibold text-foreground">Ambient Voice Capture</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="hipaa-badge px-2 py-0.5 rounded-full text-xs">98.2% accuracy</span>
          <button className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            <Settings2 size={13} />
          </button>
        </div>
      </div>

      {/* Waveform visualizer */}
      <div className="relative h-20 flex items-center justify-center bg-muted/20 rounded-xl border border-border mb-4 overflow-hidden">
        {isRecording && !isPaused && (
          <div className="absolute inset-0 flex items-center justify-center gap-0.5 px-4">
            {Array.from({ length: BAR_COUNT }).map((_, i) => (
              <div
                key={`wavebar-${i}`}
                className="waveform-bar flex-shrink-0"
                style={{
                  height: '60%',
                  animationDelay: `${i * 0.04}s`,
                  opacity: 0.6 + (i % 5) * 0.08,
                }}
              />
            ))}
          </div>
        )}
        {(!isRecording || isPaused) && (
          <div className="flex flex-col items-center gap-1">
            <Volume2 size={20} className="text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground/60">
              {isPaused ? 'Recording paused' : 'Press record to begin ambient capture'}
            </p>
          </div>
        )}

        {/* Recording ring */}
        {isRecording && !isPaused && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <div className="relative w-3 h-3">
              <div className="absolute inset-0 rounded-full bg-danger recording-ring" />
              <div className="absolute inset-0 rounded-full bg-danger" />
            </div>
            <span className="text-xs font-mono-data text-danger font-semibold">{formatTime(elapsed)}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {!isRecording ? (
          <button
            onClick={() => { setIsRecording(true); setIsPaused(false); setElapsed(0); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-danger text-white font-semibold text-sm transition-all duration-150 hover:brightness-110 active:scale-95 glow-danger"
          >
            <Mic size={16} />
            Start Recording
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              {isPaused ? <Mic size={15} /> : <Pause size={15} />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border text-foreground font-medium text-sm transition-all duration-150 hover:bg-secondary active:scale-95"
            >
              <MicOff size={15} />
              Stop
            </button>
          </>
        )}
        <button
          onClick={() => { setElapsed(0); setIsPaused(false); }}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150"
          title="Reset timer"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Model info */}
      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Medical LLM · Temp: 0.1 (high precision)</span>
        <span className="font-mono-data">PHI: Zero-retention enforced</span>
      </div>
    </div>
  );
}