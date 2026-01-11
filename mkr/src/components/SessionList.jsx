import React from 'react';
import { Plus, Book, GripVertical, Trash2 } from 'lucide-react';

const SessionList = ({
  sessions,
  selectedClass,
  handleDragStart,
  removeSession,
  onAddSession
}) => (
  <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <h2 style={{ fontWeight: 700, color: '#374151' }}>Available Sessions</h2>
      <button onClick={onAddSession} style={{ background: '#4f46e5', color: '#fff', padding: 8, borderRadius: 8 }}>
        <Plus className="w-4 h-4" />
      </button>
    </div>
    <div style={{ display: 'grid', gap: 8, maxHeight: '75vh', overflowY: 'auto' }}>
      {(sessions[selectedClass] || []).length === 0 ? (
        <div style={{ textAlign: 'center', padding: 24, color: '#6b7280', fontSize: 14 }}>
          <Book className="w-12 h-12" style={{ margin: '0 auto 8px', opacity: 0.5 }} />
          <p>No sessions yet</p>
          <p style={{ fontSize: 12 }}>Click + to add</p>
        </div>
      ) : (
        (sessions[selectedClass] || []).map(session => (
          <div key={session.id} draggable onDragStart={(e) => handleDragStart(e, session)} style={{ background: '#eef2ff', padding: 12, borderRadius: 10, cursor: 'move', border: '1px solid #c7d2fe' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <GripVertical className="w-4 h-4" color="#818cf8" style={{ marginTop: 4, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.subject}</div>
                <div style={{ fontSize: 12, color: '#4b5563' }}>{session.type}{session.batch ? ` (${session.batch})` : ''}</div>
                <div style={{ fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.faculty.join(', ')}</div>
              </div>
              <button onClick={() => removeSession(selectedClass, session.id)} style={{ color: '#ef4444', flexShrink: 0, background: 'transparent', border: 'none', padding: 0, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default SessionList;