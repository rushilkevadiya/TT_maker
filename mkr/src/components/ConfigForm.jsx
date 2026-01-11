import React from 'react';
import { Calendar } from 'lucide-react';

const ConfigForm = ({ config, setConfig, onNext }) => (
  <div style={{ minHeight: '100vh', background: '#eef2ff', padding: 16 }}>
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Calendar className="w-8 h-8" color="#4f46e5" />
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1f2937' }}>Timetable Configuration</h1>
        </div>
        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Number of Days (per week)</label>
            <input type="number" min="1" max="7" value={config.days} onChange={(e) => setConfig(prev => ({ ...prev, days: parseInt(e.target.value) }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Sessions Per Day</label>
            <input type="number" min="1" max="12" value={config.sessionsPerDay} onChange={(e) => setConfig(prev => ({ ...prev, sessionsPerDay: parseInt(e.target.value) }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8 }} />
          </div>
          <button onClick={onNext} style={{ width: '100%', background: '#4f46e5', color: '#fff', padding: '12px 16px', borderRadius: 8, fontWeight: 700 }}>Next: Department Info</button>
        </div>
      </div>
    </div>
  </div>
);

export default ConfigForm;