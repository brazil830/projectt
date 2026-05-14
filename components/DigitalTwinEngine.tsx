'use client';

import React, { useState } from 'react';
import {
  GitBranch,
  Activity,
  TrendingUp,
  Brain,
  Heart,
  Wind,
  Play,
  Pause,
  Pill,
} from 'lucide-react';
import { toast } from 'sonner';

interface SimulationModel {
  id: string;
  name: string;
  type: string;
  status: 'Ready' | 'Running' | 'Completed';
  accuracy: number;
  lastRun: string;
}

const initialModels: SimulationModel[] = [
  {
    id: 'model-001',
    name: 'Cardiac Outcome Predictor',
    type: 'Cardiology',
    status: 'Ready',
    accuracy: 94,
    lastRun: '2 hours ago',
  },
  {
    id: 'model-002',
    name: 'Treatment Response Simulator',
    type: 'Pharmacology',
    status: 'Completed',
    accuracy: 89,
    lastRun: '5 hours ago',
  },
  {
    id: 'model-003',
    name: 'Readmission Risk Model',
    type: 'Population Health',
    status: 'Running',
    accuracy: 91,
    lastRun: 'Running now',
  },
  {
    id: 'model-004',
    name: 'Drug Interaction Analyzer',
    type: 'Pharmacovigilance',
    status: 'Ready',
    accuracy: 97,
    lastRun: '1 day ago',
  },
];

const statusConfig: Record<string, { icon: React.ReactNode; cls: string }> = {
  Ready: { icon: <Activity size={11} />, cls: 'badge-muted' },
  Running: { icon: <TrendingUp size={11} />, cls: 'badge-info' },
  Completed: { icon: <Activity size={11} />, cls: 'badge-success' },
};

export default function DigitalTwinEngine() {
  const [models, setModels] = useState<SimulationModel[]>(initialModels);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newModel, setNewModel] = useState({ name: '', type: 'Cardiology' });
  const [simulationData, setSimulationData] = useState<{
    outcome: string;
    riskScore: number;
    intervention: string;
  } | null>(null);

  const handleNewSimulation = () => {
    setIsNewModalOpen(true);
  };

  const createModel = () => {
    if (!newModel.name) {
      toast.error('Please provide a model name');
      return;
    }

    const created: SimulationModel = {
      id: `model-${Date.now()}`,
      name: newModel.name,
      type: newModel.type,
      status: 'Ready',
      accuracy: Math.floor(Math.random() * 10) + 88,
      lastRun: 'Never'
    };

    setModels([created, ...models]);
    setSelectedModel(created.id);
    setIsNewModalOpen(false);
    setNewModel({ name: '', type: 'Cardiology' });
    toast.success(`${created.name} created successfully`);
  };

  const handleToggleSimulation = () => {
    if (!isSimulationRunning) {
      setIsSimulationRunning(true);
      setShowResults(false);
      setProgress(0);
      toast.success('Starting high-fidelity simulation...');
      
      // Simulate simulation stages
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 15) + 5;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setIsSimulationRunning(false);
          setShowResults(true);
          setSimulationData({
            outcome: Math.random() > 0.5 ? 'Positive Response' : 'Guarded Prognosis',
            riskScore: Math.floor(Math.random() * 40) + 10,
            intervention: 'Increase dosage of ACE inhibitors by 5mg'
          });
          toast.success('Simulation sequence completed');
        }
        setProgress(currentProgress);
      }, 600);
    } else {
      setIsSimulationRunning(false);
      setProgress(0);
      toast.info('Simulation aborted');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">4</p>
              <p className="text-xs text-muted-foreground">Active Models</p>
            </div>
            <Brain className="text-primary" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-success">93%</p>
              <p className="text-xs text-muted-foreground">Avg. Accuracy</p>
            </div>
            <TrendingUp className="text-success" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">156</p>
              <p className="text-xs text-muted-foreground">Simulations Today</p>
            </div>
            <GitBranch className="text-muted-foreground" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">2.3s</p>
              <p className="text-xs text-muted-foreground">Avg. Runtime</p>
            </div>
            <Activity className="text-muted-foreground" size={20} />
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model List */}
        <div className="card-base overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <GitBranch size={15} className="text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Simulation Models</h2>
            </div>
            <button
              onClick={handleNewSimulation}
              className="btn-primary text-xs flex items-center gap-1"
            >
              <Play size={14} />
              New Simulation
            </button>
          </div>

          <div className="divide-y divide-border/50">
            {models.map((model) => {
              const scfg = statusConfig[model.status];
              return (
                <div
                  key={model.id}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-secondary/30 transition-all duration-150 cursor-pointer ${
                    selectedModel === model.id ? 'bg-secondary/50' : ''
                  }`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                    {model.type === 'Cardiology' && <Heart size={16} className="text-primary" />}
                    {model.type === 'Pharmacology' && <Pill size={16} className="text-primary" />}
                    {model.type === 'Population Health' && (
                      <Activity size={16} className="text-primary" />
                    )}
                    {model.type === 'Pharmacovigilance' && (
                      <Brain size={16} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-medium text-foreground truncate">{model.name}</p>
                      <span className={scfg.cls + ' flex items-center gap-1 flex-shrink-0'}>
                        {scfg.icon}
                        {model.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{model.type}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">
                        Accuracy:{' '}
                        <span className="font-mono-data text-foreground">{model.accuracy}%</span>
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{model.lastRun}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Simulation Details */}
        <div className="card-base overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Brain size={15} className="text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Simulation Details</h2>
            </div>
            {isSimulationRunning ? (
              <button
                className="btn-danger text-xs flex items-center gap-1"
                onClick={handleToggleSimulation}
              >
                <Pause size={14} />
                Stop
              </button>
            ) : (
              <button
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-success/20 text-success border border-success/30 hover:bg-success/30 transition-all"
                onClick={handleToggleSimulation}
              >
                <Play size={14} />
                Run
              </button>
            )}
          </div>

          {selectedModel ? (
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {models.find((m) => m.id === selectedModel)?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {models.find((m) => m.id === selectedModel)?.type} model for predictive clinical
                    analysis
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                    <p className="text-2xl font-bold text-foreground">
                      {models.find((m) => m.id === selectedModel)?.accuracy}%
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="text-2xl font-bold text-foreground">
                      {models.find((m) => m.id === selectedModel)?.status}
                    </p>
                  </div>
                </div>

                {isSimulationRunning && (
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <p className="text-sm font-medium text-primary">Simulation Running</p>
                      </div>
                      <span className="text-xs font-mono-data text-primary">{progress}%</span>
                    </div>
                    <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground italic">
                      {progress < 30 ? 'Ingesting patient longitudinal data...' : 
                       progress < 60 ? 'Mapping synthetic twin parameters...' : 
                       'Running Monte Carlo outcome iterations...'}
                    </p>
                  </div>
                )}

                {showResults && simulationData && (
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20 space-y-4 fade-in">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-success" />
                      <p className="text-sm font-bold text-success">Simulation Results</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Predicted Outcome</p>
                        <p className="text-sm font-semibold text-foreground">{simulationData.outcome}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Mortality Risk</p>
                        <p className="text-sm font-semibold text-danger">{simulationData.riskScore}%</p>
                      </div>
                    </div>

                    <div className="p-3 bg-success/5 rounded-lg border border-success/10">
                      <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">AI Recommendation</p>
                      <p className="text-xs text-foreground leading-relaxed">
                        {simulationData.intervention}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => toast.info('Exporting simulation data...')}
                      className="w-full py-2 bg-success/20 text-success text-xs font-semibold rounded-lg hover:bg-success/30 transition-all border border-success/30"
                    >
                      Export Full Analysis
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Model Parameters</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Training Data Size</span>
                      <span className="font-mono-data text-foreground">50,000 records</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Features</span>
                      <span className="font-mono-data text-foreground">127 clinical variables</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span className="font-mono-data text-foreground">3 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <GitBranch size={48} className="text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Select a Model</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Choose a simulation model from the list to view details and run predictions
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Simulation Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm fade-in">
          <div className="w-full max-w-md card-base bg-card shadow-2xl overflow-hidden slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Play className="text-primary" size={20} />
                </div>
                <h3 className="text-lg font-bold text-foreground">New Simulation</h3>
              </div>
              <button 
                onClick={() => setIsNewModalOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
              >
                <TrendingUp size={20} className="rotate-45" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Model Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Sepsis Early Warning"
                  value={newModel.name}
                  onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                  className="input-base w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Specialty</label>
                <select 
                  value={newModel.type}
                  onChange={(e) => setNewModel({ ...newModel, type: e.target.value })}
                  className="input-base w-full"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pharmacology">Pharmacology</option>
                  <option value="Population Health">Population Health</option>
                  <option value="Pharmacovigilance">Pharmacovigilance</option>
                  <option value="Oncology">Oncology</option>
                </select>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button 
                  onClick={createModel}
                  className="flex-1 btn-primary py-2.5"
                >
                  Create & Initialize
                </button>
                <button 
                  onClick={() => setIsNewModalOpen(false)}
                  className="flex-1 btn-secondary py-2.5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
