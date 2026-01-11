import React from 'react';
import { Plus, X, Users, Book, DoorOpen } from 'lucide-react';

const categories = [
  { key: 'classes', label: 'Classes', icon: Users, placeholder: 'e.g., IT-2A' },
  { key: 'labs', label: 'Labs', icon: DoorOpen, placeholder: 'e.g., IT-1' },
  { key: 'rooms', label: 'Classrooms', icon: DoorOpen, placeholder: 'e.g., K-201' },
  { key: 'subjects', label: 'Subjects', icon: Book, placeholder: 'e.g., COA' },
  { key: 'faculty', label: 'Faculty', icon: Users, placeholder: 'e.g., AK' }
];

const DepartmentForm = ({ department, setDepartment, newItem, setNewItem, addItem, removeItem, onBack, onNext }) => (
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
                <button onClick={() => addItem(key)} style={{ background: '#4f46e5', color: '#fff', padding: 8, borderRadius: 8 }}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div style={{ display: 'grid', gap: 8, maxHeight: 160, overflowY: 'auto' }}>
                {department[key].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', padding: '8px 10px', borderRadius: 8 }}>
                    <span style={{ fontSize: 14, color: '#374151' }}>{item}</span>
                    <button onClick={() => removeItem(key, idx)} style={{ color: '#ef4444' }}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
          <button onClick={onBack} style={{ padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: 8, fontWeight: 700 }}>Back</button>
          <button onClick={onNext} style={{ flex: 1, background: '#4f46e5', color: '#fff', padding: '12px 16px', borderRadius: 8, fontWeight: 700 }}>Next: Create Timetable</button>
        </div>
      </div>
    </div>
  </div>
);

export default DepartmentForm;