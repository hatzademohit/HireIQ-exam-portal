import { useState } from 'react';
import { Brain, Camera, Mic, Wifi, ChevronDown, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const guidelines = [
  { title: 'Keep your camera on throughout the session', body: 'Ensure your face is clearly visible and well-lit. Covering or disabling the camera may flag the session.' },
  { title: 'Speak clearly and at a measured pace', body: 'The AI evaluates clarity, structure, and content. Rushing or mumbling may affect your score.' },
  { title: 'Answer within the allotted time per question', body: 'Each question has a time budget. You will be prompted to submit before the timer expires.' },
  { title: 'Do not use external resources', body: 'This is a proctored session. Using search engines, notes, or other tools is considered a violation.' },
  { title: 'Stay on this tab for the entire interview', body: 'Tab-switching is monitored. Leaving the interview window will generate a warning.' },
];

function CheckCard({ icon: Icon, label, status, sub }: { icon: React.ElementType; label: string; status: string; sub: string }) {
  return (
    <div className="flex flex-col items-center gap-3 p-5 text-center border bg-white/5 backdrop-blur border-white/10 rounded-2xl">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20">
        <Icon className="w-6 h-6 text-emerald-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-400">{status}</span>
        </div>
        <p className="mt-1 text-xs text-gray-500">{sub}</p>
      </div>
      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    </div>
  );
}

function GuidelineItem({ title, body }: { title: string; body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        className="flex items-center justify-between w-full py-4 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-sm font-medium text-gray-200">{title}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-4 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-gray-400">{body}</p>
      )}
    </div>
  );
}

export default function InterviewSetup() {
  const { setCurrentScreen, isCameraOn, startCamera } = useApp();
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleBegin = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c === null || c <= 1) {
          clearInterval(interval);
          setCurrentScreen(4);
          return null;
        }
        return c - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col animate-fade-in">
      <nav className="flex items-center gap-2 px-6 py-4 border-b border-white/5">
        <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">HireIQ</span>
      </nav>

      <main className="flex items-start justify-center flex-1 px-4 py-10">
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2 text-sm text-blue-400">
              <span className="flex items-center justify-center w-5 h-5 text-xs font-bold border rounded-full bg-blue-500/20 border-blue-500/40">3</span>
              <span>Step 3 of 6</span>
            </div>
            <h1 className="text-3xl font-bold text-white">System Check</h1>
            <p className="mt-1 text-gray-400">Verifying your setup before the interview begins.</p>
          </div>

          <div className="w-full h-1 mb-8 rounded-full bg-white/10">
            <div className="h-1 bg-blue-500 rounded-full" style={{ width: '50%' }} />
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="leading-[14px]">Camera & Microphone Access</h2>
              <span className="text-xs text-gray-400">Please provide camera and microphone access to start your interview</span>
            </div>

            <button onClick={startCamera} disabled={isCameraOn} 
              className="p-3 text-sm font-semibold text-white transition-all duration-300 bg-green-600 rounded-full shadow-lg cursor-pointer hover:bg-green-500 shadow-green-600/30 hover:scale-105 active:scale-95 disabled:bg-white/5 disabled:text-gray-600 disabled:cursor-not-allowed disabled:border disabled:border-white/10 disabled:shadow-none"
            >
              Start Camera & Microphone
            </button>
          </div>
          
          {/* Check Cards */}
          {isCameraOn &&
            <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3">
              <CheckCard icon={Camera} label="Camera" status="Camera Ready" sub="1080p · 30fps" />
              <CheckCard icon={Mic} label="Microphone" status="Mic Active" sub="Clear audio detected" />
              <CheckCard icon={Wifi} label="Internet" status="Strong Connection" sub="48 Mbps · Low latency" />
            </div>
          }

          {/* Guidelines */}
          <div className="p-6 mb-8 border bg-white/5 backdrop-blur border-white/10 rounded-2xl">
            <h3 className="mb-2 text-sm font-semibold tracking-wider text-blue-400 uppercase">Interview Guidelines</h3>
            <div className="divide-y divide-white/10">
              {guidelines.map(g => (
                <GuidelineItem key={g.title} title={g.title} body={g.body} />
              ))}
            </div>
          </div>

          {/* Countdown overlay */}
          {countdown !== null && (
            <div className="fixed inset-0 bg-[#0A0F1E]/90 backdrop-blur flex items-center justify-center z-50">
              <div className="text-center">
                <p className="mb-4 text-lg text-gray-400">Interview starting in</p>
                <div className="flex items-center justify-center w-32 h-32 border-4 border-blue-500 rounded-full shadow-2xl shadow-blue-500/30">
                  <span className="font-bold text-white text-7xl">{countdown}</span>
                </div>
                <p className="mt-4 text-sm text-gray-500">Get ready...</p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentScreen(2)}
              className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-gray-400 transition-all border rounded-full bg-white/5 hover:bg-white/10 border-white/10 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleBegin}
              disabled={!isCameraOn}
              className="flex items-center justify-center flex-1 gap-2 py-3 text-sm font-semibold text-white transition-all duration-300 bg-blue-600 rounded-full shadow-lg hover:bg-blue-500 shadow-blue-600/30 hover:scale-105 active:scale-95 disabled:bg-white/5 disabled:text-gray-600 disabled:cursor-not-allowed disabled:border disabled:border-white/10 disabled:shadow-none"
            >
              Begin Interview <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
