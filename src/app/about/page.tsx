import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { ShieldCheck, Cpu, Lock, Zap, CheckCircle2, Heart } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'About Us - Privacy-Focused Local Online Tools | Vivexa Tools',
  description:
    'Learn about Vivexa Tools, developed by Vivexa Tech. Discover our 100% in-browser processing architecture and mission to provide secure, serverless online utilities.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
  openGraph: {
    title: 'About Vivexa Tools - Privacy-First Web Utilities',
    description: 'Learn about Vivexa Tools and our zero-server file processing architecture.',
    url: `${SITE_CONFIG.url}/about`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [{ url: `${SITE_CONFIG.url}/favicon-512x512.png`, width: 512, height: 512, alt: 'About Vivexa Tools' }],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs items={[{ label: 'About Vivexa Tools' }]} />

        <div className="mt-6 bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-8 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero-Server Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              About Vivexa Tools
            </h1>
            <p className="text-base text-slate-600 mt-3 leading-relaxed">
              Vivexa Tools was founded on a simple belief: everyday online utilities should be fast, private, and accessible to everyone without requiring users to surrender their confidential documents or personal photos to third-party cloud servers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Your Privacy is Inviolable</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Most online converters and PDF tools upload your sensitive tax documents, IDs, or photos to remote cloud servers where they can be retained, analyzed, or leaked. Vivexa Tools runs client-side inside your browser sandbox.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Unconstrained Speed</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                By processing data locally on your device&apos;s processor, you avoid slow upload progress bars, bandwidth limits, and artificial file queues. Everything executes instantly.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Our Technology Stack</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We leverage modern browser capabilities, including:
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>pdf-lib &amp; PDF.js:</strong> Client-side PDF manipulation, parsing, vector rendering, and cryptographic signing.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>HTML5 Canvas API:</strong> High-precision pixel manipulation, DPI scaling, and mathematical color space transformations.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Web Audio API:</strong> Native PCM decoding, resampling, and channel downmixing for sound files.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>MediaRecorder API:</strong> Hardware-accelerated client video encoding and frame capture.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Tesseract.js (WASM):</strong> Client-side neural network OCR running directly in browser Web Workers.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
