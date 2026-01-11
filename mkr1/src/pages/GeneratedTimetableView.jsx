import React, { useState } from 'react';
import { CheckCircle, Download, Printer } from 'lucide-react';
import { useTimetable } from '../context/TimetableContext';

const GeneratedTimetableView = () => {
  const { generatedTimetable, config, department } = useTimetable();
  const [selectedClass, setSelectedClass] = useState(
    department.classes.length > 0 ? department.classes[0] : ''
  );

  if (!generatedTimetable || Object.keys(generatedTimetable).length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#eef2ff', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: 16 }}>No generated timetable available. Please generate a timetable first.</p>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(generatedTimetable, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated-timetable.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderTimetable = (className) => {
    const timetable = generatedTimetable[className];
    if (!timetable) return null;

    return (
      <div key={className} style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1f2937', marginBottom: 16 }}>
          {className}
        </h2>
        <div style={{ overflowX: 'auto', border: '1px solid #d1d5db', borderRadius: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ border: '1px solid #d1d5db', padding: 12, fontSize: 13, fontWeight: 600, textAlign: 'left', minWidth: 120 }}>
                  Day/Batch
                </th>
                {Array.from({ length: config.sessionsPerDay }, (_, i) => (
                  <th
                    key={i}
                    style={{
                      border: '1px solid #d1d5db',
                      padding: 12,
                      fontSize: 13,
                      fontWeight: 600,
                      textAlign: 'center',
                      minWidth: 140
                    }}
                  >
                    Slot {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: config.days * 2 }, (_, dayIdx) => {
                const day = Math.floor(dayIdx / 2) + 1;
                const batch = dayIdx % 2 === 0 ? 'A' : 'B';
                return (
                  <tr key={dayIdx}>
                    <td
                      style={{
                        border: '1px solid #d1d5db',
                        padding: 12,
                        fontWeight: 700,
                        fontSize: 13,
                        background: '#f9fafb',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Day {day}-{batch}
                    </td>
                    {Array.from({ length: config.sessionsPerDay }, (_, slotIdx) => {
                      const session = timetable[dayIdx]?.[slotIdx];
                      return (
                        <td
                          key={slotIdx}
                          style={{
                            border: '1px solid #d1d5db',
                            padding: 12,
                            fontSize: 12,
                            verticalAlign: 'top',
                            minHeight: 80,
                            background: session ? (session.isLabContinuation ? '#e0e7ff' : '#fff') : '#f9fafb'
                          }}
                        >
                          {session && !session.isLabContinuation ? (
                            <div>
                              <div style={{ fontWeight: 700, color: '#3730a3', marginBottom: 4 }}>
                                {session.subject}
                              </div>
                              <div style={{ color: '#4b5563', marginBottom: 2 }}>
                                {session.type}
                                {session.batch ? ` (${session.batch})` : ''}
                              </div>
                              {session.faculty && session.faculty.length > 0 && (
                                <div style={{ color: '#6b7280', fontSize: 11, marginBottom: 2 }}>
                                  {Array.isArray(session.faculty) ? session.faculty.join(', ') : session.faculty}
                                </div>
                              )}
                              {session.location && (
                                <div style={{ color: '#9ca3af', fontSize: 11 }}>
                                  📍 {session.location}
                                </div>
                              )}
                            </div>
                          ) : session?.isLabContinuation ? (
                            <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 11 }}>
                              (Lab cont.)
                            </div>
                          ) : (
                            <div style={{ textAlign: 'center', color: '#d1d5db', fontSize: 11 }}>
                              —
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#eef2ff', padding: 16 }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: 24 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <CheckCircle className="w-8 h-8" color="#16a34a" />
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1f2937', margin: 0 }}>
                  Generated Timetable
                </h1>
                <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0 0' }}>
                  Your timetable has been successfully generated
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={handleDownload}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#4f46e5',
                  color: '#fff',
                  padding: '10px 16px',
                  borderRadius: 8,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                <Download className="w-4 h-4" />
                Download JSON
              </button>
              <button
                onClick={handlePrint}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#6b7280',
                  color: '#fff',
                  padding: '10px 16px',
                  borderRadius: 8,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>

          {/* Class Selector */}
          {department.classes.length > 1 && (
            <div style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {department.classes.map(cls => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: selectedClass === cls ? '#4f46e5' : '#f3f4f6',
                    color: selectedClass === cls ? '#fff' : '#374151',
                    fontSize: 14,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {cls}
                </button>
              ))}
            </div>
          )}

          {/* Timetables */}
          <div>
            {selectedClass && generatedTimetable[selectedClass] ? (
              renderTimetable(selectedClass)
            ) : (
              department.classes.map(cls => renderTimetable(cls))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedTimetableView;

