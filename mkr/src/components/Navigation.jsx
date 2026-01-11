import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTimetable } from '../context/TimetableContext';

const Navigation = () => {
  const { currentPage, goToNextPage, goToPrevPage, canGoNext, canGoPrev, pages, department } = useTimetable();

  const pageNames = {
    config: 'Timetable Config',
    department: 'Department Info',
    timetable: 'Timetable Builder',
    generated: 'Generated Timetable'
  };

  const validateAndNavigate = (direction) => {
    if (direction === 'next') {
      // Validation before navigating
      if (currentPage === 'config') {
        // Config page - always can go next
        goToNextPage();
      } else if (currentPage === 'department') {
        // Department page - check if at least one class is added
        if (department.classes.length === 0) {
          alert('Please add at least one class before proceeding.');
          return;
        }
        goToNextPage();
      } else if (currentPage === 'timetable') {
        // Timetable page - can go next if generated
        goToNextPage();
      } else {
        goToNextPage();
      }
    } else {
      goToPrevPage();
    }
  };

  const currentIndex = pages.indexOf(currentPage);
  const currentPageName = pageNames[currentPage] || currentPage;

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#fff',
        borderBottom: '2px solid #e5e7eb',
        padding: '16px 24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}
    >
      <div style={{ maxWidth: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Page Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
            Step {currentIndex + 1} of {pages.length}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>
            {currentPageName}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => validateAndNavigate('prev')}
            disabled={!canGoPrev()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              background: canGoPrev() ? '#fff' : '#f3f4f6',
              color: canGoPrev() ? '#374151' : '#9ca3af',
              fontWeight: 600,
              cursor: canGoPrev() ? 'pointer' : 'not-allowed',
              fontSize: 14
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={() => validateAndNavigate('next')}
            disabled={!canGoNext()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 8,
              border: 'none',
              background: canGoNext() ? '#4f46e5' : '#d1d5db',
              color: canGoNext() ? '#fff' : '#9ca3af',
              fontWeight: 600,
              cursor: canGoNext() ? 'pointer' : 'not-allowed',
              fontSize: 14
            }}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginTop: 12, height: 4, background: '#e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            background: '#4f46e5',
            width: `${((currentIndex + 1) / pages.length) * 100}%`,
            transition: 'width 0.3s ease'
          }}
        />
      </div>
    </div>
  );
};

export default Navigation;

