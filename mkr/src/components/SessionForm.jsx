import React, { useState } from 'react';
import { X } from 'lucide-react';

const SessionForm = ({
  department,
  sessionForm,
  setSessionForm,
  addSession,
  onClose
}) => {
  const [selectedFaculty, setSelectedFaculty] = useState('');

  // Add selected faculty to sessionForm.faculty
  const handleAddFaculty = () => {
    if (
      selectedFaculty &&
      !sessionForm.faculty.includes(selectedFaculty)
    ) {
      setSessionForm(prev => ({
        ...prev,
        faculty: [...prev.faculty, selectedFaculty]
      }));
      setSelectedFaculty('');
    }
  };

  // Remove faculty from sessionForm.faculty
  const handleRemoveFaculty = (fac) => {
    setSessionForm(prev => ({
      ...prev,
      faculty: prev.faculty.filter(f => f !== fac)
    }));
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ background: '#fff', borderRadius: 10, padding: 16, width: '100%', maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>Add Session</h3>
          <button onClick={onClose} style={{ color: '#6b7280' }}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Subject *</label>
            <select value={sessionForm.subject} onChange={(e) => setSessionForm(prev => ({ ...prev, subject: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8 }}>
              <option value="">Select Subject</option>
              {department.subjects.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Type</label>
            <select value={sessionForm.type} onChange={(e) => setSessionForm(prev => ({ ...prev, type: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8 }}>
              <option value="Lecture">Lecture</option>
              <option value="Lab">Lab</option>
              <option value="Tutorial">Tutorial</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Batch</label>
            <select value={sessionForm.batch} onChange={(e) => setSessionForm(prev => ({ ...prev, batch: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8 }}>
              <option value="">Select Batch</option>
              <option value="AB">AB (Full Class)</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Faculty *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                value={selectedFaculty}
                onChange={e => setSelectedFaculty(e.target.value)}
                style={{ flex: 1, padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
              >
                <option value="">Select Faculty</option>
                {department.faculty
                  .filter(fac => !sessionForm.faculty.includes(fac))
                  .map(fac => (
                    <option key={fac} value={fac}>{fac}</option>
                  ))}
              </select>
              <button
                onClick={handleAddFaculty}
                style={{ background: '#4f46e5', color: '#fff', padding: '8px 16px', borderRadius: 8, fontWeight: 700 }}
                disabled={!selectedFaculty}
              >
                Add
              </button>
            </div>
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {sessionForm.faculty.map(fac => (
                <span key={fac} style={{ background: '#eef2ff', color: '#3730a3', padding: '4px 8px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {fac}
                  <button
                    onClick={() => handleRemoveFaculty(fac)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', marginLeft: 4, cursor: 'pointer', padding: 0 }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <button onClick={addSession} style={{ width: '100%', background: '#4f46e5', color: '#fff', padding: '12px 16px', borderRadius: 8, fontWeight: 700 }}>Add Session</button>
        </div>
      </div>
    </div>
  );
};

export default SessionForm;