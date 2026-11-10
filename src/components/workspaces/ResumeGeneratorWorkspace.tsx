'use client';

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Check,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap
} from 'lucide-react';

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

interface EducationItem {
  id: string;
  degree: string;
  school: string;
  year: string;
  score: string;
}

interface ResumeData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
}

const SAMPLE_RESUME: ResumeData = {
  fullName: 'Aditya Sharma',
  jobTitle: 'Senior Full Stack Software Engineer',
  email: 'aditya.sharma@example.com',
  phone: '+91 98765 43210',
  location: 'Bangalore, India',
  website: 'https://github.com/aditya-dev',
  summary:
    'Dedicated Full Stack Engineer with 5+ years of experience designing scalable Next.js and TypeScript web architectures. Expert in browser-native processing, WebAssembly, reactive state management, and high-performance frontend engineering.',
  skills: 'React, Next.js, TypeScript, Tailwind CSS, Node.js, WebAssembly, Web Workers, Docker, PostgreSQL, Jest',
  experience: [
    {
      id: '1',
      role: 'Lead Frontend Architect',
      company: 'TechCorp Solutions',
      period: '2023 - Present',
      description:
        'Architected high-throughput client-side document processing engines reducing server costs by 80%. Led a team of 8 engineers delivering enterprise web applications with 99.9% uptime.',
    },
    {
      id: '2',
      role: 'Full Stack Engineer',
      company: 'CloudMatrix Inc',
      period: '2021 - 2023',
      description:
        'Built responsive web interfaces and microservices. Implemented real-time collaborative workspaces and optimized initial load time by 45% using Next.js code splitting.',
    },
  ],
  education: [
    {
      id: '1',
      degree: 'B.Tech in Computer Science & Engineering',
      school: 'National Institute of Technology',
      year: '2017 - 2021',
      score: '8.8 CGPA (First Class with Distinction)',
    },
  ],
};

export const ResumeGeneratorWorkspace: React.FC = () => {
  const [data, setData] = useState<ResumeData>(SAMPLE_RESUME);

  const updateField = (field: keyof ResumeData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now().toString(),
          role: 'Software Engineer',
          company: 'Company Name',
          period: '2022 - 2024',
          description: 'Key accomplishments and responsibilities...',
        },
      ],
    }));
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  };

  const removeExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  };

  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          degree: 'Degree Title',
          school: 'University Name',
          year: '2020 - 2024',
          score: 'CGPA or Percentage',
        },
      ],
    }));
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((ed) => (ed.id === id ? { ...ed, [field]: value } : ed)),
    }));
  };

  const removeEducation = (id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((ed) => ed.id !== id),
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const exportJsonBackup = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${data.fullName.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.fullName) setData(parsed);
        } catch (err) {
          alert('Invalid JSON resume profile format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportJsonBackup}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save Profile (JSON)</span>
          </button>

          <label className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Load Profile</span>
            <input type="file" accept=".json" onChange={handleLoadJson} className="hidden" />
          </label>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="px-5 py-2 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF Resume</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Editor (6 cols) - Hidden during print */}
        <div className="lg:col-span-6 space-y-6 print:hidden">
          {/* Personal Info */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Personal Information</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Full Name</label>
                <input
                  type="text"
                  value={data.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Target Role / Title</label>
                <input
                  type="text"
                  value={data.jobTitle}
                  onChange={(e) => updateField('jobTitle', e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Email Address</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Phone Number</label>
                <input
                  type="text"
                  value={data.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Location (City, Country)</label>
                <input
                  type="text"
                  value={data.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Portfolio / LinkedIn URL</label>
                <input
                  type="text"
                  value={data.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500">Professional Summary</label>
              <textarea
                rows={3}
                value={data.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500">Key Skills (Comma separated)</label>
              <input
                type="text"
                value={data.skills}
                onChange={(e) => updateField('skills', e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>Work Experience</span>
              </h3>
              <button
                type="button"
                onClick={addExperience}
                className="px-3 py-1.5 rounded-xl font-semibold text-xs bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Position</span>
              </button>
            </div>

            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="Role / Title"
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => removeExperience(exp.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Dates (e.g. 2021 - Present)"
                      value={exp.period}
                      onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Key achievements..."
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Education</span>
              </h3>
              <button
                type="button"
                onClick={addEducation}
                className="px-3 py-1.5 rounded-xl font-semibold text-xs bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Degree</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.education.map((ed) => (
                <div
                  key={ed.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="Degree Title"
                      value={ed.degree}
                      onChange={(e) => updateEducation(ed.id, 'degree', e.target.value)}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeEducation(ed.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="University"
                      value={ed.school}
                      onChange={(e) => updateEducation(ed.id, 'school', e.target.value)}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Year"
                      value={ed.year}
                      onChange={(e) => updateEducation(ed.id, 'year', e.target.value)}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="CGPA / Marks"
                      value={ed.score}
                      onChange={(e) => updateEducation(ed.id, 'score', e.target.value)}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right ATS A4 Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-10 font-sans text-xs space-y-6 min-h-[700px] print:shadow-none print:border-none print:p-0 print:m-0">
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-4">
              <h1 className="text-2xl font-black tracking-tight text-slate-900">{data.fullName}</h1>
              <p className="text-sm font-semibold text-indigo-700 mt-0.5">{data.jobTitle}</p>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600 mt-3">
                {data.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {data.email}
                  </span>
                )}
                {data.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {data.phone}
                  </span>
                )}
                {data.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {data.location}
                  </span>
                )}
                {data.website && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-400" />
                    {data.website}
                  </span>
                )}
              </div>
            </div>

            {/* Summary */}
            {data.summary && (
              <div className="space-y-1.5">
                <h3 className="font-black uppercase tracking-wider text-[11px] text-slate-900 border-b border-slate-200 pb-0.5">
                  Professional Summary
                </h3>
                <p className="text-slate-700 text-[11px] leading-relaxed">{data.summary}</p>
              </div>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-black uppercase tracking-wider text-[11px] text-slate-900 border-b border-slate-200 pb-0.5">
                  Experience
                </h3>
                <div className="space-y-3">
                  {data.experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                        <span>{exp.role}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{exp.period}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600">{exp.company}</div>
                      <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-black uppercase tracking-wider text-[11px] text-slate-900 border-b border-slate-200 pb-0.5">
                  Education
                </h3>
                <div className="space-y-2">
                  {data.education.map((ed) => (
                    <div key={ed.id} className="flex justify-between items-baseline text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{ed.degree}</span>
                        <span className="text-slate-600 text-[11px] block">{ed.school}</span>
                      </div>
                      <div className="text-right text-[11px]">
                        <span className="text-slate-500">{ed.year}</span>
                        {ed.score && <span className="block font-semibold text-slate-700">{ed.score}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {data.skills && (
              <div className="space-y-1.5">
                <h3 className="font-black uppercase tracking-wider text-[11px] text-slate-900 border-b border-slate-200 pb-0.5">
                  Technical & Professional Skills
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {data.skills.split(',').map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium"
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
