import React, { useState } from 'react';
import { Button, Tabs, Avatar } from '@procore/core-react';
import {
  IncidentsPerManpowerCard,
  TimeLostToInjuryCard,
  DailyHazardAssessmentsCard,
} from '../components/domain/SafetyMetricsCards';
import IncidentsPanelDetail from '../components/domain/IncidentsPanelDetail';

const T = {
  navBg:   '#1A1E1F',
  pageBg:  '#F4F5F6',
  white:   '#FFFFFF',
  dark:    '#232729',
  orange:  '#EA5B10',
  border:  '#D6DADC',
  gray45:  '#6A767C',
  lightBg: '#EDF0F1',
  green:   '#11734A',
};
const ff = { fontFamily: 'Inter, system-ui, sans-serif' };

function GlobalNav() {
  return (
    <header style={{ background: T.navBg, height: 56, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, position: 'sticky', top: 0, zIndex: 100, flexShrink: 0 }}>
      {/* Hamburger */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer', padding: 4, flexShrink: 0 }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 18, height: 2, background: 'rgba(255,255,255,0.7)', borderRadius: 1 }} />)}
      </div>

      {/* Real PROCORE logo */}
      <img src="/logo.svg" alt="Procore" style={{ height: 24, flexShrink: 0 }} />

      {/* Project selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>
        <img src="/procore-avatar.png" alt="" style={{ width: 22, height: 22, borderRadius: 3, objectFit: 'cover', flexShrink: 0 }} />
        <div>
          <div style={{ ...ff, fontSize: 9, color: 'rgba(255,255,255,0.55)', lineHeight: 1.2 }}>Miller Holdings</div>
          <div style={{ ...ff, fontSize: 10, fontWeight: 600, color: T.white, lineHeight: 1.3, whiteSpace: 'nowrap' }}>001SW – Monarch Apartments <span style={{ opacity: 0.6 }}>▾</span></div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.10)', borderRadius: 6, padding: '6px 10px', width: 240 }}>
        <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
          <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{ ...ff, fontSize: 12, color: 'rgba(255,255,255,0.45)', flex: 1 }}>Ask anything</span>
        <span style={{ ...ff, fontSize: 9, color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.10)', borderRadius: 3, padding: '2px 5px' }}>Ctrl K</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Help icon */}
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
          <circle cx={7} cy={7} r={6} stroke="rgba(255,255,255,0.5)" strokeWidth={1.2}/>
          <text x={7} y={11} textAnchor="middle" fontSize={9} fontWeight={700} fill="rgba(255,255,255,0.5)" fontFamily="Inter,sans-serif">?</text>
        </svg>
      </div>
      {/* Chat icon */}
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <svg width={14} height={13} viewBox="0 0 14 13" fill="none">
          <path d="M1 1h12v8H8l-3 3V9H1z" stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} strokeLinejoin="round"/>
        </svg>
      </div>
      {/* Bell icon */}
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <svg width={12} height={14} viewBox="0 0 12 14" fill="none">
          <path d="M6 0.5C6 0.5 2 2.5 2 7v3H1v1h10v-1h-1V7c0-4.5-4-6.5-4-6.5z" stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} strokeLinejoin="round"/>
          <path d="M4.5 11.5a1.5 1.5 0 003 0" stroke="rgba(255,255,255,0.5)" strokeWidth={1.2}/>
        </svg>
      </div>
      <Avatar size="sm" aria-hidden={true}><Avatar.Label>JM</Avatar.Label></Avatar>
      <div style={{ background: T.green, borderRadius: 4, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
        <div style={{ width: 14, height: 14, borderRadius: 2, background: 'rgba(255,255,255,0.25)' }} />
        <span style={{ ...ff, fontSize: 10, fontWeight: 700, color: T.white, letterSpacing: 0.3 }}>MILLER DESIGN</span>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9 }}>▾</span>
      </div>
    </header>
  );
}

function PageHeader({ activeTab, onTabChange }) {
  const tabs = ['Portfolio', 'Safety Hub'];
  return (
    <div style={{ background: T.white, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px 6px', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <svg width={16} height={16} viewBox="0 0 16 16" fill={T.dark}>
            <path d="M8 1L1 7v8h5v-5h4v5h5V7L8 1z"/>
          </svg>
          <h1 style={{ ...ff, fontSize: 20, fontWeight: 700, color: T.dark, margin: 0 }}>Home</h1>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button variant="primary" size="sm">+ Create Project</Button>
          <Button variant="secondary" size="sm">Reports ▾</Button>
          <Button variant="secondary" size="sm">Export ▾</Button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: 34 }}>
        <button style={{ ...ff, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: T.gray45, padding: '0 8px', height: 34, display: 'flex', alignItems: 'center', gap: 5 }}>
          {/* Real filter icon */}
          <img src="/filter.svg" alt="" style={{ width: 14, height: 14, opacity: 0.6 }} />
          Filter
        </button>
        <div style={{ width: 1, height: 16, background: T.border, margin: '0 4px' }} />
        <Tabs>
          {tabs.map(tab => (
            <Tabs.Tab key={tab} selected={tab === activeTab} onClick={() => onTabChange(tab)}>
              {tab}
            </Tabs.Tab>
          ))}
        </Tabs>
        <div style={{ width: 1, height: 16, background: T.border, margin: '0 4px' }} />
        <button style={{ ...ff, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: T.gray45, padding: '0 8px', height: 34, display: 'flex', alignItems: 'center', gap: 4 }}>
          <img src="/dropdown.svg" alt="" style={{ width: 12, height: 12, opacity: 0.6 }} />
          Create
        </button>
      </div>
    </div>
  );
}

function DockIcon({ children }) {
  return (
    <div style={{ width: 32, height: 32, borderRadius: 6, background: T.lightBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 3 }}>
      {children}
    </div>
  );
}

function RightDock() {
  const bar = { width: 14, height: 2, background: T.gray45, borderRadius: 1 };
  return (
    <div style={{ width: 52, flexShrink: 0, background: T.white, borderLeft: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: 8 }}>
      {/* List view icon — 3 bars */}
      <DockIcon>{[0,1,2].map(i => <div key={i} style={bar} />)}</DockIcon>
      {/* Grid view icon — 2×2 squares */}
      <DockIcon>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          {[0,1,2,3].map(i => <div key={i} style={{ width: 5, height: 5, background: T.gray45, borderRadius: 1 }} />)}
        </div>
      </DockIcon>
      {/* Chart icon — bars of increasing height */}
      <DockIcon>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
          {[6,10,8].map((h, i) => <div key={i} style={{ width: 4, height: h, background: T.gray45, borderRadius: 1 }} />)}
        </div>
      </DockIcon>
      {/* Filter icon — 3 lines decreasing width */}
      <DockIcon>
        {[14,10,6].map((w, i) => <div key={i} style={{ width: w, height: 2, background: T.gray45, borderRadius: 1 }} />)}
      </DockIcon>
      {/* Map/pin icon — circle + stem */}
      <DockIcon>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', border: `2px solid ${T.gray45}` }} />
          <div style={{ width: 2, height: 4, background: T.gray45, borderRadius: 1 }} />
        </div>
      </DockIcon>
    </div>
  );
}

export default function SafetyHubHomeScreen() {
  const [activeTab,  setActiveTab]  = useState('Safety Hub');
  const [panelOpen,  setPanelOpen]  = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: T.pageBg, ...ff }}>
      <GlobalNav />
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <PageHeader activeTab={activeTab} onTabChange={setActiveTab} />
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>

              {/* Clickable wrapper — opens the detail panel */}
              <div
                onClick={() => setPanelOpen(true)}
                style={{
                  cursor: 'pointer',
                  borderRadius: 10,
                  outline: panelOpen ? `2px solid ${T.orange}` : '2px solid transparent',
                  outlineOffset: 2,
                  transition: 'outline-color 0.15s',
                  flex: '1 1 400px', minWidth: 380,
                  display: 'flex',
                }}
              >
                <IncidentsPerManpowerCard />
              </div>

              <TimeLostToInjuryCard />
              <DailyHazardAssessmentsCard />
            </div>
          </div>
        </div>

        {panelOpen && (
          <IncidentsPanelDetail onClose={() => setPanelOpen(false)} />
        )}
        <RightDock />
      </div>
    </div>
  );
}
