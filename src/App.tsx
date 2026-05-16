import { AppProvider, useApp } from './context/AppContext';
import LandingScreen from './components/LandingScreen';
import CandidateForm from './components/CandidateForm';
import InterviewSetup from './components/InterviewSetup';
import AIInterviewScreen from './components/AIInterviewScreen';
import CodingScreen from './components/CodingScreen';
import SummaryScreen from './components/SummaryScreen';
import CameraMicrophone from './components/CameraMicrophone';

function ScreenRouter() {
  const { currentScreen } = useApp();
  switch (currentScreen) {
    case 1: return <LandingScreen />;
    case 2: return <CandidateForm />;
    case 3: return <InterviewSetup />;
    case 4: return <AIInterviewScreen />;
    case 5: return <CodingScreen />;
    case 6: return <SummaryScreen />;
    default: return <LandingScreen />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <ScreenRouter />
      <CameraMicrophone />
    </AppProvider>
  );
}
