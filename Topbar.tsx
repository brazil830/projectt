'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, Shield, Wifi, Clock, ChevronDown, Zap, LogOut } from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { toast } from 'sonner';

export default function Topbar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, isAuthenticated, threatLevel, threatMs, phiPurged, emrSyncStatus, agentStatuses, alerts, activeAlerts, logout } = useSession();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      setCurrentTime(
        `${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeAgentCount = Object.values(agentStatuses).filter((s) => s === 'running').length;

  const threatConfig = {
    secure: { cls: 'bg-primary/10 border-primary/20 text-primary', label: 'Secure' },
    warning: { cls: 'bg-warning/10 border-warning/20 text-warning', label: 'Warning' },
    critical: { cls: 'bg-danger/10 border-danger/20 text-danger', label: 'Critical' },
  };

  const handleLogout = () => {
    toast.info('Signing out — PHI session purged');
    setTimeout(() => logout(), 800);
  };

  const displayName = user?.name ?? 'Guest';
  const displayInitials = user?.initials ?? '??';

  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-6 gap-4 flex-shrink-0">
      {/* Search */}
      <div className={`relative flex-1 max-w-md transition-all duration-200 ${searchFocused ? 'max-w-lg' : ''}`}>
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search patients, encounters, codes... (⌘K)"
          className="input-base w-full pl-8 py-1.5 text-xs"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* PHI Zero-Retention Indicator */}
        <div className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all duration-500 ${
          phiPurged ? 'bg-success/10 border-success/20' : 'bg-warning/10 border-warning/20'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${phiPurged ? 'bg-success' : 'bg-warning'}`} />
          <span className={`text-xs font-medium ${phiPurged ? 'text-success' : 'text-warning'}`}>
            {phiPurged ? 'PHI Purged' : 'Processing PHI...'}
          </span>
        </div>

        {/* Threat Status */}
        <div className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${threatConfig[threatLevel].cls}`}>
          <Shield size={12} />
          <span className="text-xs font-medium">{threatConfig[threatLevel].label}</span>
          <span className="text-xs font-mono-data opacity-70">{threatMs}ms</span>
        </div>

        {/* EMR Sync */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary border border-border">
          <Wifi size={12} className={emrSyncStatus === 'connected' ? 'text-success' : 'text-warning'} />
          <span className="text-xs font-medium text-muted-foreground">Epic</span>
          <span className={`text-xs ${emrSyncStatus === 'connected' ? 'text-success' : 'text-warning'}`}>●</span>
        </div>

        {/* Clock */}
        {currentTime && (
          <div className="hidden xl:flex items-center gap-1.5 text-muted-foreground">
            <Clock size={13} />
            <span className="text-xs font-mono-data">{currentTime}</span>
          </div>
        )}

        {/* AI Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
          <Zap size={12} className="text-primary" />
          <span className="text-xs font-semibold text-primary">{activeAgentCount} Agent{activeAgentCount !== 1 ? 's' : ''} Active</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150"
          >
            <Bell size={16} />
            {alerts > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-warning border border-card" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-1 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden slide-up">
              <div className="px-4 py-3 border-b border-border bg-secondary/20 flex items-center justify-between">
                <h3 className="text-xs font-bold text-foreground">Clinical Alerts</h3>
                <span className="text-[10px] text-muted-foreground font-mono-data">{alerts} Active</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto divide-y divide-border/50">
                {activeAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer group"
                    onClick={() => {
                      toast.success(`Opening clinical context for: ${alert.title}`);
                      setShowNotifications(false);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex-shrink-0 w-2 h-2 rounded-full ${
                        alert.type === 'Critical' ? 'bg-danger' : 
                        alert.type === 'Warning' ? 'bg-warning' : 'bg-primary'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="text-xs font-semibold text-foreground truncate">{alert.title}</p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">{alert.time}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{alert.description}</p>
                        <p className="text-[9px] text-primary font-medium mt-1 uppercase tracking-wider">{alert.source}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-border bg-secondary/10">
                <button 
                  onClick={() => {
                    toast.success('All alerts marked as read');
                    setShowNotifications(false);
                  }}
                  className="w-full py-1.5 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors text-center uppercase tracking-widest"
                >
                  Mark All as Read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-secondary transition-all duration-150"
          >
            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">{displayInitials}</span>
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-medium text-foreground block leading-tight">{displayName}</span>
              {user?.role && <span className="text-xs text-muted-foreground block leading-tight">{user.role}</span>}
            </div>
            <ChevronDown size={12} className="text-muted-foreground" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-card border border-border rounded-xl shadow-xl z-50 py-1">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-xs font-semibold text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{user?.organization}</p>
              </div>
              <div className="px-3 py-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  <span className="text-xs text-muted-foreground">{user?.shift} · {user?.floor}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-danger hover:bg-danger/10 transition-colors"
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}