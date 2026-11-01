import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { ShieldCheck, Lock, ExternalLink, Cpu, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — 100% Client-Side Processing | Vivexa Tools',
  description:
    'Comprehensive privacy policy for Vivexa Tools, developed by Vivexa Tech. Learn how our 100% client-side architecture keeps your documents and media private on your device.'
};

export default function PrivacyPolicyPage() {
  const sections = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'about-vivexa-tools', title: '2. About Vivexa Tools' },
    { id: 'developer-maintenance', title: '3. Who Develops & Maintains the Platform' },
    { id: 'information-collected', title: '4. Information We Collect' },
    { id: 'file-processing', title: '5. File Processing & Local Execution' },
    { id: 'personal-information', title: '6. Personal Information' },
    { id: 'cookies-storage', title: '7. Cookies & Local Browser Storage' },
    { id: 'third-party-libraries', title: '8. Third-Party Libraries & Resources' },
    { id: 'data-security', title: '9. Data Security & Technical Limitations' },
    { id: 'children-privacy', title: '10. Children’s Privacy' },
    { id: 'policy-changes', title: '11. Changes to This Policy' },
    { id: 'contact-info', title: '12. Contact Information' },
    { id: 'effective-date', title: '13. Effective Date' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

        {/* Header Hero */}
        <div className="mt-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Server File Processing</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Effective Date: November 1, 2026
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            This Privacy Policy explains how Vivexa Tools, developed by{' '}
            <a
              href="https://www.vivexatech.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              Vivexa Tech
              <ExternalLink className="w-3 h-3" />
            </a>
            , handles user privacy, local client-side file manipulation, and technical network requests.
          </p>
        </div>

        {/* Content Layout with Table of Contents */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents Sticky Sidebar */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                On This Page
              </span>
              <nav className="space-y-1 text-xs">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block py-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Document Body */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed shadow-xs">
            {/* 1. Introduction */}
            <section id="introduction" className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">1. Introduction</h2>
              <p>
                Welcome to Vivexa Tools. We consider privacy to be a non-negotiable right rather than an optional setting.
                Most online file utility websites upload your private PDFs, financial sheets, ID photos, and personal media to remote cloud servers to convert or compress them.
              </p>
              <p>
                Vivexa Tools was engineered with an entirely different architecture: all supported operations run directly inside your web browser sandbox using modern client-side standards.
              </p>
            </section>

            {/* 2. About Vivexa Tools */}
            <section id="about-vivexa-tools" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">2. About Vivexa Tools</h2>
              <p>
                Vivexa Tools is an everyday suite of web-based digital utilities covering PDF merging, splitting, rotation, watermarking, signing, and page numbering; photo resizing, compression, passport photo generation, and format transcoding; video trimming and splitting; audio conversion; OCR text extraction; and color inspection.
              </p>
            </section>

            {/* 3. Who develops and maintains the platform */}
            <section id="developer-maintenance" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">3. Who Develops &amp; Maintains the Platform</h2>
              <p>
                Vivexa Tools is created, designed, and maintained by{' '}
                <a
                  href="https://www.vivexatech.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1"
                >
                  Vivexa Tech
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                . Vivexa Tech is a technology company dedicated to developing high-performance, accessible, and user-respecting digital products and solutions.
              </p>
            </section>

            {/* 4. Information we collect */}
            <section id="information-collected" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">4. Information We Collect</h2>
              <p>
                <strong>We do not collect, view, store, transmit, or monetize your uploaded files.</strong>
              </p>
              <p>
                Specifically:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li>No user account or login is required to use Vivexa Tools.</li>
                <li>No email addresses, names, or contact details are collected during file processing.</li>
                <li>No database records of your documents, photos, or media are ever created.</li>
              </ul>
              <p className="text-xs text-slate-500 italic mt-2">
                Technical Note: As with any standard website, requests to load static HTML, CSS, JavaScript chunks, and web fonts are transmitted to the website’s content delivery network (CDN) / hosting infrastructure, which may log basic networking data such as IP address and user-agent strictly for security and delivery purposes.
              </p>
            </section>

            {/* 5. File processing and local processing */}
            <section id="file-processing" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">5. File Processing &amp; Local Execution</h2>
              <p>
                When you drag and drop or select a file in Vivexa Tools:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
                <li>The file is read locally by your device’s browser into memory using browser Web APIs (e.g., <code>FileReader</code>, <code>ArrayBuffer</code>, <code>CanvasRenderingContext2D</code>, <code>AudioContext</code>).</li>
                <li>Processing libraries (such as <code>pdf-lib</code>, WebAssembly OCR workers, and canvas transcoders) execute on your machine’s CPU and GPU.</li>
                <li>Downloaded results are compiled directly from memory into a local download stream via standard Blob URLs (<code>URL.createObjectURL</code>).</li>
                <li>Temporary memory pointers are revoked when you close the tab, replace the file, or reset the workspace.</li>
              </ul>
            </section>

            {/* 6. Personal information */}
            <section id="personal-information" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">6. Personal Information</h2>
              <p>
                Because Vivexa Tools operates without user authentication and without remote storage, we do not gather personal profiles or sell behavioral data to third-party data brokers.
              </p>
            </section>

            {/* 7. Cookies and local browser storage */}
            <section id="cookies-storage" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">7. Cookies &amp; Local Browser Storage</h2>
              <p>
                Vivexa Tools does not deploy tracking cookies or cross-site advertising cookies. Transient browser storage (such as memory state) is used solely while you are actively editing or viewing a document in your active browser session.
              </p>
            </section>

            {/* 8. Third-party libraries and resources */}
            <section id="third-party-libraries" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">8. Third-Party Libraries &amp; Resources</h2>
              <p>
                All open-source libraries used within Vivexa Tools (including <code>pdf-lib</code>, <code>pdfjs-dist</code>, <code>jszip</code>, and <code>tesseract.js</code>) are bundled with the web application and execute in your browser. Language models for OCR (such as English neural network weights) are loaded via standard browser worker caching.
              </p>
            </section>

            {/* 9. Data security and privacy limitations */}
            <section id="data-security" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">9. Data Security &amp; Technical Limitations</h2>
              <p>
                While client-side processing prevents data interception between your device and a server, you remain responsible for the security of your physical device, local browser extensions, and operating system. We advise users to maintain original backups of important documents before performing file alterations.
              </p>
            </section>

            {/* 10. Children's privacy */}
            <section id="children-privacy" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">10. Children’s Privacy</h2>
              <p>
                Vivexa Tools does not knowingly collect personally identifiable information from children or any other users. The tools are designed to operate anonymously for users of all ages.
              </p>
            </section>

            {/* 11. Changes to this policy */}
            <section id="policy-changes" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">11. Changes to This Policy</h2>
              <p>
                We may periodically update this Privacy Policy to reflect enhancements in web standards or newly added client-side features. Any revisions will be published on this page with an updated effective date.
              </p>
            </section>

            {/* 12. Contact information */}
            <section id="contact-info" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">12. Contact Information</h2>
              <p>
                For questions regarding this policy or technical inquiries, please visit our{' '}
                <Link href="/contact" className="text-indigo-600 font-semibold hover:underline">
                  Contact &amp; Feedback page
                </Link>{' '}
                or reach out to the developer directly via the official website:{' '}
                <a
                  href="https://www.vivexatech.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  https://www.vivexatech.in/
                </a>
                .
              </p>
            </section>

            {/* 13. Effective date */}
            <section id="effective-date" className="space-y-2 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">13. Effective Date</h2>
              <p className="text-slate-600">
                This Privacy Policy is effective as of <strong>November 1, 2026</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
