import { createContext, useContext, useState, ReactNode, useRef } from 'react';

export interface CandidateData {
  fullName: string;
  email: string;
  role: string;
  experience: string;
  skills: string[];
  resumeName: string;
}

interface AppContextType {
  currentScreen: number;
  candidateData: CandidateData;
  interviewStartTime: number | null;
  setCurrentScreen: (screen: number) => void;
  setCandidateData: (data: CandidateData) => void;
  setInterviewStartTime: (time: number) => void;
  isCameraOn:  boolean;
  setIsCameraOn: (value: boolean) => void;
  startCamera: () => void;
  stopCamera: () => void;
  videoRef: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [interviewStartTime, setInterviewStartTime] = useState<number | null>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [candidateData, setCandidateData] = useState<CandidateData>({
    fullName: '',
    email: '',
    role: '',
    experience: '',
    skills: [],
    resumeName: '',
  });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Start Camera & Microphone
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setStream(mediaStream);
      setIsCameraOn(true);
    } catch (error) {
      console.error(
        "Error accessing camera and microphone:",
        error
      );
    }
  };

  // Stop Camera & Microphone
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
  }

    setIsCameraOn(false);
  };

  return (
    <AppContext.Provider value={{
      currentScreen,
      candidateData,
      interviewStartTime,
      setCurrentScreen,
      setCandidateData,
      setInterviewStartTime,
      isCameraOn,
      setIsCameraOn,
      startCamera,
      stopCamera,
      videoRef
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
