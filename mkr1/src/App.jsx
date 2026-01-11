import './App.css';
import { TimetableProvider, useTimetable } from './context/TimetableContext';
import Navigation from './components/Navigation';
import TimetableConfig from './pages/TimetableConfig';
import DepartmentInfo from './pages/DepartmentInfo';
import TimetableBuilder from './pages/TimetableBuilder';
import GeneratedTimetableView from './pages/GeneratedTimetableView';

const AppContent = () => {
  const { currentPage } = useTimetable();

  const renderPage = () => {
    switch (currentPage) {
      case 'config':
        return <TimetableConfig />;
      case 'department':
        return <DepartmentInfo />;
      case 'timetable':
        return <TimetableBuilder />;
      case 'generated':
        return <GeneratedTimetableView />;
      default:
        return <TimetableConfig />;
    }
  };

  return (
    <div>
      <Navigation />
      {renderPage()}
    </div>
  );
};

function App() {
  return (
    <TimetableProvider>
      <AppContent />
    </TimetableProvider>
  );
}

export default App;
