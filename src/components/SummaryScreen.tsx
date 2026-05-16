import { useEffect, useState } from 'react';
import {
  Brain, Download, Home, CheckCircle2,
  TrendingUp, AlertCircle, Star, Loader2,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { useApp } from '../context/AppContext';

// ─── Constants ────────────────────────────────────────────────────────────────

const PDF_FILE_NAME     = 'interview result';
const TOTAL_QUESTIONS   = 11;
const QUESTIONS_ATTEMPTED = 5;
const TIME_TAKEN        = '28:14';
const TIME_LIMIT        = '30:00';
const GRADE             = 'A-';
const CONFIDENCE_SCORE  = 78;

const STRENGTHS = [
  'Clear communication and articulate verbal responses throughout the session.',
  'Strong understanding of JavaScript fundamentals including closures and scope.',
  'Demonstrated practical problem-solving using the optimal O(n) hash map approach.',
];

const IMPROVEMENTS = [
  'Deepen knowledge of React performance patterns such as memoization and code splitting.',
  'Provide more concrete metrics and outcomes when describing past project experiences.',
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface CandidateData {
  fullName?  : string;
  role?      : string;
  experience?: string;
  email?     : string;
}

interface PdfReportData {
  candidate         : CandidateData;
  questionsAttempted: number;
  totalQuestions    : number;
  timeTaken         : string;
  timeLimit         : string;
  grade             : string;
  confidenceScore   : number;
  strengths         : string[];
  improvements      : string[];
  generatedAt       : string;
}

// ─── Colour palette ───────────────────────────────────────────────────────────

type RGB = [number, number, number];

const C: Record<string, RGB> = {
  brand    : [37,  99,  235],   // blue-600
  brandSoft: [219, 234, 254],   // blue-100
  success  : [16,  185, 129],   // emerald-500
  warning  : [202, 138,  4 ],   // yellow-600
  dark     : [17,  24,  39 ],   // gray-900
  mid      : [107, 114, 128],   // gray-500
  light    : [209, 213, 219],   // gray-300
  border   : [229, 231, 235],   // gray-200
  bgGray   : [249, 250, 251],   // gray-50
  bgBlue   : [239, 246, 255],   // blue-50
  bgGreen  : [240, 253, 244],   // green-50
  white    : [255, 255, 255],
  black    : [0,   0,   0  ],
};

// ─── Pure jsPDF PDF builder ───────────────────────────────────────────────────

function generateInterviewPdf(data: PdfReportData): void {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const PAGE_W   = 210;
  const PAGE_H   = 297;
  const ML       = 18;          // margin left
  const MR       = 18;          // margin right
  const CW       = PAGE_W - ML - MR;   // content width = 174

  // ── Low-level helpers ─────────────────────────────────────────────────────

  const setFill   = (c: RGB) => pdf.setFillColor(c[0],   c[1],   c[2]);
  const setStroke = (c: RGB) => pdf.setDrawColor(c[0],   c[1],   c[2]);
  const setTxt    = (c: RGB) => pdf.setTextColor(c[0],   c[1],   c[2]);

  const box = (x: number, y: number, w: number, h: number, fill: RGB, radius = 0) => {
    setFill(fill);
    if (radius > 0) pdf.roundedRect(x, y, w, h, radius, radius, 'F');
    else pdf.rect(x, y, w, h, 'F');
  };

  const outlineBox = (x: number, y: number, w: number, h: number, stroke: RGB, lw = 0.25, radius = 0) => {
    setStroke(stroke);
    pdf.setLineWidth(lw);
    if (radius > 0) pdf.roundedRect(x, y, w, h, radius, radius, 'S');
    else pdf.rect(x, y, w, h, 'S');
  };

  const hLine = (y: number, x1 = ML, x2 = PAGE_W - MR, color = C.border, lw = 0.25) => {
    setStroke(color);
    pdf.setLineWidth(lw);
    pdf.line(x1, y, x2, y);
  };

  /**
   * Print a single text line.
   * align: 'left' (default) | 'center' | 'right'
   */
  const txt = (
    str: string, x: number, y: number,
    color: RGB, size: number,
    style: 'normal' | 'bold' = 'normal',
    align: 'left' | 'center' | 'right' = 'left',
  ) => {
    setTxt(color);
    pdf.setFontSize(size);
    pdf.setFont('helvetica', style);
    pdf.text(str, x, y, { align });
  };

  /**
   * Print wrapped text.
   * Returns the Y coordinate AFTER the last line.
   */
  const txtWrap = (
    str: string, x: number, y: number,
    color: RGB, size: number, maxW: number, lineH = 4.5,
  ): number => {
    setTxt(color);
    pdf.setFontSize(size);
    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(str, maxW) as string[];
    pdf.text(lines, x, y);
    return y + (lines.length - 1) * lineH;
  };

  /**
   * Draw a bullet point item.
   * bulletColor for the bullet glyph, textColor for the body.
   * Returns Y after the text block.
   */
  const bulletItem = (
    str: string, x: number, y: number,
    bulletColor: RGB, textColor: RGB,
    glyph = '•', size = 7.5, maxW = 90, lineH = 4.5,
  ): number => {
    txt(glyph, x, y, bulletColor, size, 'bold');
    const endY = txtWrap(str, x + 5, y, textColor, size, maxW, lineH);
    return endY + 5;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // HEADER — thin top bar
  // ══════════════════════════════════════════════════════════════════════════

  box(0, 0, PAGE_W, 8, C.brand);
  txt('HireIQ', ML, 5.5, C.white, 7, 'bold');
  txt('HireIQ — AI-Powered Interview Platform', PAGE_W / 2, 5.5, C.white, 7, 'normal', 'center');
  txt(data.generatedAt, PAGE_W - MR, 5.5, C.white, 6.5, 'normal', 'right');

  // ══════════════════════════════════════════════════════════════════════════
  // HERO — check icon + "Interview Completed" + candidate name
  // ══════════════════════════════════════════════════════════════════════════

  let y = 22;

  // Circle icon (drawn with arcs)
  const cx = PAGE_W / 2;
  pdf.setDrawColor(...C.success);
  pdf.setLineWidth(0.8);
  pdf.circle(cx, y + 6, 7, 'S');          // outer ring
  txt('✓', cx, y + 8.5, C.success, 11, 'bold', 'center');

  y += 20;
  txt('Interview Completed', cx, y, C.dark, 16, 'bold', 'center');

  y += 7;
  // Candidate initials badge
  const cName    = data.candidate.fullName || 'Candidate';
  const initials = cName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  box(cx - 22, y - 4, 8, 6, C.bgBlue, 1);
  txt(initials, cx - 18, y, C.brand, 7, 'bold', 'center');
  txt(cName, cx - 10, y, C.mid, 8, 'normal');

  y += 12;
  hLine(y);

  // ══════════════════════════════════════════════════════════════════════════
  // STATS ROW — 4 cards
  // ══════════════════════════════════════════════════════════════════════════

  y += 6;
  const STAT_COUNT = 4;
  const STAT_GAP   = 3;
  const STAT_W     = (CW - STAT_GAP * (STAT_COUNT - 1)) / STAT_COUNT;  // ≈ 40.25
  const STAT_H     = 20;

  const stats = [
    { value: String(data.questionsAttempted), label: 'Questions', sub: 'Attempted' },
    { value: String(data.totalQuestions),     label: 'Questions', sub: 'Total'     },
    { value: data.timeTaken,                  label: 'Time Taken', sub: `of ${data.timeLimit}` },
    { value: data.grade,                      label: 'Grade',      sub: 'Overall'  },
  ];

  stats.forEach((s, i) => {
    const sx = ML + i * (STAT_W + STAT_GAP);
    box(sx, y, STAT_W, STAT_H, C.bgGray, 2);
    outlineBox(sx, y, STAT_W, STAT_H, C.border, 0.25, 2);

    // Large metric
    txt(s.value, sx + STAT_W / 2, y + 8, C.dark, 13, 'bold', 'center');
    // Label + sub
    txt(s.label, sx + STAT_W / 2, y + 13, C.mid, 6, 'normal', 'center');
    txt(s.sub,   sx + STAT_W / 2, y + 17, C.light, 5.5, 'normal', 'center');
  });

  y += STAT_H + 8;
  hLine(y);

  // ══════════════════════════════════════════════════════════════════════════
  // AI EVALUATION REPORT
  // ══════════════════════════════════════════════════════════════════════════

  y += 7;

  // Section heading row
  box(ML, y - 4, 4, 4, C.brand, 0.5);                      // small accent square
  txt('AI Evaluation Report', ML + 6, y, C.dark, 9, 'bold');

  y += 7;

  // ── Left column (strengths + improvements) ────────────────────────────────
  const LEFT_W  = 100;    // text column width
  const RIGHT_X = ML + LEFT_W + 8;   // x start of confidence badge column

  // STRENGTHS heading
  txt('Strengths', ML + 5, y, C.success, 8.5, 'bold');
  y += 5;

  data.strengths.forEach(s => {
    y = bulletItem(s, ML + 3, y, C.success, C.dark, '✦', 7, LEFT_W - 8);
  });

  y += 1;

  // IMPROVEMENTS heading
  txt('Areas for Improvement', ML + 5, y, C.warning, 8.5, 'bold');
  y += 5;

  data.improvements.forEach(item => {
    y = bulletItem(item, ML + 3, y, C.warning, C.dark, '–', 7, LEFT_W - 8);
  });

  // ── Confidence Score — right column ──────────────────────────────────────
  // (positioned relative to where evaluation section started, not current y)
  const BADGE_Y  = (/* eval section start y captured below */ 0); // see below
  const ringTopY = 68;   // fixed Y to align with eval section top

  // Draw the score ring via arc segments (jsPDF has no arc fill, so we
  // simulate with two overlapping circles and a clip approach — or simply
  // draw with ellipse strokes)
  const RX = RIGHT_X + 22;   // ring centre x
  const RY = ringTopY + 55;  // ring centre y
  const RR = 14;             // ring radius

  // Background ring (light gray)
  pdf.setDrawColor(...C.border);
  pdf.setLineWidth(3.5);
  pdf.circle(RX, RY, RR, 'S');

  // Progress arc — jsPDF doesn't have a native arc, so we approximate using
  // many small line segments (Bézier workaround)
  const pct   = data.confidenceScore / 100;
  const steps = 80;
  const start = -Math.PI / 2;          // 12 o'clock
  const end   = start + 2 * Math.PI * pct;

  pdf.setDrawColor(...C.brand);
  pdf.setLineWidth(3.5);

  for (let i = 0; i < steps; i++) {
    const a1 = start + (i / steps)       * (end - start);
    const a2 = start + ((i + 1) / steps) * (end - start);
    pdf.line(
      RX + RR * Math.cos(a1), RY + RR * Math.sin(a1),
      RX + RR * Math.cos(a2), RY + RR * Math.sin(a2),
    );
  }

  // Score text inside ring
  txt(`${data.confidenceScore}%`, RX, RY + 2, C.dark, 10, 'bold', 'center');

  // Labels below ring
  txt('Confidence Score',   RX, RY + RR + 6,  C.mid, 6.5, 'normal', 'center');
  txt('Based on AI Analysis', RX, RY + RR + 10, C.mid, 6,   'normal', 'center');

  // ══════════════════════════════════════════════════════════════════════════
  // SUBMITTED FOR REVIEW banner
  // ══════════════════════════════════════════════════════════════════════════

  y += 6;
  box(ML, y, CW, 12, C.bgBlue, 2);
  outlineBox(ML, y, CW, 12, C.brandSoft, 0.3, 2);

  txt('✔', ML + 6, y + 8, C.brand, 9, 'bold');
  txt('Submitted for Review', ML + 12, y + 8, C.brand, 8.5, 'bold');
  txt('· Our team will reach out within 3 business days', ML + 53, y + 8, C.mid, 7.5);

  y += 19;

  // ══════════════════════════════════════════════════════════════════════════
  // CANDIDATE INFO TABLE
  // ══════════════════════════════════════════════════════════════════════════

  hLine(y);
  y += 6;

  const INFO_COLS = 3;
  const INFO_W    = CW / INFO_COLS;

  const infoItems = [
    { label: 'Role Applied', value: data.candidate.role       || 'N/A' },
    { label: 'Experience',   value: data.candidate.experience || 'N/A' },
    { label: 'Email',        value: data.candidate.email      || 'N/A' },
  ];

  infoItems.forEach((item, i) => {
    const ix = ML + i * INFO_W;
    txt(item.label, ix, y,     C.mid,  7,   'normal');
    txt(item.value, ix, y + 5, C.dark, 8.5, 'bold');
  });

  y += 14;

  // ══════════════════════════════════════════════════════════════════════════
  // FOOTER
  // ══════════════════════════════════════════════════════════════════════════

  box(0, PAGE_H - 8, PAGE_W, 8, C.brand);
  txt('HireIQ — Confidential Interview Report', ML, PAGE_H - 3.5, C.white, 6.5);
  txt('Page 1 of 1', PAGE_W - MR, PAGE_H - 3.5, C.white, 6.5, 'normal', 'right');

  // ── Save ──────────────────────────────────────────────────────────────────
  pdf.save(`${PDF_FILE_NAME}.pdf`);
}

// ─── UI Sub-components ────────────────────────────────────────────────────────

function ConfidenceRing({ score }: { score: number }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 800);
    return () => clearTimeout(t);
  }, []);

  const offset = circumference - (circumference * (animated ? score : 0)) / 100;

  return (
    <div className="relative mx-auto w-28 h-28">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#1f2937" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius}
          fill="none" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{animated ? score : 0}%</span>
        <span className="text-xs text-gray-500">Score</span>
      </div>
    </div>
  );
}

function StatCard({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="p-4 text-center border bg-white/5 border-white/10 rounded-2xl">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SummaryScreen() {
  const { candidateData, setCurrentScreen, stopCamera } = useApp();
  const [visible,    setVisible]    = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const name     = candidateData.fullName || 'Candidate';
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  // ── PDF handler ───────────────────────────────────────────────────────────
  const handleDownloadPdf = () => {
    try {
      setIsExporting(true);

      const generatedAt = new Date().toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });

      generateInterviewPdf({
        candidate: {
          fullName  : candidateData.fullName,
          role      : candidateData.role,
          experience: candidateData.experience,
          email     : candidateData.email,
        },
        questionsAttempted: QUESTIONS_ATTEMPTED,
        totalQuestions    : TOTAL_QUESTIONS,
        timeTaken         : TIME_TAKEN,
        timeLimit         : TIME_LIMIT,
        grade             : GRADE,
        confidenceScore   : CONFIDENCE_SCORE,
        strengths         : STRENGTHS,
        improvements      : IMPROVEMENTS,
        generatedAt,
      });
    } catch (err) {
      console.error('[SummaryScreen] PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleReturnHome = () => {
    setCurrentScreen(1);
    stopCamera();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col animate-fade-in">

      {/* Nav */}
      <nav className="flex items-center gap-2 px-6 py-4 border-b border-white/5">
        <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">HireIQ</span>
      </nav>

      <main className="flex items-start justify-center flex-1 px-4 py-10">
        <div
          className={`w-full max-w-2xl transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Completion header */}
          <div className="mb-8 text-center">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-30" />
              <div className="flex items-center justify-center w-20 h-20 border-2 rounded-full bg-emerald-500/20 border-emerald-500">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white">Interview Completed</h1>
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-blue-400 rounded-full bg-blue-500/20">
                {initials}
              </div>
              <span className="text-gray-300">{name}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <StatCard value={String(QUESTIONS_ATTEMPTED)} label="Questions"  sub="Attempted"          />
            <StatCard value={String(TOTAL_QUESTIONS)}     label="Questions"  sub="Total"               />
            <StatCard value={TIME_TAKEN}                  label="Time Taken" sub={`of ${TIME_LIMIT}`}  />
            <StatCard value={GRADE}                       label="Grade"      sub="Overall"             />
          </div>

          {/* AI Evaluation */}
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center justify-center rounded-lg w-7 h-7 bg-blue-500/20">
                <Brain className="w-4 h-4 text-blue-400" />
              </div>
              <h2 className="text-base font-semibold text-white">AI Evaluation Report</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="space-y-4 sm:col-span-2">
                {/* Strengths */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-emerald-400">Strengths</h3>
                  </div>
                  <ul className="space-y-2">
                    {STRENGTHS.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <Star className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <h3 className="text-sm font-semibold text-yellow-400">Areas for Improvement</h3>
                  </div>
                  <ul className="space-y-2">
                    {IMPROVEMENTS.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-yellow-500 font-bold text-xs">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Confidence ring */}
              <div className="flex flex-col items-center justify-center gap-3 pt-4 border-t sm:border-t-0 sm:border-l border-white/10 sm:pt-0 sm:pl-5">
                <ConfidenceRing score={CONFIDENCE_SCORE} />
                <p className="text-xs text-center text-gray-400">
                  Confidence Score<br />Based on AI Analysis
                </p>
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex items-center justify-center gap-2 py-4 mb-6 border bg-blue-500/10 border-blue-500/30 rounded-2xl">
            <CheckCircle2 className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300">Submitted for Review</span>
            <span className="text-sm text-gray-500">· Our team will reach out within 3 business days</span>
          </div>

          {/* Candidate info */}
          {candidateData.role && (
            <div className="p-4 mb-6 border bg-white/5 border-white/10 rounded-2xl">
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-gray-500">Role Applied</p>
                  <p className="font-medium text-white">{candidateData.role}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Experience</p>
                  <p className="font-medium text-white">{candidateData.experience || 'N/A'}</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-white truncate">{candidateData.email || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex items-center justify-center flex-1 gap-2 py-3 text-sm font-medium text-gray-300 transition-all border rounded-full bg-white/5 hover:bg-white/10 border-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Exporting…</>
                : <><Download className="w-4 h-4" /> Download Report</>}
            </button>

            <button
              onClick={handleReturnHome}
              className="flex items-center justify-center flex-1 gap-2 py-3 text-sm font-semibold text-white transition-all duration-300 bg-blue-600 rounded-full shadow-lg hover:bg-blue-500 shadow-blue-600/30 hover:scale-105 active:scale-95"
            >
              <Home className="w-4 h-4" /> Return to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
