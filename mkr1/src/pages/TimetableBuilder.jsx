import React, { useEffect, useState } from 'react';
import TimetableTable from '../components/TimetableTable';
import SessionList from '../components/SessionList';
import SessionForm from '../components/SessionForm';
import { useTimetable } from '../context/TimetableContext';
import { API_ENDPOINTS } from '../config/api';

const TimetableBuilder = () => {
  const {
    config,
    department,
    sessions,
    setSessions,
    timetables,
    setTimetables,
    selectedClass,
    setSelectedClass,
    showSessionForm,
    setShowSessionForm,
    sessionForm,
    setSessionForm,
    draggedSession,
    setDraggedSession,
    setGeneratedTimetable,
    goToNextPage
  } = useTimetable();

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Initialize timetables when department classes change
    setTimetables(prev => {
      const updated = { ...prev };
      department.classes.forEach(cls => {
        if (!updated[cls]) {
          updated[cls] = Array(config.days * 2).fill(null).map(() =>
            Array(config.sessionsPerDay).fill(null)
          );
        }
      });
      return updated;
    });
  }, [department.classes, config.days, config.sessionsPerDay, setTimetables]);

  useEffect(() => {
    // Set first class as selected if none selected
    if (department.classes.length > 0 && !selectedClass) {
      setSelectedClass(department.classes[0]);
    }
  }, [department.classes, selectedClass, setSelectedClass]);

  const normalizeSession = (s) => {
    if (!s) return s;
    return {
      ...s,
      location: (s.location == null ? '' : s.location),
      notPlaceable: !!s.notPlaceable
    };
  };

  const addSession = () => {
    if (!sessionForm.subject || sessionForm.faculty.length === 0 || !sessionForm.batch) {
      alert('Please fill all required fields (subject, faculty, batch)');
      return;
    }

    const newSession = {
      id: Date.now(),
      ...sessionForm,
      location: '', // Location will be assigned by backend
      isLabContinuation: false,
      isABMirror: false,
      notPlaceable: false
    };

    const currentSessions = sessions[selectedClass] || [];
    const updatedSessions = {
      ...sessions,
      [selectedClass]: [...currentSessions, newSession]
    };

    setSessions(updatedSessions);
    setSessionForm({
      subject: '',
      type: 'Lecture',
      batch: '',
      faculty: []
    });
    setShowSessionForm(false);
  };

  const removeSession = (classId, sessionId) => {
    const updatedSessions = {
      ...sessions,
      [classId]: (sessions[classId] || []).filter(s => s.id !== sessionId)
    };
    setSessions(updatedSessions);
  };

  const handleDragStart = (e, session) => {
    setDraggedSession(session);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, day, slot) => {
    e.preventDefault();
    if (!draggedSession) return;

    const isA = day % 2 === 0;
    const isB = !isA;

    if (draggedSession.batch === 'A' && isB) {
      alert('This session is for batch A. Drop it on Day A rows only.');
      setDraggedSession(null);
      return;
    }
    if (draggedSession.batch === 'B' && isA) {
      alert('This session is for batch B. Drop it on Day B rows only.');
      setDraggedSession(null);
      return;
    }

    if (!timetables[selectedClass]) {
      const newTimetable = Array(config.days * 2).fill(null).map(() =>
        Array(config.sessionsPerDay).fill(null)
      );
      setTimetables({ ...timetables, [selectedClass]: newTimetable });
    }

    const grid = timetables[selectedClass] || [];
    const slotTaken = grid?.[day]?.[slot];
    if (slotTaken) {
      alert('This slot is already occupied!');
      setDraggedSession(null);
      return;
    }

    if (draggedSession.type === 'Lab') {
      if (slot >= config.sessionsPerDay - 1) {
        alert('Lab sessions need 2 consecutive slots. Not enough space.');
        setDraggedSession(null);
        return;
      }
      if (grid?.[day]?.[slot + 1]) {
        alert('Lab needs 2 consecutive free slots!');
        setDraggedSession(null);
        return;
      }
    }

    const needsMirrorRow = draggedSession.batch === 'AB' && draggedSession.type !== 'Lab';
    const mirrorDay = isA ? day + 1 : day - 1;

    if (needsMirrorRow) {
      if (mirrorDay < 0 || mirrorDay >= config.days * 2) {
        alert('Cannot place AB session here (no mirror row).');
        setDraggedSession(null);
        return;
      }
      if (grid?.[mirrorDay]?.[slot]) {
        alert('AB session needs same slot free in both A and B.');
        setDraggedSession(null);
        return;
      }
    }

    setTimetables(prev => {
      const newTimetables = { ...prev };
      if (!newTimetables[selectedClass]) {
        newTimetables[selectedClass] = Array(config.days * 2).fill(null).map(() =>
          Array(config.sessionsPerDay).fill(null)
        );
      }
      newTimetables[selectedClass][day][slot] = draggedSession;
      if (draggedSession.type === 'Lab') {
        newTimetables[selectedClass][day][slot + 1] = { ...draggedSession, isLabContinuation: true };
      }
      if (needsMirrorRow) {
        newTimetables[selectedClass][mirrorDay][slot] = { ...draggedSession, isABMirror: true };
      }
      return newTimetables;
    });

    const currentSessions = sessions[selectedClass] || [];
    const updatedSessions = {
      ...sessions,
      [selectedClass]: currentSessions.filter(s => s.id !== draggedSession.id)
    };
    setSessions(updatedSessions);
    setDraggedSession(null);
  };

  const removeFromTimetable = (day, slot) => {
    const session = timetables[selectedClass]?.[day]?.[slot];
    if (!session) return;
    if (session.isLabContinuation) {
      alert('Remove the main lab session (previous slot)');
      return;
    }

    const currentSessions = sessions[selectedClass] || [];
    const sessionToAdd = { ...session, isLabContinuation: false, isABMirror: false, notPlaceable: false };
    if (!sessionToAdd.location) sessionToAdd.location = '';

    const updatedSessions = {
      ...sessions,
      [selectedClass]: [...currentSessions, sessionToAdd]
    };
    setSessions(updatedSessions);

    setTimetables(prev => {
      const newTimetables = { ...prev };
      const grid = newTimetables[selectedClass];
      grid[day][slot] = null;

      if (session.type === 'Lab' && slot < config.sessionsPerDay - 1) {
        grid[day][slot + 1] = null;
      }

      if (session.batch === 'AB' && session.type !== 'Lab') {
        const isA = day % 2 === 0;
        const mirrorDay = isA ? day + 1 : day - 1;
        if (mirrorDay >= 0 && mirrorDay < config.days * 2) {
          if (grid[mirrorDay][slot]?.subject === session.subject &&
            grid[mirrorDay][slot]?.type === session.type &&
            grid[mirrorDay][slot]?.batch === 'AB') {
            grid[mirrorDay][slot] = null;
          }
        }
      }

      return newTimetables;
    });
  };

  const generateTimetable = async () => {
    // Only include classes that still exist in department
    const validClasses = new Set(department.classes);

    const payloadSessions = {};
    Object.keys(sessions).forEach(className => {
      if (validClasses.has(className)) payloadSessions[className] = sessions[className] || [];
    });

    const payloadTimetables = {};
    Object.keys(timetables).forEach(className => {
      if (validClasses.has(className)) payloadTimetables[className] = timetables[className] || [];
    });

    const payload = {
      config,
      department,
      sessions: payloadSessions,
      timetables: payloadTimetables
    };

    console.log('%c🔍 PAYLOAD OBJECT (for inspection):', 'color: #dc2626; font-size: 14px; font-weight: bold');
    console.log(payload);
    setIsGenerating(true);

    try {
      const response = await fetch(API_ENDPOINTS.GENERATE_TIMETABLE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('%c❌ Backend Error Response:', 'color: #dc2626; font-size: 14px; font-weight: bold', errorText);
        throw new Error(errorText || 'Failed to generate timetable');
      }

      const result = await response.json();
      console.log('Result:', result);

      if (result.success === false) {
        setTimetables(result.timetables || {});
        alert('Given timetable has conflicts. Please review the timetable.');
      } else {
        setGeneratedTimetable(result);
        alert('Timetable generated successfully!');
        goToNextPage();
      }
    } catch (error) {
      console.error('%c❌ Error connecting to backend:', 'color: #dc2626; font-size: 14px; font-weight: bold');
      console.error('Error details:', error);
      console.log('%c💡 Note: The data displayed above is still valid and can be verified.', 'color: #f59e0b; font-size: 12px; font-style: italic');
      console.log('%c💡 Make sure the backend server is running at:', 'color: #f59e0b; font-size: 12px; font-style: italic', API_ENDPOINTS.GENERATE_TIMETABLE);
      alert(`Error generating timetable: ${error.message}\n\nNote: Data has been displayed in console for verification.\n\nMake sure the backend server is running at:\n${API_ENDPOINTS.GENERATE_TIMETABLE}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (department.classes.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#eef2ff', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: 16 }}>Please add at least one class in the Department Info page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#eef2ff', padding: 16 }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: 16 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1f2937', marginBottom: 16 }}>Timetable Builder</h1>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr 1fr', gap: 16 }}>
            {/* Classes List */}
            <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 16 }}>
              <h2 style={{ fontWeight: 700, color: '#374151', marginBottom: 12 }}>Classes</h2>
              <div style={{ display: 'grid', gap: 8 }}>
                {department.classes.map(cls => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: selectedClass === cls ? '#4f46e5' : '#f3f4f6',
                      color: selectedClass === cls ? '#fff' : '#374151',
                      fontSize: 14,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
            {/* Timetable Table */}
            <TimetableTable
              config={config}
              timetables={timetables}
              selectedClass={selectedClass}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              removeFromTimetable={removeFromTimetable}
            />
            {/* Session List */}
            <SessionList
              sessions={sessions}
              selectedClass={selectedClass}
              handleDragStart={handleDragStart}
              removeSession={removeSession}
              onAddSession={() => setShowSessionForm(true)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button
              onClick={generateTimetable}
              disabled={isGenerating}
              style={{
                background: isGenerating ? '#9ca3af' : '#16a34a',
                color: '#fff',
                padding: '10px 18px',
                borderRadius: 8,
                fontWeight: 700,
                border: 'none',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              {isGenerating ? (
                <>
                  <span>Generating...</span>
                  <div style={{ width: 16, height: 16, border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                </>
              ) : (
                'Generate Timetable'
              )}
            </button>
          </div>
          {showSessionForm && (
            <SessionForm
              department={department}
              sessionForm={sessionForm}
              setSessionForm={setSessionForm}
              addSession={addSession}
              onClose={() => setShowSessionForm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimetableBuilder;

