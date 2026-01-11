import React from 'react';
import { Plus, X, Users, Book, DoorOpen } from 'lucide-react';
import { useTimetable } from '../context/TimetableContext';

const categories = [
  { key: 'classes', label: 'Classes', icon: Users, placeholder: 'e.g., IT-2A' },
  { key: 'labs', label: 'Labs', icon: DoorOpen, placeholder: 'e.g., IT-1' },
  { key: 'rooms', label: 'Classrooms', icon: DoorOpen, placeholder: 'e.g., K-201' },
  { key: 'subjects', label: 'Subjects', icon: Book, placeholder: 'e.g., COA' },
  { key: 'faculty', label: 'Faculty', icon: Users, placeholder: 'e.g., AK' }
];

const DepartmentInfo = () => {
  const {
    department,
    setDepartment,
    newItem,
    setNewItem,
    sessions,
    setSessions,
    timetables,
    setTimetables,
    selectedClass,
    setSelectedClass,
    setGeneratedTimetable
  } = useTimetable();

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
    const itemToRemove = department[category][index];
    
    // If removing a class, clean up all related data
    if (category === 'classes') {
      // Remove sessions for this class
      setSessions(prev => {
        const updated = { ...prev };
        delete updated[itemToRemove];
        return updated;
      });
      
      // Remove timetables for this class
      setTimetables(prev => {
        const updated = { ...prev };
        delete updated[itemToRemove];
        return updated;
      });
      
      // Clear generated timetable since class structure changed
      setGeneratedTimetable(null);
      
      // If this was the selected class, select the first remaining class or clear selection
      if (selectedClass === itemToRemove) {
        const remainingClasses = department.classes.filter((_, i) => i !== index);
        setSelectedClass(remainingClasses.length > 0 ? remainingClasses[0] : '');
      }
    }
    
    // If removing a subject, remove all sessions that use this subject
    if (category === 'subjects') {
      setSessions(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(className => {
          updated[className] = updated[className].filter(
            session => session.subject !== itemToRemove
          );
          // Remove empty class entries
          if (updated[className].length === 0) {
            delete updated[className];
          }
        });
        return updated;
      });
      
      // Also remove from timetables
      setTimetables(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(className => {
          updated[className] = updated[className].map(dayRow =>
            dayRow.map(session => 
              session && session.subject === itemToRemove ? null : session
            )
          );
        });
        return updated;
      });
      
      // Clear generated timetable
      setGeneratedTimetable(null);
    }
    
    // If removing a faculty member, remove them from all sessions
    if (category === 'faculty') {
      setSessions(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(className => {
          updated[className] = updated[className]
            .map(session => ({
              ...session,
              faculty: Array.isArray(session.faculty) 
                ? session.faculty.filter(f => f !== itemToRemove)
                : []
            }))
            .filter(session => {
              // Remove sessions that have no faculty left
              return session.faculty && session.faculty.length > 0;
            });
          // Remove empty class entries
          if (updated[className].length === 0) {
            delete updated[className];
          }
        });
        return updated;
      });
      
      // Also remove from timetables
      setTimetables(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(className => {
          updated[className] = updated[className].map(dayRow =>
            dayRow.map(session => {
              if (!session) return null;
              const updatedFaculty = Array.isArray(session.faculty)
                ? session.faculty.filter(f => f !== itemToRemove)
                : [];
              // If no faculty left, remove the session
              if (updatedFaculty.length === 0) return null;
              return { ...session, faculty: updatedFaculty };
            })
          );
        });
        return updated;
      });
      
      // Clear generated timetable
      setGeneratedTimetable(null);
    }
    
    // Remove the item from department
    setDepartment(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#eef2ff', padding: 16 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1f2937', marginBottom: 24 }}>Department Information</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 16 }}>
            {categories.map(({ key, label, icon: Icon, placeholder }) => (
              <div key={key} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Icon className="w-5 h-5" color="#4f46e5" />
                  <h3 style={{ fontWeight: 700, color: '#374151' }}>{label}</h3>
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input
                    type="text"
                    value={newItem[key]}
                    onChange={(e) => setNewItem(prev => ({ ...prev, [key]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && addItem(key)}
                    placeholder={placeholder}
                    style={{ flex: 1, padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
                  />
                  <button
                    onClick={() => addItem(key)}
                    style={{ background: '#4f46e5', color: '#fff', padding: 8, borderRadius: 8, cursor: 'pointer' }}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div style={{ display: 'grid', gap: 8, maxHeight: 160, overflowY: 'auto' }}>
                  {department[key].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#f9fafb',
                        padding: '8px 10px',
                        borderRadius: 8
                      }}
                    >
                      <span style={{ fontSize: 14, color: '#374151' }}>{item}</span>
                      <button
                        onClick={() => removeItem(key, idx)}
                        style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: '#f0f9ff', padding: 12, borderRadius: 8, border: '1px solid #bae6fd', marginTop: 24 }}>
            <p style={{ fontSize: 12, color: '#0369a1', margin: 0 }}>
              💡 Add all necessary information about your department. Make sure to add at least one class to proceed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentInfo;

