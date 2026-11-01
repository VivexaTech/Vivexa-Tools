'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Mail, MessageSquare, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [topic, setTopic] = useState('Feedback');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs items={[{ label: 'Contact & Feedback' }]} />

        <div className="mt-6 bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-8 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-3">
              <MessageSquare className="w-4 h-4" />
              <span>We Value Your Input</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Contact &amp; Feedback
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Have a suggestion for a new client-side tool? Found an edge-case file that failed to parse? Let us know so we can improve Vivexa Tools.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-emerald-900">
                Thank You for Your Feedback!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto">
                Your comments help us make Vivexa Tools faster, more reliable, and more accessible for everyone.
              </p>
              <button
                type="button"
                onClick={() => { setSubmitted(false); setMessage(''); }}
                className="mt-4 px-4 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Feedback Topic
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['Bug Report', 'Feature Request', 'General Feedback'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTopic(item)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                        topic === item
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-600/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Your Message or Feedback
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your suggestion or issue in detail..."
                  className="w-full p-4 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>No account or login required</span>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
