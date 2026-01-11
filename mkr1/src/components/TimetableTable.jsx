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

              // prefer backend notPlaceable flag, but keep legacy clash checks too
              const isNotPlaceable = !!session && session.notPlaceable === true;

              const legacyClash = !!session && (
                session.isClash === true ||
                session.isClashed === true ||
                session.clash === true ||
                session.clashed === true ||
                (session.status && (session.status === 'CLASHED' || session.status === 'Clashed' || session.status === 'CLASH'))
              );

              const isClash = isNotPlaceable || legacyClash;

              const background = !session
                ? '#f9fafb'
                : isClash ? '#fee2e2' // light red for clash / not placeable
                  : session?.isLabContinuation
                    ? '#e0e7ff' // lab continuation blue
                    : '#fff';

              const textColor = isClash ? '#7f1d1d' : '#111827';

              return (
                <td
                  key={slotIdx}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, dayIdx, slotIdx)}
                  style={{
                    border: '1px solid #d1d5db',
                    padding: 8,
                    fontSize: 12,
                    position: 'relative',
                    minHeight: 60,
                    minWidth: 100,
                    background,
                    color: textColor,
                    verticalAlign: 'top'
                  }}
                >
                  {session && !session.isLabContinuation ? (
                    <div style={{ position: 'relative' }}>
                      <div style={{ fontWeight: 700, color: isClash ? '#7f1d1d' : '#3730a3' }}>{session.subject}</div>
                      <div style={{ color: isClash ? '#7f1d1d' : '#4b5563' }}>{session.type}{session.batch ? ` (${session.batch})` : ''}</div>
                      <div style={{ color: isClash ? '#7f1d1d' : '#6b7280', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {(session.faculty || []).join(', ')}
                      </div>

                      {/* Conflict badge when backend sets notPlaceable (or legacy flags) */}
                      {isClash && (
                        <div style={{
                          position: 'absolute',
                          top: 6,
                          right: 36,
                          background: '#dc2626',
                          color: '#fff',
                          padding: '2px 6px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          lineHeight: 1,
                          boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
                        }}>
                          Conflict
                        </div>
                      )}

                      <button
                        onClick={() => removeFromTimetable(dayIdx, slotIdx)}
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          color: '#ef4444',
                          background: 'transparent',
                          border: 'none',
                          padding: 0,
                          lineHeight: 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        aria-label="Remove session"
                      >
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