import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { ShieldCheck, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms and Conditions — Vivexa Tools | Developed by Vivexa Tech',
  description:
    'Terms and conditions for using Vivexa Tools, developed by Vivexa Tech. Read our user responsibilities, permissible usage, and service limitations.'
};

export default function TermsAndConditionsPage() {
  const sections = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'acceptance', title: '2. Acceptance of Terms' },
    { id: 'description-services', title: '3. Description of the Services' },
    { id: 'permitted-use', title: '4. Permitted Use' },
    { id: 'user-responsibilities', title: '5. User Responsibilities' },
    { id: 'user-provided-files', title: '6. User-Provided Files' },
    { id: 'intellectual-property', title: '7. Copyright & Intellectual Property' },
    { id: 'privacy-local-processing', title: '8. Privacy & Local Processing' },
    { id: 'third-party-libraries', title: '9. Third-Party Libraries' },
    { id: 'accuracy-reliability', title: '10. Accuracy & Reliability' },
    { id: 'service-availability', title: '11. Service Availability' },
    { id: 'limitation-liability', title: '12. Limitation of Liability' },
    { id: 'changes-services', title: '13. Changes to the Services' },
    { id: 'changes-terms', title: '14. Changes to These Terms' },
    { id: 'contact-info', title: '15. Contact Information' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs items={[{ label: 'Terms and Conditions' }]} />

        {/* Header Hero */}
        <div className="mt-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
              <FileText className="w-3.5 h-3.5" />
              <span>Official Terms of Use</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Effective Date: November 1, 2026
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            These Terms and Conditions govern your access and use of Vivexa Tools, developed and maintained by{' '}
            <a
              href="https://www.vivexatech.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              Vivexa Tech
              <ExternalLink className="w-3 h-3" />
            </a>
            .
          </p>
        </div>

        {/* Content Layout with Table of Contents */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents Sticky Sidebar */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                Sections
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

          {/* Main Body */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed shadow-xs">
            {/* 1. Introduction */}
            <section id="introduction" className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">1. Introduction</h2>
              <p>
                Welcome to Vivexa Tools (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), developed by Vivexa Tech.
                By accessing, browsing, or using any tool or feature available on Vivexa Tools, you agree to be bound by these Terms and Conditions.
              </p>
            </section>

            {/* 2. Acceptance of Terms */}
            <section id="acceptance" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">2. Acceptance of Terms</h2>
              <p>
                If you do not agree with any part of these Terms and Conditions, you must refrain from using the platform. Your continued use constitutes ongoing acceptance of these terms.
              </p>
            </section>

            {/* 3. Description of the Services */}
            <section id="description-services" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">3. Description of the Services</h2>
              <p>
                Vivexa Tools provides free, browser-based file management, compression, document processing, image formatting, audio/video editing, OCR, and color sampling utilities. All processing operates client-side inside the user&apos;s web browser.
              </p>
            </section>

            {/* 4. Permitted Use */}
            <section id="permitted-use" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">4. Permitted Use</h2>
              <p>
                Vivexa Tools is made freely accessible for personal, academic, professional, and commercial use. You are authorized to convert, compress, and organize your files without subscription fees or artificial daily limits.
              </p>
            </section>

            {/* 5. User Responsibilities */}
            <section id="user-responsibilities" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">5. User Responsibilities</h2>
              <p>
                As a user of Vivexa Tools, you agree that you will not:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li>Process documents or media that you do not have lawful permission or copyright authority to handle.</li>
                <li>Attempt to reverse-engineer, disrupt, or introduce malicious payloads into the client application.</li>
                <li>Utilize the utilities to forge official documents or impersonate individuals without proper authorization.</li>
              </ul>
            </section>

            {/* 6. User-Provided Files */}
            <section id="user-provided-files" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">6. User-Provided Files</h2>
              <p>
                You retain complete, exclusive ownership and copyright over all files, images, documents, and media you process. Because files are processed directly on your device and are never uploaded to our servers, you are solely responsible for keeping backup copies of your source files.
              </p>
            </section>

            {/* 7. Copyright and Intellectual Property */}
            <section id="intellectual-property" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">7. Copyright &amp; Intellectual Property</h2>
              <p>
                The interface, logos, brand elements, custom code, documentation, and design of Vivexa Tools are the intellectual property of Vivexa Tech. You may not copy, scrape, or redistribute the platform layout or brand identity as your own.
              </p>
            </section>

            {/* 8. Privacy and Local Processing */}
            <section id="privacy-local-processing" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">8. Privacy &amp; Local Processing</h2>
              <p>
                Our data practices are governed by our{' '}
                <Link href="/privacy-policy" className="text-indigo-600 font-semibold hover:underline">
                  Privacy Policy
                </Link>
                . We guarantee that your documents are never uploaded to any Vivexa Tools processing server.
              </p>
            </section>

            {/* 9. Third-Party Libraries */}
            <section id="third-party-libraries" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">9. Third-Party Libraries</h2>
              <p>
                Certain functions utilize reputable open-source libraries (e.g., <code>pdf-lib</code>, <code>pdfjs-dist</code>, <code>jszip</code>, <code>tesseract.js</code>, and <code>lucide-react</code>). These libraries are governed by their respective permissive licenses (MIT, Apache 2.0).
              </p>
            </section>

            {/* 10. Accuracy and Reliability */}
            <section id="accuracy-reliability" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">10. Accuracy &amp; Reliability</h2>
              <p>
                Conversion, compression, and OCR results depend on source file quality, font encodings, and browser hardware capabilities. While we strive for high precision, Vivexa Tools does not warrant that every corrupted, non-standard, or encrypted file will process without discrepancy.
              </p>
            </section>

            {/* 11. Service Availability */}
            <section id="service-availability" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">11. Service Availability</h2>
              <p>
                The website is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We reserve the right to modify, enhance, or temporarily suspend access for maintenance without prior liability.
              </p>
            </section>

            {/* 12. Limitation of Liability */}
            <section id="limitation-liability" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">12. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by applicable law, neither Vivexa Tech nor its developers shall be liable for any indirect, incidental, consequential, or punitive damages arising from the use or inability to use the platform.
              </p>
            </section>

            {/* 13. Changes to the Services */}
            <section id="changes-services" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">13. Changes to the Services</h2>
              <p>
                We continuously refine our client-side tools and may introduce new utilities or enhance existing algorithms at our discretion to better serve user needs.
              </p>
            </section>

            {/* 14. Changes to These Terms */}
            <section id="changes-terms" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">14. Changes to These Terms</h2>
              <p>
                Vivexa Tech reserves the right to revise these Terms and Conditions at any time. Changes will be posted to this page with an updated effective date.
              </p>
            </section>

            {/* 15. Contact Information */}
            <section id="contact-info" className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">15. Contact Information</h2>
              <p>
                If you have questions regarding these terms, please visit our{' '}
                <Link href="/contact" className="text-indigo-600 font-semibold hover:underline">
                  Contact page
                </Link>{' '}
                or reach out to Vivexa Tech directly through the official website:{' '}
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
          </div>
        </div>
      </div>
    </div>
  );
}
