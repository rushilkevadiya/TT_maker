// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const API_ENDPOINTS = {
  GENERATE_TIMETABLE: `${API_BASE_URL}/api/timetable/generate`
};

