import React from 'react';
import {
  IncidentsPerManpowerCard,
  TimeLostToInjuryCard,
  DailyHazardAssessmentsCard,
  MT,
} from '../components/domain/SafetyMetricsCards';

export default function SafetyMetricsScreen() {
  return (
    <div style={{
      minHeight: '100vh', background: '#F4F5F6', padding: 24,
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: MT.gray45, marginBottom: 4, fontWeight: 500 }}>SAFETY HUB</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: MT.dark, margin: 0 }}>Safety Metrics</h1>
        <p style={{ fontSize: 12, color: MT.gray45, marginTop: 4 }}>Year-to-date performance across all sites</p>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <IncidentsPerManpowerCard />
        <TimeLostToInjuryCard />
        <DailyHazardAssessmentsCard />
      </div>
    </div>
  );
}
