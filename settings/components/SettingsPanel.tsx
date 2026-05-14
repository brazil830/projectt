'use client';

import React, { useState } from 'react';
import { Settings, User, Shield, Bell, Database, Palette } from 'lucide-react';
import { toast } from 'sonner';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: {
    label: string;
    description: string;
    type: 'toggle' | 'select' | 'input';
    value?: string | boolean;
  }[];
}

const sections: SettingSection[] = [
  {
    id: 'profile',
    title: 'Profile Settings',
    icon: <User size={18} />,
    items: [
      {
        label: 'Display Name',
        description: 'Your name as shown to other users',
        type: 'input',
        value: 'Dr. Rachel Okonkwo',
      },
      {
        label: 'Email',
        description: 'Your email address for notifications',
        type: 'input',
        value: 'r.okonkwo@valleymed.org',
      },
      {
        label: 'Role',
        description: 'Your clinical role',
        type: 'select',
        value: 'Attending Physician',
      },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    icon: <Shield size={18} />,
    items: [
      {
        label: 'Two-Factor Authentication',
        description: 'Require 2FA for login',
        type: 'toggle',
        value: true,
      },
      {
        label: 'Session Timeout',
        description: 'Auto-logout after inactivity',
        type: 'select',
        value: '30 minutes',
      },
      {
        label: 'IP Whitelist',
        description: 'Restrict access to specific IPs',
        type: 'toggle',
        value: false,
      },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: <Bell size={18} />,
    items: [
      {
        label: 'Email Notifications',
        description: 'Receive alerts via email',
        type: 'toggle',
        value: true,
      },
      {
        label: 'Push Notifications',
        description: 'Receive in-app notifications',
        type: 'toggle',
        value: true,
      },
      {
        label: 'Critical Alerts Only',
        description: 'Only receive critical security alerts',
        type: 'toggle',
        value: false,
      },
    ],
  },
  {
    id: 'emr',
    title: 'EMR Integration',
    icon: <Database size={18} />,
    items: [
      {
        label: 'Auto-Sync',
        description: 'Automatically sync with EMR',
        type: 'toggle',
        value: true,
      },
      {
        label: 'Sync Interval',
        description: 'How often to sync data',
        type: 'select',
        value: 'Real-time',
      },
      {
        label: 'FHIR Endpoint',
        description: 'EMR FHIR API endpoint',
        type: 'input',
        value: 'https://api.valleymed.org/fhir',
      },
    ],
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: <Palette size={18} />,
    items: [
      {
        label: 'Theme',
        description: 'Choose your preferred theme',
        type: 'select',
        value: 'Light',
      },
      {
        label: 'Compact Mode',
        description: 'Use more compact UI layout',
        type: 'toggle',
        value: false,
      },
      {
        label: 'Font Size',
        description: 'Adjust the base font size',
        type: 'select',
        value: 'Medium',
      },
    ],
  },
];

export default function SettingsPanel() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    'Two-Factor Authentication': true,
    'IP Whitelist': false,
    'Email Notifications': true,
    'Push Notifications': true,
    'Critical Alerts Only': false,
    'Auto-Sync': true,
    'Compact Mode': false,
  });

  const [inputValues, setInputValues] = useState<Record<string, string>>({
    'Display Name': 'Dr. Rachel Okonkwo',
    Email: 'r.okonkwo@valleymed.org',
    'FHIR Endpoint': 'https://api.valleymed.org/fhir',
  });

  const [selectValues, setSelectValues] = useState<Record<string, string>>({
    Role: 'Attending Physician',
    'Session Timeout': '30 minutes',
    'Sync Interval': 'Real-time',
    Theme: 'Light',
    'Font Size': 'Medium',
  });

  const handleToggle = (label: string) => {
    const newValue = !settings[label];
    setSettings((prev) => ({ ...prev, [label]: newValue }));
    toast.success(`${label} ${newValue ? 'enabled' : 'disabled'}`);
  };

  const handleInputChange = (label: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [label]: value }));
  };

  const handleSelectChange = (label: string, value: string) => {
    setSelectValues((prev) => ({ ...prev, [label]: value }));
    toast.success(`${label} changed to ${value}`);
  };

  const handleReset = () => {
    setSettings({
      'Two-Factor Authentication': true,
      'IP Whitelist': false,
      'Email Notifications': true,
      'Push Notifications': true,
      'Critical Alerts Only': false,
      'Auto-Sync': true,
      'Compact Mode': false,
    });
    setInputValues({
      'Display Name': 'Dr. Rachel Okonkwo',
      Email: 'r.okonkwo@valleymed.org',
      'FHIR Endpoint': 'https://api.valleymed.org/fhir',
    });
    setSelectValues({
      Role: 'Attending Physician',
      'Session Timeout': '30 minutes',
      'Sync Interval': 'Real-time',
      Theme: 'Light',
      'Font Size': 'Medium',
    });
    toast.success('All settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.id} className="card-base overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <span className="text-primary">{section.icon}</span>
              <h2 className="text-sm font-semibold text-foreground">{section.title}</h2>
            </div>
            <div className="p-4 space-y-4">
              {section.items.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">{item.label}</label>
                    {item.type === 'toggle' && (
                      <button
                        onClick={() => handleToggle(item.label)}
                        className={`w-10 h-5 rounded-full transition-colors ${
                          settings[item.label] ? 'bg-primary' : 'bg-muted'
                        } relative`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                            settings[item.label] ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                  {item.type === 'select' && (
                    <select
                      value={selectValues[item.label]}
                      onChange={(e) => handleSelectChange(item.label, e.target.value)}
                      className="mt-2 w-full px-3 py-2 text-sm bg-secondary/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option>{item.value}</option>
                      <option>Option 2</option>
                      <option>Option 3</option>
                    </select>
                  )}
                  {item.type === 'input' && (
                    <input
                      type="text"
                      value={inputValues[item.label] || (item.value as string)}
                      onChange={(e) => handleInputChange(item.label, e.target.value)}
                      onBlur={() => toast.success(`${item.label} updated`)}
                      className="mt-2 w-full px-3 py-2 text-sm bg-secondary/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card-base p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Reset All Settings</h3>
            <p className="text-xs text-muted-foreground">Restore all settings to default values</p>
          </div>
          <button onClick={handleReset} className="btn-danger text-xs">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
