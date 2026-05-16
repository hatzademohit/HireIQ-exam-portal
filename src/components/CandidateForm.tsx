import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Brain, ArrowRight, ArrowLeft, X, Upload, User, Mail, Briefcase, Award, Code } from 'lucide-react';
import { useApp, CandidateData } from '../context/AppContext';

const roles = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Data Engineer'];
const experienceLevels = ['Fresher', 'Junior', 'Mid', 'Senior'];

interface Errors {
  fullName?: string;
  email?: string;
  role?: string;
  experience?: string;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-300 mb-1.5">{children}</label>;
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-400">{msg}</p>;
}

export default function CandidateForm() {
  const { setCurrentScreen, setCandidateData } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<CandidateData>({
    fullName: '', email: '', role: '', experience: '', skills: [], resumeName: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [skillInput, setSkillInput] = useState('');
  const [skillError, setSkillError] = useState<boolean>(false)

  const validate = (data: CandidateData): Errors => {
    const e: Errors = {};
    if (!data.fullName.trim()) e.fullName = 'Full name is required.';
    if (!data.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Enter a valid email address.';
    if (!data.role) e.role = 'Please select a role.';
    if (!data.experience) e.experience = 'Please select experience level.';
    return e;
  };

  const handleBlur = (field: string) => {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(validate(form));
  };

  const handleChange = (field: keyof CandidateData, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) setErrors(validate(updated));
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm(f => ({ ...f, skills: [...f.skills, s] }));
    }
    setSkillInput('');
    setSkillError(false)
  };

  const removeSkill = (skill: string) => {
    setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));
    onblurSkill()
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setForm(f => ({ ...f, resumeName: file.name }));
  };

  const isValid = Object.keys(validate(form)).length === 0 && skillError != true;

  const handleSubmit = () => {
    setTouched({ fullName: true, email: true, role: true, experience: true });
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setCandidateData(form);
      setCurrentScreen(3);
    }
  };

  const onblurSkill = () => {
    if(form?.skills?.length <= 0 ){
      setSkillError(true)
    }else{
      setSkillError(false)
    }
  }

  useEffect(() =>{
    onblurSkill()
    setSkillError(false)
  }, [form?.skills])

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
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2 text-sm text-blue-400">
              <span className="flex items-center justify-center w-5 h-5 text-xs font-bold border rounded-full bg-blue-500/20 border-blue-500/40">2</span>
              <span>Step 2 of 6</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Candidate Details</h1>
            <p className="mt-1 text-gray-400">Tell us about yourself before we begin the interview.</p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 mb-8 rounded-full bg-white/10">
            <div className="h-1 transition-all duration-500 bg-blue-500 rounded-full" style={{ width: '33%' }} />
          </div>

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <FieldLabel><span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name <span className="text-red-400">*</span></span></FieldLabel>
              <input
                type="text"
                value={form.fullName}
                onChange={e => handleChange('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                placeholder="e.g. Alex Johnson"
                className="w-full px-4 py-3 text-white placeholder-gray-600 transition-all border bg-white/5 border-white/10 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
              />
              {touched.fullName && <ErrorMsg msg={errors.fullName} />}
            </div>

            {/* Email */}
            <div>
              <FieldLabel><span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email Address <span className="text-red-400">*</span></span></FieldLabel>
              <input
                type="email"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="alex@example.com"
                className="w-full px-4 py-3 text-white placeholder-gray-600 transition-all border bg-white/5 border-white/10 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
              />
              {touched.email && <ErrorMsg msg={errors.email} />}
            </div>

            {/* Role */}
            <div>
              <FieldLabel><span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Role Applied For <span className="text-red-400">*</span></span></FieldLabel>
              <select
                value={form.role}
                onChange={e => handleChange('role', e.target.value)}
                onBlur={() => handleBlur('role')}
                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="text-gray-500">Select a role...</option>
                {roles.map(r => <option key={r} value={r} className="bg-[#111827]">{r}</option>)}
              </select>
              {touched.role && <ErrorMsg msg={errors.role} />}
            </div>

            {/* Experience */}
            <div>
              <FieldLabel><span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Experience Level <span className="text-red-400">*</span></span></FieldLabel>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {experienceLevels.map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleChange('experience', level)}
                    className={`py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                      form.experience === level
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-blue-500/50 hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              {touched.experience && <ErrorMsg msg={errors.experience} />}
            </div>

            {/* Skills */}
            <div>
              <FieldLabel><span className="flex items-center gap-1.5"><Code className="w-3.5 h-3.5" /> Skills / Technologies <span className="text-red-400">*</span></span></FieldLabel>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onBlur={ () => onblurSkill()}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  placeholder="Type a skill and press Enter"
                  className="flex-1 px-4 py-3 text-white placeholder-gray-600 transition-all border bg-white/5 border-white/10 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-3 text-sm font-medium text-white transition-colors bg-blue-600 hover:bg-blue-500 rounded-xl"
                >
                  Add
                </button>
              </div>
              {skillError && <ErrorMsg msg="Please add skill" /> }
              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.skills.map(skill => (
                    <span key={skill} className="flex items-center gap-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs px-3 py-1.5 rounded-full">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="transition-colors hover:text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Resume Upload */}
            <div>
              <FieldLabel><span className="flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" /> Upload Resume <span className="text-xs font-normal text-gray-600">(optional)</span></span></FieldLabel>
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-5 text-center transition-all border border-dashed bg-white/5 border-white/20 hover:border-blue-500/50 rounded-xl group"
              >
                {form.resumeName ? (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20">
                      <Upload className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="font-medium text-white">{form.resumeName}</span>
                    <span className="text-xs text-gray-500">· Click to change</span>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-6 h-6 mx-auto mb-2 text-gray-500 transition-colors group-hover:text-blue-400" />
                    <p className="text-sm text-gray-400 transition-colors group-hover:text-gray-300">
                      Click to upload PDF or Word document
                    </p>
                    <p className="mt-1 text-xs text-gray-600">Max file size: 5MB</p>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setCurrentScreen(1)}
              className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-gray-400 transition-all border rounded-full bg-white/5 hover:bg-white/10 border-white/10 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-all duration-300 
                ${ isValid
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95'
                  : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/10'
              }`}
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
