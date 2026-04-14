import React, { useState, useRef, useMemo } from 'react';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const ff = { fontFamily: 'Inter, system-ui, sans-serif' };
const C = {
  dark:    '#232729', gray45: '#6A767C', gray70: '#ACB5B9',
  border:  '#D6DADC', white:  '#FFFFFF', lightBg: '#EDF0F1',
  orange:  '#EA5B10', pageBg: '#F4F5F6', navBg:   '#1A1E1F',
};

const PALETTE      = ['#1D5CC9', '#7A1F6B', '#24A892', '#8D6E5B'];
const OTHERS_COLOR = '#C4CBCE';
const LINE_COLOR   = '#EA5B10';

const TOP_SUBS = [
  { id: 'acme',   label: 'Acme',   color: PALETTE[0] },
  { id: 'ridge',  label: 'Ridge',  color: PALETTE[1] },
  { id: 'harbor', label: 'Harbor', color: PALETTE[2] },
  { id: 'summit', label: 'Summit', color: PALETTE[3] },
];
const OTHER_IDS = ['apex','bluerock','crest','delta','eagle','frontier','granite','highland'];

// ─── 9-day dataset (Mar 23–31, 2026) ─────────────────────────────────────────
const RAW_DAYS = [
  { date:'Mar 23', short:'3/23', acme:4, ridge:3, harbor:4, summit:3, apex:2, bluerock:1, crest:1, delta:1, eagle:1, frontier:0, granite:1, highland:0 },
  { date:'Mar 24', short:'3/24', acme:5, ridge:4, harbor:3, summit:2, apex:2, bluerock:1, crest:0, delta:1, eagle:1, frontier:1, granite:0, highland:1 },
  { date:'Mar 25', short:'3/25', acme:4, ridge:3, harbor:3, summit:3, apex:1, bluerock:2, crest:1, delta:0, eagle:1, frontier:1, granite:1, highland:0 },
  { date:'Mar 26', short:'3/26', acme:3, ridge:3, harbor:4, summit:2, apex:2, bluerock:1, crest:1, delta:1, eagle:0, frontier:1, granite:0, highland:1 },
  { date:'Mar 27', short:'3/27', acme:4, ridge:2, harbor:3, summit:3, apex:1, bluerock:1, crest:1, delta:1, eagle:1, frontier:0, granite:1, highland:0 },
  { date:'Mar 28', short:'3/28', acme:1, ridge:0, harbor:1, summit:0, apex:0, bluerock:0, crest:0, delta:0, eagle:0, frontier:0, granite:0, highland:0 },
  { date:'Mar 29', short:'3/29', acme:0, ridge:0, harbor:0, summit:0, apex:1, bluerock:0, crest:0, delta:0, eagle:0, frontier:0, granite:0, highland:0 },
  { date:'Mar 30', short:'3/30', acme:3, ridge:2, harbor:3, summit:2, apex:2, bluerock:1, crest:0, delta:1, eagle:0, frontier:1, granite:1, highland:0 },
  { date:'Mar 31', short:'3/31', acme:3, ridge:3, harbor:2, summit:2, apex:1, bluerock:1, crest:1, delta:0, eagle:1, frontier:0, granite:0, highland:1 },
];

// ─── Chart constants ──────────────────────────────────────────────────────────
const BAR_COL  = 52;   // px per day column (touch-friendly)
const BAR_W    = 30;   // actual bar width
const CHART_H  = 160;  // plot area height
const pY       = 14;   // top padding inside chart SVG
const YAXIS_W  = 32;   // fixed left y-axis width

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildStacks(days) {
  return days.map(d => {
    const segs = TOP_SUBS.map(sub => ({
      id: sub.id, label: sub.label, color: sub.color, count: d[sub.id] || 0,
    }));
    const othersCount = OTHER_IDS.reduce((s, id) => s + (d[id] || 0), 0);
    segs.push({ id: 'others', label: 'Others', color: OTHERS_COLOR, count: othersCount });

    let cum = 0;
    const segments = segs.map(seg => {
      const y0 = cum;
      cum += seg.count;
      return { ...seg, y0, y1: cum };
    });
    return { ...d, others: othersCount, total: cum, segments };
  });
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function NoDataState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 16px', gap: 10 }}>
      <svg width={48} height={48} viewBox="0 0 48 48" fill="none">
        <circle cx={24} cy={24} r={22} stroke={C.border} strokeWidth={2} fill={C.lightBg} />
        <path d="M16 32V20M24 32V16M32 32V24" stroke={C.gray70} strokeWidth={2.5} strokeLinecap="round"/>
      </svg>
      <div style={{ ...ff, fontSize: 14, fontWeight: 600, color: C.dark }}>No Data Found</div>
      <div style={{ ...ff, fontSize: 12, color: C.gray45, textAlign: 'center', lineHeight: 1.5 }}>
        No contractor incident logs are available for this period.
      </div>
    </div>
  );
}

// ─── Main card ────────────────────────────────────────────────────────────────
function IncidentsMobileCard() {
  const stacks     = useMemo(() => buildStacks(RAW_DAYS), []);
  const isEmpty    = stacks.every(d => d.total === 0);
  const maxTotal   = Math.max(...stacks.map(d => d.total), 1);
  const yMax       = Math.ceil(maxTotal / 5) * 5 || 5;
  const toY        = v => pY + CHART_H - (v / yMax) * CHART_H;
  const svgH       = pY + CHART_H + 22;
  const svgW       = stacks.length * BAR_COL;

  const [focusedId, setFocusedId] = useState(null);
  const [tooltip,   setTooltip]   = useState(null);  // { title, sub }
  const [menuOpen,  setMenuOpen]  = useState(false);

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const step = Math.ceil(yMax / 4);
    const ticks = [];
    for (let v = 0; v <= yMax; v += step) ticks.push(v);
    if (ticks[ticks.length - 1] !== yMax) ticks.push(yMax);
    return ticks;
  }, [yMax]);

  function tapBar(e, d, seg) {
    e.stopPropagation();
    setTooltip({ title: `${seg.count} incidents`, sub: `${seg.label} · ${d.date}` });
  }
  function tapLine(e, d) {
    e.stopPropagation();
    setTooltip({ title: `${d.total} total incidents`, sub: d.date });
  }
  function tapLegend(id) {
    setFocusedId(p => p === id ? null : id);
    setTooltip(null);
  }
  function dismissTooltip() {
    setTooltip(null);
    setMenuOpen(false);
  }

  const legendItems = [
    ...TOP_SUBS.map(s => ({ id: s.id, label: s.label, color: s.color })),
    { id: 'others',  label: 'Others', color: OTHERS_COLOR },
    { id: '__line',  label: 'Total',  color: LINE_COLOR, isLine: true },
  ];

  return (
    <div
      onClick={dismissTooltip}
      style={{ background: C.white, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(35,39,41,0.10)', margin: '0 16px 16px' }}
    >
      {/* ── Header ── */}
      <div style={{ padding: '14px 14px 10px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
          <div style={{ ...ff, fontSize: 14, fontWeight: 700, color: C.dark, lineHeight: 1.3 }}>
            Incidents per Manpower Log
          </div>
          <div style={{ ...ff, fontSize: 11, color: C.gray45, marginTop: 2 }}>
            Mar 23–31, 2026 · 9 days
          </div>
        </div>

        {/* Ellipsis menu — 44×44 touch target */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(p => !p); }}
            style={{ width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, ...ff }}
            aria-label="More options"
          >
            <svg width={18} height={18} viewBox="0 0 18 18" fill={C.gray45}>
              <circle cx={3} cy={9} r={1.8}/><circle cx={9} cy={9} r={1.8}/><circle cx={15} cy={9} r={1.8}/>
            </svg>
          </button>

          {menuOpen && (
            <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 44, right: 0, background: C.white, borderRadius: 8, border: `1px solid ${C.border}`, boxShadow: '0 4px 12px rgba(35,39,41,0.15)', zIndex: 20, minWidth: 140, overflow: 'hidden' }}>
              {['View More', 'Full Screen', 'Export'].map(item => (
                <button key={item} onClick={() => setMenuOpen(false)} style={{ ...ff, display: 'block', width: '100%', textAlign: 'left', padding: '12px 14px', fontSize: 13, color: C.dark, background: 'none', border: 'none', cursor: 'pointer', borderBottom: item !== 'Export' ? `1px solid ${C.border}` : 'none' }}>
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isEmpty ? <NoDataState /> : (
        <>
          {/* ── Tooltip ── */}
          {tooltip && (
            <div onClick={e => e.stopPropagation()} style={{ margin: '0 14px 8px', padding: '8px 12px', background: C.dark, borderRadius: 7, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ ...ff, fontSize: 13, fontWeight: 700, color: C.white }}>{tooltip.title}</div>
                <div style={{ ...ff, fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 1 }}>{tooltip.sub}</div>
              </div>
              <button onClick={() => setTooltip(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'rgba(255,255,255,0.55)', fontSize: 16, lineHeight: 1, ...ff }}>×</button>
            </div>
          )}

          {/* ── Wrapped legend ── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', padding: '0 14px 10px' }}>
            {legendItems.map(item => {
              const active = !focusedId || focusedId === item.id;
              const isLegendTappable = item.id !== '__line';
              return (
                <button
                  key={item.id}
                  onClick={e => { e.stopPropagation(); isLegendTappable && tapLegend(item.id); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: isLegendTappable ? 'pointer' : 'default', padding: '4px 0', minHeight: 32, opacity: active ? 1 : 0.3, transition: 'opacity 0.15s', ...ff }}
                >
                  {item.isLine ? (
                    <svg width={16} height={4} style={{ flexShrink: 0 }}>
                      <line x1={0} y1={2} x2={16} y2={2} stroke={item.color} strokeWidth={2} strokeDasharray="4 2"/>
                    </svg>
                  ) : (
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                  )}
                  <span style={{ fontSize: 11, color: C.gray45 }}>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── Chart ── */}
          <div style={{ display: 'flex', paddingBottom: 14 }}>

            {/* Fixed Y-axis */}
            <div style={{ width: YAXIS_W, flexShrink: 0 }}>
              <svg width={YAXIS_W} height={svgH} style={{ display: 'block', overflow: 'visible' }}>
                {yTicks.map(v => (
                  <text key={v} x={YAXIS_W - 4} y={toY(v) + 3.5} textAnchor="end" fontSize={9} fill={C.gray45} fontFamily="Inter, system-ui, sans-serif">
                    {v}
                  </text>
                ))}
              </svg>
            </div>

            {/* Scrollable chart area */}
            <div style={{ flex: 1, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <svg width={svgW} height={svgH} style={{ display: 'block', overflow: 'visible' }}>

                {/* Grid lines */}
                {yTicks.map(v => (
                  <line key={v} x1={0} y1={toY(v)} x2={svgW} y2={toY(v)} stroke={C.border} strokeWidth={v === 0 ? 1 : 0.5} strokeDasharray={v === 0 ? 'none' : '3 3'}/>
                ))}

                {/* Bars */}
                {stacks.map((d, i) => {
                  const cx = i * BAR_COL + BAR_COL / 2;
                  const bx = cx - BAR_W / 2;
                  return (
                    <g key={d.short}>
                      {d.segments.filter(s => s.count > 0).map(seg => {
                        const barY = toY(seg.y1);
                        const barH = Math.max(toY(seg.y0) - toY(seg.y1), 1);
                        const dim  = focusedId && focusedId !== seg.id;
                        return (
                          <rect
                            key={seg.id}
                            x={bx} y={barY} width={BAR_W} height={barH} rx={2}
                            fill={seg.color} opacity={dim ? 0.12 : 1}
                            style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
                            onClick={e => tapBar(e, d, seg)}
                          />
                        );
                      })}
                      {/* X-label */}
                      <text x={cx} y={pY + CHART_H + 16} textAnchor="middle" fontSize={9} fill={C.gray45} fontFamily="Inter, system-ui, sans-serif">
                        {d.short}
                      </text>
                    </g>
                  );
                })}

                {/* Total line segments */}
                {stacks.map((d, i) => {
                  if (i === stacks.length - 1) return null;
                  const x1 = i * BAR_COL + BAR_COL / 2;
                  const x2 = (i + 1) * BAR_COL + BAR_COL / 2;
                  return (
                    <line key={d.short}
                      x1={x1} y1={toY(d.total)} x2={x2} y2={toY(stacks[i+1].total)}
                      stroke={LINE_COLOR} strokeWidth={2}
                      opacity={focusedId ? 0.25 : 1}
                      strokeDasharray="4 2"
                    />
                  );
                })}

                {/* Line nodes — large invisible tap target + visible dot */}
                {stacks.map((d, i) => {
                  const cx = i * BAR_COL + BAR_COL / 2;
                  const cy = toY(d.total);
                  return (
                    <g key={d.short}>
                      {/* 44×44 invisible tap area (AC1, AC3) */}
                      <rect x={cx - 22} y={cy - 22} width={44} height={44} fill="transparent" style={{ cursor: 'pointer' }} onClick={e => tapLine(e, d)}/>
                      {/* Visible dot */}
                      <circle cx={cx} cy={cy} r={5} fill={LINE_COLOR} stroke={C.white} strokeWidth={2} opacity={focusedId ? 0.25 : 1} pointerEvents="none"/>
                    </g>
                  );
                })}

              </svg>
            </div>
          </div>

          {/* ── Stats strip ── */}
          <div style={{ display: 'flex', borderTop: `1px solid ${C.border}` }}>
            {[
              { label: 'Total', value: stacks.reduce((s, d) => s + d.total, 0), unit: 'incidents' },
              { label: 'Daily avg', value: (stacks.reduce((s, d) => s + d.total, 0) / stacks.length).toFixed(1), unit: 'per day' },
              { label: 'Peak day', value: stacks[stacks.reduce((mi, d, i, a) => d.total > a[mi].total ? i : mi, 0)].short, unit: `(${Math.max(...stacks.map(d => d.total))} inc)` },
            ].map((stat, i) => (
              <div key={i} style={{ flex: 1, padding: '9px 10px', borderLeft: i > 0 ? `1px solid ${C.border}` : 'none', background: i === 1 ? C.lightBg : C.white }}>
                <div style={{ ...ff, fontSize: 9, fontWeight: 600, color: C.gray45, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</div>
                <div style={{ ...ff, fontSize: 14, fontWeight: 700, color: C.dark, marginTop: 2 }}>
                  {stat.value} <span style={{ fontSize: 9, fontWeight: 400, color: C.gray45 }}>{stat.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Screen wrapper (phone viewport simulation) ───────────────────────────────
export default function MobileIncidentsScreen() {
  return (
    <div style={{ minHeight: '100vh', background: '#E5E7E9', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '24px 0 40px' }}>
      <div style={{ width: '100%', maxWidth: 390, background: C.pageBg, minHeight: '100vh', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', ...ff }}>

        {/* Status bar */}
        <div style={{ height: 44, background: C.navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
          <span style={{ ...ff, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>9:41</span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {/* Signal */}
            <svg width={16} height={12} viewBox="0 0 16 12" fill="none">
              {[2,5,8,11].map((x, i) => <rect key={x} x={x} y={12 - (i+1)*3} width={2} height={(i+1)*3} rx={1} fill={i < 3 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)'}/>)}
            </svg>
            {/* Battery */}
            <svg width={22} height={12} viewBox="0 0 22 12" fill="none">
              <rect x={0} y={1} width={18} height={10} rx={2} stroke="rgba(255,255,255,0.7)" strokeWidth={1.2}/>
              <rect x={18.5} y={3.5} width={2} height={5} rx={1} fill="rgba(255,255,255,0.5)"/>
              <rect x={1.5} y={2.5} width={12} height={7} rx={1} fill="rgba(255,255,255,0.9)"/>
            </svg>
          </div>
        </div>

        {/* App nav */}
        <div style={{ background: C.navBg, padding: '10px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width={20} height={20} viewBox="0 0 20 20" fill={C.white} opacity={0.8}>
            <path d="M10 2L2 9v9h5v-5h6v5h5V9L10 2z"/>
          </svg>
          <span style={{ ...ff, fontSize: 15, fontWeight: 700, color: C.white }}>Safety Hub</span>
          <div style={{ flex: 1 }}/>
          <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
            <circle cx={7.5} cy={7.5} r={5.5} stroke="rgba(255,255,255,0.6)" strokeWidth={1.5}/>
            <line x1={11.5} y1={11.5} x2={15} y2={15} stroke="rgba(255,255,255,0.6)" strokeWidth={1.5} strokeLinecap="round"/>
          </svg>
        </div>

        {/* Page title */}
        <div style={{ padding: '16px 16px 12px', background: C.white, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ ...ff, fontSize: 18, fontWeight: 700, color: C.dark }}>Dashboard</div>
          <div style={{ ...ff, fontSize: 12, color: C.gray45, marginTop: 2 }}>001SW – Monarch Apartments</div>
        </div>

        {/* Card */}
        <div style={{ paddingTop: 16 }}>
          <IncidentsMobileCard />
        </div>
      </div>
    </div>
  );
}
