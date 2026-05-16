import { useState, useEffect } from 'react';
import { Brain, Mic, CheckCircle, SkipForward, Square, Clock, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCountUpTimer, useCountDownTimer } from '../hooks/useTimer';
import { useTypewriter } from '../hooks/useTypewriter';

const QUESTIONS = [
  "Tell me about yourself and your background.",
  "What is the difference between var, let, and const in JavaScript?",
  "Explain how the virtual DOM works in React.",
  "Describe a challenging project you worked on and how you handled it.",
  "What are React hooks? Explain useState and useEffect with examples.",
  "How does CSS specificity work? Give an example.",
  "What is your approach to debugging a production issue?",
  "Explain the concept of closures in JavaScript.",
  "How do you optimize the performance of a React application?",
  "Where do you see yourself in 5 years, and why this role?",
];

function WaveformBars({ active }: { active: boolean }) {
  const classes = [
    'animate-waveform-1', 'animate-waveform-2', 'animate-waveform-3',
    'animate-waveform-4', 'animate-waveform-5', 'animate-waveform-6', 'animate-waveform-7',
  ];
  return (
    <div className="flex items-end h-8 gap-1">
      {classes.map((cls, i) => (
        <div
          key={i}
          className={`w-1.5 bg-blue-500 rounded-full origin-bottom ${active ? cls : ''}`}
          style={{ height: active ? '100%' : '30%', transition: 'height 0.3s' }}
        />
      ))}
    </div>
  );
}

function ConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur">
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/20">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">End Interview?</h3>
            <p className="text-sm text-gray-400">This action cannot be undone.</p>
          </div>
        </div>
        <p className="mb-6 text-sm text-gray-400">
          You have answered {'{answers}'} questions so far. Ending now will submit your current progress for review.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-full text-sm font-medium bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all"
          >
            Keep Going
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-full text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-all"
          >
            End Interview
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AIInterviewScreen() {
  const { setCurrentScreen, candidateData } = useApp();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [showEndModal, setShowEndModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const answerTimer = useCountUpTimer(isRecording);
  const globalTimer = useCountDownTimer(30 * 60, true, () => setCurrentScreen(5));
  const { displayed, done } = useTypewriter(QUESTIONS[questionIndex], 35);
  const initials = candidateData.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'ME';

  useEffect(() => {
    setIsSpeaking(true);
    setIsRecording(false);
    setTypedAnswer('');
    answerTimer.reset();
    const timeout = setTimeout(() => setIsSpeaking(false), QUESTIONS[questionIndex].length * 35 + 500);
    return () => clearTimeout(timeout);
  }, [questionIndex]);

  const handleStartAnswer = () => {
    if (!isRecording) {
      answerTimer.reset();
      setIsRecording(true);
    }
  };

  const advance = () => {
    if (questionIndex >= QUESTIONS.length - 1) {
      setCurrentScreen(5);
    } else {
      setQuestionIndex(i => i + 1);
    }
  };

  const handleSubmit = () => {
    setIsRecording(false);
    advance();
  };

  const handleSkip = () => {
    setIsRecording(false);
    advance();
  };

  const progress = ((questionIndex) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col animate-fade-in">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5 bg-[#0A0F1E]/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center bg-blue-500 rounded-lg w-7 h-7">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="hidden text-base font-bold text-white sm:inline">HireIQ</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {/* Question progress */}
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-gray-400 sm:inline">Question</span>
            <span className="text-sm font-semibold text-white">{questionIndex + 1}</span>
            <span className="text-xs text-gray-500">of {QUESTIONS.length}</span>
          </div>
          {/* Progress bar */}
          <div className="w-20 sm:w-32 bg-white/10 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Global timer */}
          <div className={`flex items-center gap-1.5 text-sm font-mono font-semibold ${globalTimer.seconds < 300 ? 'text-red-400' : 'text-white'}`}>
            <Clock className="w-4 h-4" />
            {globalTimer.formatted}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-col flex-1 gap-4 p-4 overflow-auto lg:flex-row">
        {/* LEFT: AI Interviewer */}
        <div className="flex-1 bg-[#111827] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className={`w-28 h-28 rounded-full overflow-hidden ${isSpeaking ? 'animate-pulse-ring' : ''}`}>
              <div className="flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-blue-900">
                <Brain className="w-14 h-14 text-white/90" />
              </div>
            </div>
            {isSpeaking && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#111827] animate-pulse" />
            )}
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-white">AI Interviewer</p>
            <p className="text-xs text-blue-400">HireIQ Bot · v2.4</p>
          </div>

          {/* Question speech bubble */}
          <div className="relative w-full p-5 border rounded-tl-none bg-white/5 border-white/10 rounded-2xl">
            <div className="absolute w-3 h-3 rotate-45 border-t border-l -top-2 left-4 bg-white/5 border-white/10" />
            <p className="text-gray-100 text-sm leading-relaxed min-h-[60px]">
              {displayed}
              {!done && <span className="font-bold text-blue-400 animate-cursor">|</span>}
            </p>
          </div>

          {/* Waveform */}
          <div className="flex flex-col items-center gap-2">
            <WaveformBars active={isSpeaking} />
            <span className="text-xs text-gray-500">{isSpeaking ? 'AI speaking...' : 'Listening...'}</span>
          </div>

          {/* Question difficulty */}
          <div className="flex items-center justify-between w-full pt-4 text-xs text-gray-500 border-t border-white/5">
            <span>Category: {questionIndex < 3 || questionIndex === 9 ? 'Behavioral' : 'Technical'}</span>
            <span className={`px-2 py-0.5 rounded-full border text-xs ${
              questionIndex < 3 || questionIndex === 9
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
            }`}>
              {questionIndex < 3 || questionIndex === 9 ? 'Behavioral' : 'Technical'}
            </span>
          </div>
        </div>

        {/* RIGHT: Candidate Panel */}
        <div className="flex flex-col w-full gap-4 lg:w-80 xl:w-96">
          {/* Video preview */}
          {/* <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden relative aspect-video">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-[#0d1219]">
              <div className="flex items-center justify-center w-16 h-16 mb-2 text-xl font-bold text-white rounded-full bg-gradient-to-br from-gray-600 to-gray-800">
                {initials}
              </div>
              <p className="text-xs text-gray-500">Camera Feed</p>
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 rounded-full px-2.5 py-1">
              <Video className="w-3 h-3 text-white" />
              <span className="text-xs font-medium text-white">You</span>
            </div>
            {isRecording && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-600/90 rounded-full px-2.5 py-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-xs font-medium text-white">REC</span>
              </div>
            )}
          </div> */}

          {/* Answer timer */}
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Answer Time</p>
              <p className="font-mono text-2xl font-bold text-white">{answerTimer.formatted}</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`} />
          </div>

          {/* Text answer */}
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 flex-1 flex flex-col">
            <p className="mb-2 text-xs text-gray-500">Optional — Type your answer</p>
            <textarea
              value={typedAnswer}
              onChange={e => setTypedAnswer(e.target.value)}
              placeholder="Start typing your answer here..."
              className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none leading-relaxed min-h-[100px] scrollbar-thin"
            />
            {typedAnswer.length > 0 && (
              <p className="mt-1 text-xs text-right text-gray-600">{typedAnswer.length} chars</p>
            )}
          </div>
        </div>
      </main>

      {/* Control bar */}
      <div className="px-4 py-4 border-t border-white/5 bg-[#0A0F1E]/80 backdrop-blur">
        <div className="flex flex-wrap items-center justify-center max-w-2xl gap-3 mx-auto">
          <button
            onClick={handleStartAnswer}
            disabled={isRecording}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              isRecording
                ? 'bg-emerald-700/50 text-emerald-400 cursor-not-allowed border border-emerald-800'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
            }`}
          >
            <Mic className="w-4 h-4" />
            {isRecording ? 'Recording...' : 'Start Answer'}
          </button>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all"
          >
            <CheckCircle className="w-4 h-4" /> Submit Answer
          </button>

          <button
            onClick={handleSkip}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all"
          >
            <SkipForward className="w-4 h-4" /> Skip
          </button>

          <button
            onClick={() => setShowEndModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 border border-red-500/30 transition-all"
          >
            <Square className="w-4 h-4" /> End Interview
          </button>
        </div>
      </div>

      {showEndModal && (
        <ConfirmModal
          onConfirm={() => { setShowEndModal(false); setCurrentScreen(5); }}
          onCancel={() => setShowEndModal(false)}
        />
      )}
    </div>
  );
}
