import React from 'react';
import { X } from 'lucide-react';

const TimetableTable = ({
  config,
  timetables,
  selectedClass,
  handleDragOver,
  handleDrop,
  removeFromTimetable
}) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d1d5db' }}>
      <thead>
        <tr style={{ background: '#f3f4f6' }}>
          <th style={{ border: '1px solid #d1d5db', padding: 8, fontSize: 12 }}>Day/Batch</th>
          {Array.from({ length: config.sessionsPerDay }, (_, i) => (
            <th key={i} style={{ border: '1px solid #d1d5db', padding: 8, fontSize: 12 }}>{i + 1}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: config.days * 2 }, (_, dayIdx) => (
          <tr key={dayIdx}>
            <td style={{ border: '1px solid #d1d5db', padding: 8, fontWeight: 700, fontSize: 12, background: '#f9fafb' }}>
              Day {Math.floor(dayIdx / 2) + 1}-{dayIdx % 2 === 0 ? 'A' : 'B'}
            </td>
            {Array.from({ length: config.sessionsPerDay }, (_, slotIdx) => {
              const session = timetables[selectedClass]?.[dayIdx]?.[slotIdx];
              return (
                <td key={slotIdx} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, dayIdx, slotIdx)} style={{ border: '1px solid #d1d5db', padding: 8, fontSize: 12, position: 'relative', minHeight: 60, minWidth: 100, background: !session ? '#f9fafb' : session?.isLabContinuation ? '#e0e7ff' : '#fff' }}>
                  {session && !session.isLabContinuation ? (
                    <div style={{ position: 'relative' }}>
                      <div style={{ fontWeight: 700, color: '#3730a3' }}>{session.subject}</div>
                      <div style={{ color: '#4b5563' }}>{session.type}{session.batch ? ` (${session.batch})` : ''}</div>
                      <div style={{ color: '#6b7280', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.faculty.join(', ')}</div>
                      <button onClick={() => removeFromTimetable(dayIdx, slotIdx)} style={{ position: 'absolute', top: 4, right: 4, color: '#ef4444', background: 'transparent', border: 'none', padding: 0, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : session?.isLabContinuation ? (
                    <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 12 }}>(Lab cont.)</div>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 12 }}>Drop here</div>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TimetableTable;