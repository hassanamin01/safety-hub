import React, { useState, useMemo } from 'react';
import { SegmentedController, Banner, Input, Checkbox, Button } from '@procore/core-react';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const ff = { fontFamily: 'Inter, system-ui, sans-serif' };
const C = {
  dark:    '#232729', gray45: '#6A767C', gray70:  '#ACB5B9',
  border:  '#D6DADC', white:  '#FFFFFF', lightBg: '#EDF0F1', orange: '#EA5B10',
};
const PALETTE      = ['#1D5CC9', '#7A1F6B', '#24A892', '#8D6E5B', '#E8671A'];
const OTHERS_COLOR = '#C4CBCE';
const TOP_N        = 5;

// ─── Subcontractors ───────────────────────────────────────────────────────────
const ALL_SUBS = [
  { id: 'acme',     label: 'Acme Builders'    },
  { id: 'ridge',    label: 'Ridge Co.'         },
  { id: 'harbor',   label: 'Harbor Electric'   },
  { id: 'summit',   label: 'Summit Steel'      },
  { id: 'apex',     label: 'Apex Concrete'     },
  { id: 'bluerock', label: 'Bluerock Framing'  },
  { id: 'crest',    label: 'Crest Plumbing'    },
  { id: 'delta',    label: 'Delta HVAC'        },
  { id: 'eagle',    label: 'Eagle Roofing'     },
  { id: 'frontier', label: 'Frontier Drywall'  },
  { id: 'granite',  label: 'Granite Masonry'   },
  { id: 'highland', label: 'Highland Tile'     },
];
const SUB_IDS = ALL_SUBS.map(s => s.id);

// ─── March 2026 — 31 days ─────────────────────────────────────────────────────
const ALL_DAYS = [
  { date:'Mar 1',  w:15,  acme:0,ridge:0,harbor:0,summit:0,apex:0,bluerock:0,crest:0,delta:0,eagle:0,frontier:0,granite:0,highland:0 },
  { date:'Mar 2',  w:88,  acme:1,ridge:1,harbor:0,summit:1,apex:0,bluerock:0,crest:1,delta:0,eagle:0,frontier:0,granite:0,highland:0 },
  { date:'Mar 3',  w:92,  acme:2,ridge:1,harbor:1,summit:0,apex:1,bluerock:0,crest:0,delta:1,eagle:0,frontier:0,granite:0,highland:0 },
  { date:'Mar 4',  w:95,  acme:1,ridge:0,harbor:2,summit:1,apex:0,bluerock:1,crest:0,delta:0,eagle:1,frontier:0,granite:0,highland:0 },
  { date:'Mar 5',  w:98,  acme:2,ridge:2,harbor:1,summit:1,apex:0,bluerock:0,crest:1,delta:0,eagle:0,frontier:1,granite:0,highland:0 },
  { date:'Mar 6',  w:102, acme:3,ridge:1,harbor:1,summit:2,apex:1,bluerock:0,crest:0,delta:1,eagle:0,frontier:0,granite:1,highland:0 },
  { date:'Mar 7',  w:28,  acme:0,ridge:1,harbor:0,summit:0,apex:0,bluerock:0,crest:0,delta:0,eagle:0,frontier:0,granite:0,highland:0 },
  { date:'Mar 8',  w:18,  acme:0,ridge:0,harbor:0,summit:0,apex:0,bluerock:0,crest:0,delta:0,eagle:0,frontier:0,granite:0,highland:1 },
  { date:'Mar 9',  w:105, acme:3,ridge:2,harbor:1,summit:2,apex:1,bluerock:1,crest:0,delta:0,eagle:1,frontier:0,granite:0,highland:0 },
  { date:'Mar 10', w:108, acme:2,ridge:2,harbor:2,summit:1,apex:1,bluerock:0,crest:1,delta:1,eagle:0,frontier:0,granite:1,highland:0 },
  { date:'Mar 11', w:112, acme:3,ridge:1,harbor:2,summit:2,apex:0,bluerock:1,crest:0,delta:0,eagle:1,frontier:1,granite:0,highland:0 },
  { date:'Mar 12', w:115, acme:4,ridge:3,harbor:2,summit:2,apex:1,bluerock:0,crest:1,delta:0,eagle:0,frontier:0,granite:1,highland:1 },
  { date:'Mar 13', w:118, acme:3,ridge:2,harbor:3,summit:1,apex:2,bluerock:1,crest:0,delta:1,eagle:1,frontier:0,granite:0,highland:0 },
  { date:'Mar 14', w:32,  acme:1,ridge:0,harbor:0,summit:1,apex:0,bluerock:0,crest:0,delta:0,eagle:0,frontier:0,granite:0,highland:0 },
  { date:'Mar 15', w:22,  acme:0,ridge:0,harbor:1,summit:0,apex:0,bluerock:0,crest:0,delta:0,eagle:0,frontier:0,granite:0,highland:0 },
  { date:'Mar 16', w:122, acme:4,ridge:3,harbor:2,summit:3,apex:2,bluerock:1,crest:1,delta:0,eagle:1,frontier:0,granite:0,highland:1 },
  { date:'Mar 17', w:128, acme:4,ridge:3,harbor:3,summit:2,apex:2,bluerock:1,crest:0,delta:1,eagle:0,frontier:1,granite:1,highland:0 },
  { date:'Mar 18', w:132, acme:5,ridge:4,harbor:3,summit:3,apex:2,bluerock:1,crest:1,delta:1,eagle:1,frontier:0,granite:0,highland:1 },
  { date:'Mar 19', w:145, acme:7,ridge:6,harbor:4,summit:4,apex:3,bluerock:2,crest:2,delta:1,eagle:2,frontier:1,granite:1,highland:1 },
  { date:'Mar 20', w:140, acme:5,ridge:4,harbor:3,summit:3,apex:2,bluerock:2,crest:1,delta:1,eagle:1,frontier:1,granite:1,highland:0 },
  { date:'Mar 21', w:35,  acme:1,ridge:1,harbor:0,summit:0,apex:0,bluerock:0,crest:0,delta:0,eagle:0,frontier:0,granite:0,highland:0 },
  { date:'Mar 22', w:20,  acme:0,ridge:0,harbor:0,summit:1,apex:0,bluerock:0,crest:0,delta:0,eagle:0,frontier:0,granite:0,highland:0 },
  { date:'Mar 23', w:138, acme:4,ridge:3,harbor:4,summit:3,apex:2,bluerock:1,crest:1,delta:1,eagle:1,frontier:0,granite:1,highland:0 },
  { date:'Mar 24', w:135, acme:5,ridge:4,harbor:3,summit:2,apex:2,bluerock:1,crest:0,delta:1,eagle:1,frontier:1,granite:0,highland:1 },
  { date:'Mar 25', w:132, acme:4,ridge:3,harbor:3,summit:3,apex:1,bluerock:2,crest:1,delta:0,eagle:1,frontier:1,granite:1,highland:0 },
  { date:'Mar 26', w:128, acme:3,ridge:3,harbor:4,summit:2,apex:2,bluerock:1,crest:1,delta:1,eagle:0,frontier:1,granite:0,highland:1 },
  { date:'Mar 27', w:125, acme:4,ridge:2,harbor:3,summit:3,apex:1,bluerock:1,crest:1,delta:1,eagle:1,frontier:0,granite:1,highland:0 },
  { date:'Mar 28', w:30,  acme:1,ridge:0,harbor:1,summit:0,apex:0,bluerock:0,crest:0,delta:0,eagle:0,frontier:0,granite:0,highland:0 },
  { date:'Mar 29', w:20,  acme:0,ridge:0,harbor:0,summit:0,apex:1,bluerock:0,crest:0,delta:0,eagle:0,frontier:0,granite:0,highland:0 },
  { date:'Mar 30', w:130, acme:3,ridge:2,harbor:3,summit:2,apex:2,bluerock:1,crest:0,delta:1,eagle:0,frontier:1,granite:1,highland:0 },
  { date:'Mar 31', w:128, acme:3,ridge:3,harbor:2,summit:2,apex:1,bluerock:1,crest:1,delta:0,eagle:1,frontier:0,granite:0,highland:1 },
];

const RANGES = {
  'Last 7d':  { days: ALL_DAYS.slice(-7),  label: 'Mar 25–31, 2026' },
  'Last 14d': { days: ALL_DAYS.slice(-14), label: 'Mar 18–31, 2026' },
  'March':    { days: ALL_DAYS,            label: 'March 2026 · 31 days' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function dayTotal(d)  { return SUB_IDS.reduce((s, id) => s + (d[id] || 0), 0); }
function subTotal(id, days) { return days.reduce((s, d) => s + (d[id] || 0), 0); }

function rankSubs(days) {
  return ALL_SUBS
    .map(s => ({ ...s, total: subTotal(s.id, days) }))
    .sort((a, b) => b.total - a.total);
}

function trendFor(id, days) {
  if (days.length < 2) return { arrow: '—', color: C.gray45 };
  const half  = Math.floor(days.length / 2);
  const early = days.slice(0, half).reduce((s, d) => s + (d[id] || 0), 0) / Math.max(half, 1);
  const late  = days.slice(half).reduce((s, d) => s + (d[id] || 0), 0) / Math.max(days.length - half, 1);
  if (late > early * 1.15) return { arrow: '↑', color: '#DC2626' };
  if (late < early * 0.85) return { arrow: '↓', color: '#059669' };
  return { arrow: '→', color: C.gray45 };
}

function SectionLabel({ children, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ fontSize: 9, fontWeight: 600, color: C.gray45, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {children}
      </span>
      {right}
    </div>
  );
}

// ─── Drill-in view for one subcontractor ──────────────────────────────────────
function DrillView({ sub, color, rank, days, grandSum, onBack }) {
  const counts   = days.map(d => d[sub.id] || 0);
  const total    = counts.reduce((s, v) => s + v, 0);
  const maxCount = Math.max(...counts, 1);
  const avgPerDay = total / days.length;
  const peakIdx  = counts.indexOf(Math.max(...counts));
  const pct      = grandSum > 0 ? Math.round(total / grandSum * 100) : 0;
  const BAR_MAX  = 160;

  const stats = [
    { label: 'Total',    value: total,              unit: 'incidents' },
    { label: 'Daily avg', value: avgPerDay.toFixed(1), unit: 'per day' },
    { label: 'Peak',     value: days[peakIdx]?.date, unit: `(${counts[peakIdx]} inc)` },
    { label: '% of total', value: `${pct}%`,         unit: 'this period' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Back breadcrumb */}
      <div style={{ padding: '10px 16px 8px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <Button
          variant="tertiary"
          size="sm"
          onClick={onBack}
          icon={
            <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        >
          All companies
        </Button>
      </div>

      {/* Company header */}
      <div style={{ padding: '14px 16px 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}18`, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: color }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.dark }}>{sub.label}</div>
            <div style={{ fontSize: 10, color: C.gray45, marginTop: 1 }}>Rank #{rank} · {total} incidents · {days.length}-day period</div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ padding: '9px 14px', borderRight: i % 2 === 0 ? `1px solid ${C.border}` : 'none', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: C.gray45, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>
              {s.value} <span style={{ fontSize: 9, fontWeight: 400, color: C.gray45 }}>{s.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Day-by-day chart */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 16px' }}>
        <SectionLabel right={<span style={{ fontSize: 9, color: C.gray45 }}>{days.length} days</span>}>
          Incidents by day
        </SectionLabel>

        {days.map((d, i) => {
          const count   = counts[i];
          const isPeak  = i === peakIdx;
          const rate    = d.w > 0 ? (count / d.w * 100).toFixed(1) : null;
          const barW    = (count / maxCount) * BAR_MAX;
          const isEmpty = count === 0;

          return (
            <div key={d.date} style={{ display: 'flex', alignItems: 'center', height: 22, marginBottom: 2, borderRadius: 4, padding: '0 4px', background: isPeak ? '#FFF7ED' : 'transparent' }}>
              <span style={{ width: 44, fontSize: 9.5, color: isPeak ? '#92400E' : isEmpty ? C.gray70 : C.gray45, fontWeight: isPeak ? 600 : 400, flexShrink: 0 }}>
                {d.date}
              </span>
              <div style={{ width: BAR_MAX, height: 10, borderRadius: 3, background: C.lightBg, flexShrink: 0, overflow: 'hidden' }}>
                {barW > 0.3 && (
                  <div style={{ width: barW, height: '100%', background: isEmpty ? C.gray70 : color, borderRadius: 3 }} />
                )}
              </div>
              <span style={{ width: 18, fontSize: 10, fontWeight: isPeak ? 700 : count > 0 ? 500 : 400, color: isPeak ? '#92400E' : isEmpty ? C.gray70 : C.dark, textAlign: 'right', marginLeft: 6, flexShrink: 0 }}>
                {count}
              </span>
              {rate && (
                <span style={{ fontSize: 8.5, color: C.gray70, marginLeft: 4, flexShrink: 0 }}>{rate}/100w</span>
              )}
              {isPeak && (
                <span style={{ marginLeft: 'auto', fontSize: 9, color: '#B45309', fontWeight: 600, flexShrink: 0 }}>peak</span>
              )}
            </div>
          );
        })}

        {/* Summary note */}
        <div style={{ marginTop: 14, padding: '8px 10px', background: `${color}0E`, borderRadius: 6, borderLeft: `3px solid ${color}` }}>
          <div style={{ fontSize: 10, color: C.dark, lineHeight: 1.5 }}>
            <strong>{sub.label}</strong> reported incidents on{' '}
            <strong>{counts.filter(v => v > 0).length}</strong> of {days.length} days ({Math.round(counts.filter(v => v > 0).length / days.length * 100)}% of the period).
            Peak day was <strong>{days[peakIdx]?.date}</strong> with <strong>{counts[peakIdx]} incidents</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Company list view ────────────────────────────────────────────────────────
function CompanyListView({ ranked, days, grandSum, onSelectSub }) {
  const [search, setSearch] = useState('');

  const filtered = search
    ? ranked.filter(s => s.label.toLowerCase().includes(search.toLowerCase()))
    : ranked;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px 16px' }}>
      <SectionLabel right={<span style={{ fontSize: 9, color: C.gray45 }}>{ranked.length} companies</span>}>
        All companies — ranked
      </SectionLabel>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: C.lightBg, borderRadius: 5, padding: '4px 10px', border: `1px solid ${C.border}`, marginBottom: 10 }}>
        <svg width={11} height={11} viewBox="0 0 16 16" fill="none">
          <circle cx={6.5} cy={6.5} r={5} stroke={C.gray45} strokeWidth={1.8}/>
          <line x1={10.5} y1={10.5} x2={14} y2={14} stroke={C.gray45} strokeWidth={1.8} strokeLinecap="round"/>
        </svg>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search companies…"
          style={{ border: 'none', background: 'transparent', flex: 1, fontSize: 11 }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ ...ff, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: C.gray45, padding: 0, lineHeight: 1 }}>×</button>
        )}
      </div>

      {filtered.length === 0 && (
        <div style={{ fontSize: 11, color: C.gray45, padding: '16px 0', textAlign: 'center' }}>No matches for "{search}"</div>
      )}

      {filtered.map(s => {
        const originalRank = ranked.findIndex(r => r.id === s.id);
        const color        = originalRank < TOP_N ? PALETTE[originalRank] : OTHERS_COLOR;
        const barW         = ranked[0].total > 0 ? (s.total / ranked[0].total) * 140 : 0;
        const { arrow, color: tc } = trendFor(s.id, days);
        const pct = grandSum > 0 ? Math.round(s.total / grandSum * 100) : 0;

        return (
          <div
            key={s.id}
            onClick={() => onSelectSub(s, color, originalRank + 1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px',
              borderRadius: 6, border: `1px solid ${C.border}`,
              background: C.white, cursor: 'pointer', marginBottom: 6,
              transition: 'box-shadow 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(35,39,41,0.10)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            {/* Rank */}
            <span style={{ width: 16, fontSize: 9, color: C.gray70, textAlign: 'right', flexShrink: 0 }}>
              {originalRank + 1}
            </span>

            {/* Color swatch */}
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />

            {/* Name */}
            <span style={{ fontSize: 11, fontWeight: 600, color: C.dark, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {s.label}
            </span>

            {/* Mini bar */}
            <div style={{ width: 140, height: 6, borderRadius: 3, background: C.lightBg, flexShrink: 0, overflow: 'hidden' }}>
              <div style={{ width: barW, height: '100%', background: color, borderRadius: 3 }} />
            </div>

            {/* Count */}
            <span style={{ width: 22, fontSize: 11, fontWeight: 700, color: C.dark, textAlign: 'right', flexShrink: 0 }}>{s.total}</span>

            {/* Pct */}
            <span style={{ width: 26, fontSize: 9, color: C.gray45, flexShrink: 0, textAlign: 'right' }}>{pct}%</span>

            {/* Trend */}
            <span style={{ width: 12, fontSize: 11, color: tc, fontWeight: 700, flexShrink: 0 }}>{arrow}</span>

            {/* Drill arrow */}
            <svg width={12} height={12} viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, opacity: 0.3 }}>
              <path d="M4 2l4 4-4 4" stroke={C.dark} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      })}

      {search && filtered.length > 0 && (
        <div style={{ fontSize: 9, color: C.gray45, marginTop: 4 }}>
          {filtered.length} of {ranked.length} companies
        </div>
      )}
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────
export default function IncidentsPanelDetail({ onClose }) {
  const [activeRange,      setActiveRange]      = useState('Last 14d');
  const [hoveredRow,       setHoveredRow]        = useState(null);
  const [hoveredSub,       setHoveredSub]        = useState(null);
  const [focusedSub,       setFocusedSub]        = useState(null);
  const [showCompanyList,  setShowCompanyList]   = useState(false);
  const [drilledSub,       setDrilledSub]        = useState(null); // { sub, color, rank }
  const [customStart,      setCustomStart]        = useState(0);
  const [customEnd,        setCustomEnd]          = useState(ALL_DAYS.length - 1);

  const idxToDate = idx => `2026-03-${String(idx + 1).padStart(2, '0')}`;
  const dateToIdx = str => Math.max(0, Math.min(30, parseInt(str.split('-')[2], 10) - 1));
  const rangeKeys = useMemo(() => [...Object.keys(RANGES), 'Custom'], []);

  const days = useMemo(() => {
    if (activeRange === 'Custom') return ALL_DAYS.slice(customStart, customEnd + 1);
    return RANGES[activeRange].days;
  }, [activeRange, customStart, customEnd]);

  const rangeLabel = useMemo(() => {
    if (activeRange === 'Custom') return `${ALL_DAYS[customStart].date}–${ALL_DAYS[customEnd].date}, 2026`;
    return RANGES[activeRange].label;
  }, [activeRange, customStart, customEnd]);

  const ranked    = useMemo(() => rankSubs(days), [days]);
  const topSubs   = ranked.slice(0, TOP_N).map((s, i) => ({ ...s, color: PALETTE[i] }));
  const restSubs  = ranked.slice(TOP_N);
  const topIds    = useMemo(() => new Set(topSubs.map(s => s.id)), [days]);

  const totals    = days.map(dayTotal);
  const grandSum  = totals.reduce((s, v) => s + v, 0);
  const periodAvg = grandSum / Math.max(days.length, 1);
  const maxCount  = Math.max(...totals, 1);
  const spikeIdx  = totals.indexOf(Math.max(...totals));

  const BAR_MAX = 176;
  const toW = v => (v / maxCount) * BAR_MAX;
  const highlightId = focusedSub || hoveredSub;

  function handleRangeChange(r) { setActiveRange(r); setFocusedSub(null); setHoveredRow(null); }
  function handleSubToggle(id)  { setFocusedSub(prev => prev === id ? null : id); }
  function handleDrillIn(sub, color, rank) { setDrilledSub({ sub, color, rank }); }
  function handleDrillBack()    { setDrilledSub(null); }

  // ── Persistent header ─────────────────────────────────────────────────────
  const header = (
    <div style={{ position: 'sticky', top: 0, zIndex: 10, background: C.white, borderBottom: `1px solid ${C.border}`, padding: '13px 16px 11px', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>Incidents per Manpower Log</div>
          <div style={{ fontSize: 11, color: C.gray45, marginTop: 2 }}>{rangeLabel} · {ALL_SUBS.length} subcontractors</div>
        </div>
        <Button variant="tertiary" size="sm" onClick={onClose} style={{ padding: '2px 6px', lineHeight: 1 }}>×</Button>
      </div>
    </div>
  );

  // ── Shared: anomaly banner + summary strip + checkbox ─────────────────────
  const sharedTop = (
    <>
      {/* Anomaly banner */}
      <Banner variant="attention" style={{ margin: '10px 12px 0', flexShrink: 0 }}>
        <Banner.Icon icon={
          <svg width={15} height={15} viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
            <path d="M8 2L1.5 14h13L8 2z" fill="#FCD34D" stroke="#F59E0B" strokeWidth={1.2} strokeLinejoin="round"/>
            <text x={8} y={13} textAnchor="middle" fontSize={8} fontWeight={700} fill="#92400E" fontFamily="Inter,sans-serif">!</text>
          </svg>
        } />
        <Banner.Body>
          <Banner.Content>
            <span style={{ fontSize: 12, fontWeight: 700 }}>
              {days[spikeIdx]?.date} — {totals[spikeIdx]} incidents
            </span>
            <span style={{ fontSize: 11, marginLeft: 4 }}>
              ({(totals[spikeIdx] / periodAvg).toFixed(1)}× avg)
            </span>
            <div style={{ fontSize: 10, marginTop: 1 }}>Highest single-day count in this period</div>
          </Banner.Content>
        </Banner.Body>
      </Banner>

      {/* Summary strip — top 4 cards */}
      <div style={{ padding: '10px 12px 0', flexShrink: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: C.gray45, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
          Top subcontractors — {activeRange}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {topSubs.slice(0, 4).map(s => {
            const { arrow, color: tc } = trendFor(s.id, days);
            const isActive = focusedSub === s.id && !showCompanyList;
            return (
              <div
                key={s.id}
                onClick={() => !showCompanyList && handleSubToggle(s.id)}
                onMouseEnter={() => !showCompanyList && setHoveredSub(s.id)}
                onMouseLeave={() => setHoveredSub(null)}
                style={{
                  padding: '7px 10px', borderRadius: 6,
                  cursor: showCompanyList ? 'default' : 'pointer',
                  border: `1.5px solid ${isActive ? s.color : C.border}`,
                  background: isActive ? `${s.color}12` : C.lightBg,
                  transition: 'all 0.15s',
                  opacity: showCompanyList ? 0.6 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, fontWeight: 600, color: C.dark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: C.dark, lineHeight: 1 }}>{s.total}</span>
                  <span style={{ fontSize: 9, color: C.gray45 }}>inc.</span>
                  <span style={{ fontSize: 13, marginLeft: 'auto', color: tc, fontWeight: 600 }}>{arrow}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show all companies checkbox */}
        <div style={{ marginTop: 10, padding: '4px 10px' }}>
          <Checkbox
            checked={showCompanyList}
            onChange={() => { setShowCompanyList(v => !v); setDrilledSub(null); setFocusedSub(null); }}
          >
            Show all {ALL_SUBS.length} companies
            {!showCompanyList && restSubs.length > 0 && (
              <span style={{ fontSize: 10, color: C.gray45, marginLeft: 6 }}>+{restSubs.length} more</span>
            )}
          </Checkbox>
        </div>
      </div>
    </>
  );

  // ── Chart view ─────────────────────────────────────────────────────────────
  const chartView = (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Date range toggle — Procore Segmented Controller */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px 0', flexShrink: 0 }}>
        <SegmentedController onChange={(idx) => handleRangeChange(rangeKeys[idx])}>
          {rangeKeys.map(r => (
            <SegmentedController.Segment key={r} selected={r === activeRange}>
              {r}
            </SegmentedController.Segment>
          ))}
        </SegmentedController>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 18, height: 0, borderTop: '2px dashed #EA5B10' }} />
          <span style={{ fontSize: 9, color: C.gray45 }}>avg</span>
        </div>
      </div>

      {/* Custom date range picker */}
      {activeRange === 'Custom' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px 0', flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: C.gray45, flexShrink: 0 }}>From</span>
          <input
            type="date" min="2026-03-01" max="2026-03-31"
            value={idxToDate(customStart)}
            onChange={e => { const i = dateToIdx(e.target.value); setCustomStart(Math.min(i, customEnd)); }}
            style={{ ...ff, fontSize: 11, padding: '3px 8px', borderRadius: 4, border: `1px solid ${C.border}`, color: C.dark, background: C.white, cursor: 'pointer', flex: 1 }}
          />
          <span style={{ fontSize: 10, color: C.gray45, flexShrink: 0 }}>to</span>
          <input
            type="date" min="2026-03-01" max="2026-03-31"
            value={idxToDate(customEnd)}
            onChange={e => { const i = dateToIdx(e.target.value); setCustomEnd(Math.max(i, customStart)); }}
            style={{ ...ff, fontSize: 11, padding: '3px 8px', borderRadius: 4, border: `1px solid ${C.border}`, color: C.dark, background: C.white, cursor: 'pointer', flex: 1 }}
          />
          <span style={{ fontSize: 10, color: C.gray45, flexShrink: 0 }}>{customEnd - customStart + 1}d</span>
        </div>
      )}

      {/* Chart rows */}
      <div style={{ padding: '10px 12px 0', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 600, color: C.gray45, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Incidents by date &amp; subcontractor</span>
          <span style={{ fontSize: 9, color: C.gray45 }}>{days.length} days · {grandSum} total</span>
        </div>

        {days.map((d, i) => {
          const total       = totals[i];
          const isSpike     = i === spikeIdx;
          const isHov       = hoveredRow === i;
          const rate        = d.w > 0 ? (total / d.w * 100).toFixed(1) : '—';
          const othersCount = SUB_IDS.filter(id => !topIds.has(id)).reduce((s, id) => s + (d[id] || 0), 0);

          return (
            <div key={d.date} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}
              style={{ display: 'flex', alignItems: 'center', height: 20, marginBottom: 2, background: isSpike ? '#FFF7ED' : isHov ? C.lightBg : 'transparent', borderRadius: 4, padding: '0 4px', transition: 'background 0.1s' }}>
              <span style={{ width: 44, fontSize: 9.5, flexShrink: 0, color: isSpike ? '#92400E' : C.gray45, fontWeight: isSpike ? 600 : 400 }}>{d.date}</span>
              <div style={{ position: 'relative', width: BAR_MAX, height: 12, flexShrink: 0 }}>
                <div style={{ position: 'absolute', left: toW(periodAvg), top: -2, bottom: -2, width: 1.5, background: C.orange, opacity: 0.5, zIndex: 2 }} />
                <div style={{ display: 'flex', height: '100%', borderRadius: 2, overflow: 'hidden' }}>
                  {topSubs.map(s => {
                    const w = toW(d[s.id] || 0);
                    const dim = highlightId && highlightId !== s.id;
                    return w > 0.3 ? <div key={s.id} title={`${s.label}: ${d[s.id]}`} style={{ width: w, height: '100%', background: s.color, flexShrink: 0, opacity: dim ? 0.15 : 1, transition: 'opacity 0.15s' }} /> : null;
                  })}
                  {othersCount > 0 && (() => {
                    const w = toW(othersCount);
                    const dim = !!highlightId;
                    return <div title={`Others: ${othersCount}`} style={{ width: w, height: '100%', background: OTHERS_COLOR, flexShrink: 0, opacity: dim ? 0.15 : 1, transition: 'opacity 0.15s' }} />;
                  })()}
                </div>
              </div>
              <span style={{ width: 22, fontSize: 10, fontWeight: isSpike ? 700 : 500, color: isSpike ? '#92400E' : C.dark, textAlign: 'right', flexShrink: 0, marginLeft: 4 }}>{total}</span>
              <span style={{ fontSize: 8.5, color: C.gray70, marginLeft: 3, width: 42, flexShrink: 0 }}>{rate}/100w</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: isHov ? C.dark : 'transparent', cursor: 'pointer', transition: 'color 0.1s', flexShrink: 0 }}>→</span>
            </div>
          );
        })}

        {/* X-axis */}
        <div style={{ position: 'relative', marginLeft: 48, marginTop: 5, marginBottom: 16 }}>
          <div style={{ height: 1, background: C.border }} />
          {[0, Math.round(maxCount * 0.33), Math.round(maxCount * 0.66), maxCount].map((v, idx) => (
            <span key={idx} style={{ position: 'absolute', top: 3, left: `${(v / maxCount) * 100}%`, transform: 'translateX(-50%)', fontSize: 8.5, color: C.gray70 }}>{v}</span>
          ))}
          <span style={{ position: 'absolute', top: -12, left: `${(periodAvg / maxCount) * 100}%`, transform: 'translateX(-50%)', fontSize: 8, color: C.orange, fontWeight: 600, whiteSpace: 'nowrap' }}>avg {periodAvg.toFixed(1)}</span>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'flex', marginBottom: 12, borderRadius: 6, overflow: 'hidden', border: `1px solid ${C.border}` }}>
          {[
            { label: 'Period avg',  value: periodAvg.toFixed(1), unit: 'inc/day'   },
            { label: 'Total',       value: `${grandSum}`,         unit: 'incidents' },
            { label: 'Spike ratio', value: `${(totals[spikeIdx] / periodAvg).toFixed(1)}×`, unit: 'above avg' },
          ].map((stat, i) => (
            <div key={i} style={{ flex: 1, padding: '7px 10px', background: i % 2 === 1 ? C.lightBg : C.white, borderLeft: i > 0 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ fontSize: 9, color: C.gray45, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{stat.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, lineHeight: 1.4 }}>
                {stat.value} <span style={{ fontSize: 9, fontWeight: 400, color: C.gray45 }}>{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginBottom: 16 }}>
          {topSubs.map(s => (
            <div key={s.id} onClick={() => handleSubToggle(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', opacity: focusedSub && focusedSub !== s.id ? 0.3 : 1, transition: 'opacity 0.15s' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
              <span style={{ fontSize: 10, color: C.gray45 }}>{s.label}</span>
            </div>
          ))}
          {restSubs.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: focusedSub ? 0.3 : 1 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: OTHERS_COLOR }} />
              <span style={{ fontSize: 10, color: C.gray45 }}>Others ({restSubs.length})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ── Full render ────────────────────────────────────────────────────────────
  return (
    <div style={{ width: 400, flexShrink: 0, background: C.white, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', ...ff }}>

      {/* Drill view replaces everything except the sticky header */}
      {drilledSub ? (
        <>
          {header}
          <DrillView
            sub={drilledSub.sub}
            color={drilledSub.color}
            rank={drilledSub.rank}
            days={days}
            grandSum={grandSum}
            onBack={handleDrillBack}
          />
        </>
      ) : (
        <>
          {header}
          {sharedTop}
          {showCompanyList ? (
            <CompanyListView
              ranked={ranked}
              days={days}
              grandSum={grandSum}
              onSelectSub={(sub, color, rank) => handleDrillIn(sub, color, rank)}
            />
          ) : (
            chartView
          )}
        </>
      )}
    </div>
  );
}
