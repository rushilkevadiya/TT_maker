import React from 'react';
import { Calendar } from 'lucide-react';
import { useTimetable } from '../context/TimetableContext';

const TimetableConfig = () => {
  const { config, setConfig } = useTimetable();

  return (
    <div style={{ minHeight: '100vh', background: '#eef2ff', padding: 16 }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Calendar className="w-8 h-8" color="#4f46e5" />
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1f2937' }}>Timetable Configuration</h1>
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Number of Days (per week)
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={config.days}
                onChange={(e) => setConfig(prev => ({ ...prev, days: parseInt(e.target.value) || 1 }))}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Sessions Per Day
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={config.sessionsPerDay}
                onChange={(e) => setConfig(prev => ({ ...prev, sessionsPerDay: parseInt(e.target.value) || 1 }))}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8 }}
              />
            </div>
            <div style={{ background: '#f0f9ff', padding: 12, borderRadius: 8, border: '1px solid #bae6fd' }}>
              <p style={{ fontSize: 12, color: '#0369a1', margin: 0 }}>
                💡 Configure the basic structure of your timetable. You can modify these settings later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableConfig;

