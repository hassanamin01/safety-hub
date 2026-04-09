import React from 'react';
import { Card } from '@procore/core-react';

// ─── Tokens ───────────────────────────────────────────────────────────────────
export const MT = {
  blue:       '#1D5CC9',
  magenta:    '#7A1F6B',
  cyan:       '#24A892',
  red:        '#C93B1D',
  gray45:     '#6A767C',
  gray70:     '#ACB5B9',
  dark:       '#232729',
  lightGray:  '#E8EBEC',
  borderGray: '#D6DADC',
  white:      '#FFFFFF',
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const recordable    = [2,3,1,2,4,3,2,1,2,3,2,1];
const restricted    = [1,2,1,2,2,1,2,1,1,2,1,1];
const nearMiss      = [3,4,2,3,5,4,3,2,3,4,3,2];
const oshaRate      = [0.4,0.6,0.2,0.5,0.8,0.6,0.5,0.3,0.5,0.7,0.5,0.3];
const lostTime      = [3,4,2,3,5,4,3,2,3,4,3,2];
const restrictedDuty= [2,3,1,2,3,2,2,1,2,3,2,1];
const COMPLETED = 127;
const TOTAL     = 170;

// ─── Card shell ───────────────────────────────────────────────────────────────
function CardShell({ title, subtitle, children }) {
  return (
    <Card shadowStrength={1} style={{
      padding: 16, flexShrink: 0,
      fontFamily: 'Inter, system-ui, sans-serif',
      flex: '1 1 400px', minWidth: 380, width: '100%',
    }}>
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: MT.dark }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: MT.gray45, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {children}
    </Card>
  );
}

function LegendItem({ color, label, dashed }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: MT.gray45 }}>
      {dashed ? (
        <svg width={18} height={4} style={{ flexShrink: 0 }}>
          <line x1={0} y1={2} x2={18} y2={2} stroke={color} strokeWidth={2} strokeDasharray="4 2" />
        </svg>
      ) : (
        <div style={{ width: 10, height: 10, background: color, borderRadius: 2, flexShrink: 0 }} />
      )}
      <span>{label}</span>
    </div>
  );
}

// ─── Card 1: Incidents per Manpower Log ───────────────────────────────────────
export function IncidentsPerManpowerCard() {
  const pX = 34, pY = 8, pW = 360, pH = 190;
  const maxV = 12, maxR = 1.0;
  const gW = pW / 12, bW = 17;

  const groups = MONTHS.map((_, i) => {
    const nmH = (nearMiss[i]   / maxV) * pH;
    const rsH = (restricted[i] / maxV) * pH;
    const rcH = (recordable[i] / maxV) * pH;
    const bx  = pX + i * gW + (gW - bW) / 2;
    const bot = pY + pH;
    return {
      bx,
      nm: { y: bot - nmH,               h: nmH },
      rs: { y: bot - nmH - rsH,         h: rsH },
      rc: { y: bot - nmH - rsH - rcH,   h: rcH },
    };
  });

  const ratePts  = oshaRate.map((r, i) => ({ x: pX + (i + 0.5) * gW, y: pY + pH - (r / maxR) * pH }));
  const polyPts  = ratePts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const yTicks   = [0, 3, 6, 9, 12];
  const rTicks   = [0, 0.25, 0.5, 0.75, 1.0];

  return (
    <CardShell title="Incidents per Manpower Log" subtitle="YTD 2024 · All Sites">
      <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
        <LegendItem color={MT.cyan}    label="Near Miss" />
        <LegendItem color={MT.blue}    label="Restricted" />
        <LegendItem color={MT.magenta} label="Recordable" />
        <LegendItem color={MT.red}     label="OSHA Rate" dashed />
      </div>

      <svg width="100%" viewBox={`0 0 413 238`} style={{ overflow: 'visible', display: 'block' }}>
        {yTicks.map(v => {
          const y = pY + pH - (v / maxV) * pH;
          return (
            <g key={v}>
              <line x1={pX} y1={y} x2={pX + pW} y2={y} stroke={MT.borderGray} strokeWidth={v === 0 ? 1 : 0.5} />
              <text x={pX - 4} y={y + 3.5} textAnchor="end" fontSize={9} fill={MT.gray45}>{v}</text>
            </g>
          );
        })}
        {rTicks.map(v => {
          const y = pY + pH - (v / maxR) * pH;
          return <text key={v} x={pX + pW + 4} y={y + 3.5} textAnchor="start" fontSize={9} fill={MT.red}>{v.toFixed(2)}</text>;
        })}
        {groups.map((g, i) => (
          <g key={i}>
            <rect x={g.bx} y={g.nm.y} width={bW} height={g.nm.h} fill={MT.cyan} />
            <rect x={g.bx} y={g.rs.y} width={bW} height={g.rs.h} fill={MT.blue} />
            <rect x={g.bx} y={g.rc.y} width={bW} height={g.rc.h} fill={MT.magenta} />
            <text x={g.bx + bW / 2} y={pY + pH + 13} textAnchor="middle" fontSize={8.5} fill={MT.gray45}>{MONTHS[i]}</text>
          </g>
        ))}
        <polyline points={polyPts} fill="none" stroke={MT.red} strokeWidth={1.5} strokeDasharray="4 2" />
        {ratePts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={MT.red} />)}
      </svg>
    </CardShell>
  );
}

// ─── Card 2: Time Lost to Injury ──────────────────────────────────────────────
export function TimeLostToInjuryCard() {
  const pX = 34, pY = 8, pW = 360, pH = 190;
  const maxV = 10, gW = pW / 12, bW = 20;

  const groups = MONTHS.map((_, i) => {
    const ltH = (lostTime[i]       / maxV) * pH;
    const rdH = (restrictedDuty[i] / maxV) * pH;
    const bx  = pX + i * gW + (gW - bW) / 2;
    const bot = pY + pH;
    return { bx, lt: { y: bot - ltH, h: ltH }, rd: { y: bot - ltH - rdH, h: rdH } };
  });

  return (
    <CardShell title="Time Lost to Injury" subtitle="YTD 2024 · All Sites">
      <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
        <LegendItem color={MT.blue}    label="Lost Time" />
        <LegendItem color={MT.magenta} label="Restricted Duty" />
      </div>
      <svg width="100%" viewBox="0 0 413 238" style={{ overflow: 'visible', display: 'block' }}>
        {[0, 2, 4, 6, 8, 10].map(v => {
          const y = pY + pH - (v / maxV) * pH;
          return (
            <g key={v}>
              <line x1={pX} y1={y} x2={pX + pW} y2={y} stroke={MT.borderGray} strokeWidth={v === 0 ? 1 : 0.5} />
              <text x={pX - 4} y={y + 3.5} textAnchor="end" fontSize={9} fill={MT.gray45}>{v}</text>
            </g>
          );
        })}
        {groups.map((g, i) => (
          <g key={i}>
            <rect x={g.bx} y={g.lt.y} width={bW} height={g.lt.h} fill={MT.blue} />
            <rect x={g.bx} y={g.rd.y} width={bW} height={g.rd.h} fill={MT.magenta} />
            <text x={g.bx + bW / 2} y={pY + pH + 13} textAnchor="middle" fontSize={8.5} fill={MT.gray45}>{MONTHS[i]}</text>
          </g>
        ))}
      </svg>
    </CardShell>
  );
}

// ─── Card 3: Daily Hazard Assessments ─────────────────────────────────────────
export function DailyHazardAssessmentsCard() {
  const pct = COMPLETED / TOTAL;
  const R = 78, SW = 20, cx = 198, cy = 100;
  const halfCircum = Math.PI * R;
  const fullCircum = 2 * Math.PI * R;
  const needleAngle = (1 - pct) * Math.PI;
  const dotX = cx + R * Math.cos(needleAngle);
  const dotY = cy - R * Math.sin(needleAngle);
  const gaugeLabels = [
    { t: 0, label: '0%' }, { t: 0.5, label: '50%' }, { t: 1.0, label: '100%' },
  ].map(({ t, label }) => ({ label, t, lx: cx + (R + SW / 2 + 14) * Math.cos((1 - t) * Math.PI) }));

  return (
    <CardShell title="Daily Hazard Assessments" subtitle="Today · All Sites">
      <svg width="100%" viewBox="0 0 396 220" style={{ overflow: 'visible', display: 'block' }}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={MT.lightGray} strokeWidth={SW}
          strokeDasharray={`${halfCircum} ${fullCircum}`}
          transform={`rotate(180, ${cx}, ${cy})`} strokeLinecap="butt" />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={MT.cyan} strokeWidth={SW}
          strokeDasharray={`${(halfCircum * pct).toFixed(2)} ${fullCircum}`}
          transform={`rotate(180, ${cx}, ${cy})`} strokeLinecap="butt" />
        <circle cx={dotX} cy={dotY} r={6} fill={MT.cyan} />
        <circle cx={dotX} cy={dotY} r={3} fill={MT.white} />
        <circle cx={cx - R} cy={cy} r={4} fill={MT.gray70} />
        <circle cx={cx + R} cy={cy} r={4} fill={MT.gray70} />
        <text x={cx} y={cy - 16} textAnchor="middle" fontSize={32} fontWeight={700} fill={MT.dark}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{COMPLETED}</text>
        <text x={cx} y={cy + 8}  textAnchor="middle" fontSize={12} fill={MT.gray45}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>of {TOTAL} completed</text>
        <text x={cx} y={cy + 24} textAnchor="middle" fontSize={11} fontWeight={600} fill={MT.cyan}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{Math.round(pct * 100)}%</text>
        {gaugeLabels.map(({ lx, label, t }) => (
          <text key={label} x={lx} y={cy + 36}
            textAnchor={t === 0 ? 'start' : t === 1.0 ? 'end' : 'middle'}
            fontSize={9} fill={MT.gray45}
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{label}</text>
        ))}
        <g transform={`translate(${cx - 160}, ${cy + 55})`}>
          <rect x={0}   y={0} width={14} height={14} rx={3} fill={MT.cyan} />
          <text x={18}  y={11} fontSize={11} fill={MT.dark}
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{COMPLETED} Completed</text>
          <rect x={140} y={0} width={14} height={14} rx={3} fill={MT.lightGray} />
          <text x={158} y={11} fontSize={11} fill={MT.dark}
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{TOTAL - COMPLETED} Not Started</text>
        </g>
      </svg>
    </CardShell>
  );
}
