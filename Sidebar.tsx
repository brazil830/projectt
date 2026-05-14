'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { useSession } from '@/context/SessionContext';
import {
  LayoutDashboard,
  Stethoscope,
  FileText,
  Code2,
  ShieldCheck,
  Calendar,
  Activity,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Lock,
  AlertTriangle,
  GitBranch,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badgeKey?: keyof ReturnType<typeof useDynamicBadges>;
  badgeVariant?: 'success' | 'warning' | 'danger' | 'info';
}

interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

function useDynamicBadges() {
  const { pendingEncounters, pendingAuth, pendingCoding, pendingDocs, alerts } = useSession();
  return {
    pendingEncounters: pendingEncounters ?? 0,
    pendingAuth: pendingAuth ?? 0,
    pendingCoding: pendingCoding ?? 0,
    pendingDocs: pendingDocs ?? 0,
    alerts: alerts ?? 0,
  };
}

const navGroups: NavGroup[] = [
  {
    id: 'group-clinical',
    label: 'CLINICAL',
    items: [
      {
        id: 'nav-dashboard',
        label: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard size={18} />,
      },
      {
        id: 'nav-encounter',
        label: 'Encounter Workspace',
        href: '/clinical-encounter-workspace',
        icon: <Stethoscope size={18} />,
        badgeKey: 'pendingEncounters',
        badgeVariant: 'info',
      },
      {
        id: 'nav-documentation',
        label: 'Documentation',
        href: '/documentation',
        icon: <FileText size={18} />,
        badgeKey: 'pendingDocs',
        badgeVariant: 'warning',
      },
      {
        id: 'nav-coding',
        label: 'Medical Coding',
        href: '/medical-coding',
        icon: <Code2 size={18} />,
        badgeKey: 'pendingCoding',
        badgeVariant: 'danger',
      },
    ],
  },
  {
    id: 'group-agents',
    label: 'AI AGENTS',
    items: [
      {
        id: 'nav-agents',
        label: 'Agent Orchestration',
        href: '/agent-orchestration',
        icon: <Cpu size={18} />,
      },
      {
        id: 'nav-digital-twin',
        label: 'Digital Twin Engine',
        href: '/digital-twin-engine',
        icon: <GitBranch size={18} />,
      },
      {
        id: 'nav-prior-auth',
        label: 'Prior Authorization',
        href: '/prior-authorization',
        icon: <ShieldCheck size={18} />,
        badgeKey: 'pendingAuth',
        badgeVariant: 'warning',
      },
    ],
  },
  {
    id: 'group-ops',
    label: 'OPERATIONS',
    items: [
      {
        id: 'nav-scheduling',
        label: 'Scheduling',
        href: '/scheduling',
        icon: <Calendar size={18} />,
      },
      {
        id: 'nav-audit',
        label: 'Audit Ledger',
        href: '/audit-ledger',
        icon: <Activity size={18} />,
      },
      {
        id: 'nav-security',
        label: 'Security & PHI',
        href: '/security-phi',
        icon: <Lock size={18} />,
        badgeKey: 'alerts',
        badgeVariant: 'danger',
      },
      {
        id: 'nav-patients',
        label: 'Patient Registry',
        href: '/patient-registry',
        icon: <Users size={18} />,
      },
    ],
  },
];

const badgeClasses = {
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  danger: 'bg-danger/20 text-danger',
  info: 'bg-primary/20 text-primary',
};

interface SidebarProps {
  currentPath?: string;
}

export default function Sidebar({ currentPath = '/' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Call hooks unconditionally (React Hooks rules)
  const session = useSession();
  const badges = useDynamicBadges();

  // Safe session access with null checks
  const user = session.user;
  const isAuthenticated = session.isAuthenticated;

  // Handle navigation errors safely
  const handleNavigation = (href: string, event: React.MouseEvent) => {
    try {
      // Navigation safety: Link component handles the actual navigation
      // This handler is for error logging if needed in the future
    } catch (error) {
      console.error('Navigation error:', error);
      event.preventDefault();
    }
  };

  return (
    <aside
      className="flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out flex-shrink-0"
      style={{ width: collapsed ? '64px' : '240px' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-border min-h-[64px]">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <AppLogo size={28} />
            <span className="font-semibold text-sm text-foreground truncate tracking-tight">
              ClinicalCopilot
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto">
            <AppLogo size={28} />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150 flex-shrink-0 ml-auto"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* PHI Status Badge */}
      {!collapsed && (
        <div className="px-3 py-2 border-b border-border">
          <div className="phi-badge px-2 py-1 rounded-md text-xs flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="font-medium">Zero-Retention PHI Active</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
        {navGroups.map((group) => (
          <div key={group.id} className="mb-4">
            {!collapsed && (
              <p className="text-xs font-semibold text-muted-foreground px-3 mb-1 tracking-widest uppercase">
                {group.label}
              </p>
            )}
            {collapsed && <div className="border-t border-border mx-2 mb-2 mt-1" />}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = currentPath === item.href && item.href !== '/dashboard';
                const isHome = item.href === '/dashboard' && currentPath === '/dashboard';
                const active = isActive || isHome;
                const badgeCount = item.badgeKey ? badges[item.badgeKey] : undefined;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavigation(item.href, e)}
                  >
                    <div
                      className={active ? 'nav-item-active' : 'nav-item'}
                      title={collapsed ? item.label : undefined}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {badgeCount !== undefined && badgeCount > 0 && (
                            <span
                              className={`text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${badgeClasses[item.badgeVariant || 'info']}`}
                            >
                              {badgeCount}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && badgeCount !== undefined && badgeCount > 0 && (
                        <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-danger" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: Settings + User */}
      <div className="border-t border-border p-2 space-y-0.5">
        <Link href="/settings" onClick={(e) => handleNavigation('/settings', e)}>
          <div className={`nav-item ${currentPath === '/settings' ? 'nav-item-active' : ''}`}>
            <Settings size={18} className="flex-shrink-0" />
            {!collapsed && <span className="flex-1">Settings</span>}
          </div>
        </Link>

        {/* Session user info at bottom */}
        {isAuthenticated && user && !collapsed && (
          <div className="mt-2 pt-2 border-t border-border px-1">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/30">
              <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-primary">{user.initials || 'U'}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {user.name || 'Unknown User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.role || 'Staff'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
