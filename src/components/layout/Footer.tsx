import React from 'react';
import Link from 'next/link';
import { Layers, ShieldCheck, Lock, Cpu, Heart } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="group inline-block" aria-label="Vivexa Tools Homepage">
              <BrandLogo size="md" />
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              All your everyday tools in one simple place. Merge PDFs, compress photos, generate QR &amp; barcodes, calculate EMIs, create resumes, and process documents privately in your web browser.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Client-Side Processing</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>No Server Storage. Zero File Uploads.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <Cpu className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>Hardware Accelerated Local Web APIs</span>
              </div>
            </div>
          </div>

          {/* PDF & Documents */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-xs tracking-wider uppercase mb-3">
              Document &amp; PDF
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  PDF Tools Hub
                </Link>
              </li>
              <li>
                <Link href="/pdf/pdf-to-word" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-indigo-600 dark:text-indigo-400">
                  PDF to Word (.docx)
                </Link>
              </li>
              <li>
                <Link href="/pdf/word-to-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Word to PDF
                </Link>
              </li>
              <li>
                <Link href="/pdf/merge-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link href="/document/resume-generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Resume Generator
                </Link>
              </li>
              <li>
                <Link href="/document/document-details-extractor" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  ID Details Extractor
                </Link>
              </li>
            </ul>
          </div>

          {/* QR, Barcode & Dev */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-xs tracking-wider uppercase mb-3">
              QR &amp; Barcode
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/qr-barcode" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  QR &amp; Barcode Hub
                </Link>
              </li>
              <li>
                <Link href="/qr-barcode/qr-code-generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-indigo-600 dark:text-indigo-400">
                  QR Code Generator
                </Link>
              </li>
              <li>
                <Link href="/qr-barcode/qr-code-scanner" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  QR Code Scanner
                </Link>
              </li>
              <li>
                <Link href="/qr-barcode/barcode-generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Barcode Generator
                </Link>
              </li>
              <li>
                <Link href="/developer/json-formatter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link href="/voice/speech-to-text" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Speech to Text
                </Link>
              </li>
            </ul>
          </div>

          {/* Calculators & Finance */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-xs tracking-wider uppercase mb-3">
              Finance &amp; Math
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/calculator/age-calculator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Age Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculator/emi-calculator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-indigo-600 dark:text-indigo-400">
                  EMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculator/gst-calculator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  GST Calculator
                </Link>
              </li>
              <li>
                <Link href="/business/invoice-generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Invoice Generator
                </Link>
              </li>
              <li>
                <Link href="/business/payslip-generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Payslip Generator
                </Link>
              </li>
              <li>
                <Link href="/business/income-expense-tracker" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Expense Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Legal */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-xs tracking-wider uppercase mb-3">
              Platform &amp; Legal
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  All Tools Directory
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About Vivexa Tools
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Contact &amp; Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 Vivexa Tools. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Developed by</span>
            <a
              href="https://www.vivexatech.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              Vivexa Tech
            </a>
            <span>• 100% In-Browser Privacy</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
