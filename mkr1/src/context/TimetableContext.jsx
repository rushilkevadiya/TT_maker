import React, { createContext, useContext, useState } from 'react';
import { initialDepartment, initialSessions } from '../preloadedData';

// Helper: ensure every session object always has a location property (default '')
const normalizeSession = (s) => {
  if (!s) return s;
  return { ...s, location: (s.location == null ? '' : s.location) };
};

const normalizeSessionsMap = (map) => {
  const out = {};
  (Object.keys(map || {})).forEach(k => {
    out[k] = (map[k] || []).map(normalizeSession);
  });
  return out;
};

const TimetableContext = createContext();

export const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (!context) {
    throw new Error('useTimetable must be used within TimetableProvider');
  }
  return context;
};

export const TimetableProvider = ({ children }) => {
  // Initialize with preloaded data
  const [config, setConfig] = useState({ days: 5, sessionsPerDay: 6 });
  const [department, setDepartment] = useState(initialDepartment);
  const [sessions, setSessions] = useState(() => normalizeSessionsMap(initialSessions));
  const [timetables, setTimetables] = useState({});
  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const [currentPage, setCurrentPage] = useState('config');
  const [selectedClass, setSelectedClass] = useState(initialDepartment.classes[0] || '');
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [newItem, setNewItem] = useState({
    classes: '',
    labs: '',
    rooms: '',
    subjects: '',
    faculty: ''
  });
  const [sessionForm, setSessionForm] = useState({
    subject: '',
    type: 'Lecture',
    batch: '',
    faculty: []
  });
  const [draggedSession, setDraggedSession] = useState(null);

  const pages = ['config', 'department', 'timetable', 'generated'];

  const goToNextPage = () => {
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex < pages.length - 1) {
      setCurrentPage(pages[currentIndex + 1]);
    }
  };

  const goToPrevPage = () => {
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      setCurrentPage(pages[currentIndex - 1]);
    }
  };

  const canGoNext = () => {
    const currentIndex = pages.indexOf(currentPage);
    return currentIndex < pages.length - 1;
  };

  const canGoPrev = () => {
    const currentIndex = pages.indexOf(currentPage);
    return currentIndex > 0;
  };

  const value = {
    // State
    config,
    setConfig,
    department,
    setDepartment,
    sessions,
    setSessions,
    timetables,
    setTimetables,
    generatedTimetable,
    setGeneratedTimetable,
    currentPage,
    setCurrentPage,
    selectedClass,
    setSelectedClass,
    showSessionForm,
    setShowSessionForm,
    newItem,
    setNewItem,
    sessionForm,
    setSessionForm,
    draggedSession,
    setDraggedSession,
    // Navigation
    goToNextPage,
    goToPrevPage,
    canGoNext,
    canGoPrev,
    pages
  };

  return (
    <TimetableContext.Provider value={value}>
      {children}
    </TimetableContext.Provider>
  );
};

