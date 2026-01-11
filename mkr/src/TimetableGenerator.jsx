import React, { useState, useEffect } from 'react';
import ConfigForm from './components/ConfigForm';
import DepartmentForm from './components/DepartmentForm';
import TimetableTable from './components/TimetableTable';
import SessionList from './components/SessionList';
import SessionForm from './components/SessionForm';
// ...existing code...

const TimetableGenerator = () => {
  const [step, setStep] = useState('config');
  const [config, setConfig] = useState({ days: 5, sessionsPerDay: 6 });
  const [department, setDepartment] = useState({
    classes: [],
    labs: [],
    rooms: [],
    subjects: [],
    faculty: []
  });
  const [sessions, setSessions] = useState({});
  const [timetables, setTimetables] = useState({});
  const [selectedClass, setSelectedClass] = useState('');
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [newItem, setNewItem] = useState({
    classes: '',
    labs: '',
    rooms: '',
    subjects: '',
    faculty: ''
  });
  const [draggedSession, setDraggedSession] = useState(null);

  const [sessionForm, setSessionForm] = useState({
    subject: '',
    type: 'Lecture',
    batch: '',
    faculty: []
  });

  useEffect(() => {
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
  }, [department.classes, config.days, config.sessionsPerDay]);

  const addItem = (category) => {
    const value = newItem[category].trim();
    if (
      value &&
      !department[category].some(
        (item) => item.toLowerCase() === value.toLowerCase()
      )
    ) {
      setDepartment((prev) => ({
        ...prev,
        [category]: [...prev[category], value],
      }));
      setNewItem((prev) => ({ ...prev, [category]: '' }));
    } else if (value) {
      alert('Duplicate entry not allowed!');
    }
  };

  const removeItem = (category, index) => {
    setDepartment(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const addSession = () => {
    if (!sessionForm.subject || sessionForm.faculty.length === 0 || !sessionForm.batch) {
      alert('Please fill all required fields (subject, faculty, batch)');
      return;
    }

    const newSession = {
      id: Date.now(),
      ...sessionForm
    };

    setSessions(prev => ({
      ...prev,
      [selectedClass]: [...(prev[selectedClass] || []), newSession]
    }));

    setSessionForm({
      subject: '',
      type: 'Lecture',
      batch: '',
      faculty: []
    });
    setShowSessionForm(false);
  };

  const removeSession = (classId, sessionId) => {
    setSessions(prev => ({
      ...prev,
      [classId]: prev[classId].filter(s => s.id !== sessionId)
    }));
  };

  const toggleFaculty = (facultyName) => {
    setSessionForm(prev => ({
      ...prev,
      faculty: prev.faculty.includes(facultyName)
        ? prev.faculty.filter(f => f !== facultyName)
        : [...prev.faculty, facultyName]
    }));
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
      setTimetables(prev => ({ ...prev, [selectedClass]: newTimetable }));
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

    setSessions(prev => ({
      ...prev,
      [selectedClass]: prev[selectedClass].filter(s => s.id !== draggedSession.id)
    }));

    setDraggedSession(null);
  };

  const removeFromTimetable = (day, slot) => {
    const session = timetables[selectedClass]?.[day]?.[slot];
    if (!session) return;

    if (session.isLabContinuation) {
      alert('Remove the main lab session (previous slot)');
      return;
    }

    setSessions(prev => ({
      ...prev,
      [selectedClass]: [...(prev[selectedClass] || []), { ...session, isLabContinuation: undefined, isABMirror: undefined }]
    }));

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

  const generateTimetable = () => {
    const payload = { config, department, sessions, timetables };
    console.log('Data ready for backend:', JSON.stringify(payload, null, 2));
    alert('Timetable data collected!\n\nCheck browser console (F12) for the complete data structure.');
  };

  if (step === 'config') {
    return (
      <ConfigForm
        config={config}
        setConfig={setConfig}
        onNext={() => setStep('department')}
      />
    );
  }

  if (step === 'department') {
    return (
      <DepartmentForm
        department={department}
        setDepartment={setDepartment}
        newItem={newItem}
        setNewItem={setNewItem}
        addItem={addItem}
        removeItem={removeItem}
        onBack={() => setStep('config')}
        onNext={() => {
          if (department.classes.length === 0) {
            alert('Please add at least one class');
            return;
          }
          setSelectedClass(department.classes[0]);
          setStep('timetable');
        }}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#eef2ff', padding: 16 }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: 16 }}>
          {/* ...existing header... */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr 1fr', gap: 16 }}>
            {/* Classes List */}
            <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: 16 }}>
              <h2 style={{ fontWeight: 700, color: '#374151', marginBottom: 12 }}>Classes</h2>
              <div style={{ display: 'grid', gap: 8 }}>
                {department.classes.map(cls => (
                  <button key={cls} onClick={() => setSelectedClass(cls)} style={{ textAlign: 'left', padding: '8px 12px', borderRadius: 8, background: selectedClass === cls ? '#4f46e5' : '#f3f4f6', color: selectedClass === cls ? '#fff' : '#374151', fontSize: 14 }}>
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
            <button onClick={generateTimetable} style={{ background: '#16a34a', color: '#fff', padding: '10px 18px', borderRadius: 8, fontWeight: 700 }}>Generate Timetable Data</button>
          </div>
          {showSessionForm && (
            <SessionForm
              department={department}
              sessionForm={sessionForm}
              setSessionForm={setSessionForm}
              toggleFaculty={toggleFaculty}
              addSession={addSession}
              onClose={() => setShowSessionForm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimetableGenerator;