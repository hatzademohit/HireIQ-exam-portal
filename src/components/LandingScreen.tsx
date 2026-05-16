import { Brain, Clock, CheckCircle, ArrowRight, Zap, Shield, BarChart2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const instructions = [
  'Ensure you are in a quiet, well-lit environment before beginning.',
  'Grant camera and microphone permissions when prompted.',
  'Answer each question clearly and concisely within the time limit.',
  'You may type your answer or speak — both are recorded.',
  'Do not close or refresh the browser during the interview.',
];

const features = [
  { icon: Zap, label: 'AI-Powered', desc: 'Real-time adaptive questioning' },
  { icon: Shield, label: 'Secure', desc: 'End-to-end encrypted sessions' },
  { icon: BarChart2, label: 'Analyzed', desc: 'Instant performance insights' },
];

export default function LandingScreen() {
  const { setCurrentScreen } = useApp();

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col animate-fade-in">
      {/* Top nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">HireIQ</span>
        </div>
        <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          Candidate Portal
        </span>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30 mx-auto">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0A0F1E] animate-pulse" />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
          Your AI-Powered
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            Interview Experience
          </span>
        </h1>

        <p className="text-gray-400 max-w-xl mx-auto mb-3 text-lg">
          HireIQ conducts intelligent, adaptive interviews powered by cutting-edge AI — delivering
          fair, consistent, and bias-free candidate evaluations.
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-10">
          <Clock className="w-4 h-4 text-blue-400" />
          <span>Estimated duration: <span className="text-white font-medium">~30 minutes</span></span>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3 bg-white/5 backdrop-blur border border-white/10 rounded-xl px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="w-full max-w-lg bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 mb-10 text-left">
          <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">Before You Begin</h3>
          <ul className="space-y-3">
            {instructions.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <button
          onClick={() => setCurrentScreen(2)}
          className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg shadow-blue-600/40 transition-all duration-300 hover:shadow-blue-500/60 hover:scale-105 active:scale-95"
        >
          Start Interview
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
        </button>

        <p className="text-xs text-gray-600 mt-4">No account required · Free to use · Instant results</p>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-600 border-t border-white/5">
        © 2026 HireIQ · AI Interview Platform · All rights reserved
      </footer>
    </div>
  );
}
