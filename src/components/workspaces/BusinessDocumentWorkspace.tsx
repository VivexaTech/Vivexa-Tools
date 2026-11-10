'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  FileText,
  Receipt,
  Download,
  Printer,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Building,
  UploadCloud,
  Check
} from 'lucide-react';

interface BusinessDocumentWorkspaceProps {
  initialType?: 'payslip' | 'invoice' | 'quotation' | 'receipt';
}

interface LineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  taxPercent: number;
}

export const BusinessDocumentWorkspace: React.FC<BusinessDocumentWorkspaceProps> = ({
  initialType = 'invoice',
}) => {
  const [docType, setDocType] = useState<'payslip' | 'invoice' | 'quotation' | 'receipt'>(initialType);

  // General Company / Seller Info
  const [companyName, setCompanyName] = useState('Vivexa Technologies Pvt Ltd');
  const [companyAddress, setCompanyAddress] = useState('Tech Boulevard, 4th Floor, Bangalore, Karnataka - 560100');
  const [companyTaxId, setCompanyTaxId] = useState('GSTIN: 29AAAAA0000A1Z5');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Client / Employee Info
  const [clientName, setClientName] = useState('Acme Corporation');
  const [clientAddress, setClientAddress] = useState('742 Evergreen Terrace, Springfield, OR - 97477');
  const [clientTaxId, setClientTaxId] = useState('GSTIN: 29BBBBB1111B1Z2');

  // Metadata
  const [docNumber, setDocNumber] = useState('INV-2026-0042');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('Thank you for your business. Payment is due within 15 days.');

  // Payslip specific fields
  const [employeeId, setEmployeeId] = useState('EMP-1042');
  const [designation, setDesignation] = useState('Senior Software Engineer');
  const [department, setDepartment] = useState('Engineering');
  const [bankAccount, setBankAccount] = useState('HDFC Bank - A/C 50100012345678');
  const [payPeriod, setPayPeriod] = useState('March 2026');

  const [basicSalary, setBasicSalary] = useState<number>(60000);
  const [hra, setHra] = useState<number>(24000);
  const [specialAllowance, setSpecialAllowance] = useState<number>(16000);
  const [providentFund, setProvidentFund] = useState<number>(4800);
  const [taxDeduction, setTaxDeduction] = useState<number>(5000);

  // Invoice / Quotation / Receipt Line items
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: 'Enterprise Web Application Architecture & Development', qty: 1, rate: 85000, taxPercent: 18 },
    { id: '2', description: 'Cloud Infrastructure Setup & Optimization', qty: 1, rate: 25000, taxPercent: 18 },
  ]);

  const previewCardRef = useRef<HTMLDivElement>(null);

  // Logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setLogoUrl(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), description: 'New Service / Item', qty: 1, rate: 5000, taxPercent: 18 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, val: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  // Calculations for Invoice / Quote / Receipt
  const invoiceTotals = useMemo(() => {
    let subtotal = 0;
    let totalTax = 0;

    items.forEach((item) => {
      const lineSub = item.qty * item.rate;
      const lineTax = (lineSub * item.taxPercent) / 100;
      subtotal += lineSub;
      totalTax += lineTax;
    });

    const grandTotal = subtotal + totalTax;
    return { subtotal, totalTax, grandTotal };
  }, [items]);

  // Calculations for Payslip
  const payslipTotals = useMemo(() => {
    const totalEarnings = basicSalary + hra + specialAllowance;
    const totalDeductions = providentFund + taxDeduction;
    const netSalary = Math.max(0, totalEarnings - totalDeductions);
    return { totalEarnings, totalDeductions, netSalary };
  }, [basicSalary, hra, specialAllowance, providentFund, taxDeduction]);

  const handlePrint = () => {
    window.print();
  };

  const formatCurr = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Document Type Switcher */}
      <div className="flex justify-center print:hidden">
        <div className="inline-flex bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1.5 shadow-xs">
          {[
            { id: 'invoice', label: 'Invoice Generator' },
            { id: 'quotation', label: 'Quotation / Estimate' },
            { id: 'receipt', label: 'Payment Receipt' },
            { id: 'payslip', label: 'Salary Payslip' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setDocType(tab.id as any);
                if (tab.id === 'quotation') setDocNumber('QUO-2026-0018');
                else if (tab.id === 'receipt') setDocNumber('REC-2026-0089');
                else if (tab.id === 'payslip') setDocNumber('PAY-MAR-2026');
                else setDocNumber('INV-2026-0042');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                docType === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Inputs (6 cols) - Hidden during print */}
        <div className="lg:col-span-6 space-y-6 print:hidden">
          {/* Header & Logo */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600" />
              <span>Business & Issuer Information</span>
            </h3>

            <div className="flex items-center gap-4">
              <input type="file" id="logoUpload" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              <label
                htmlFor="logoUpload"
                className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 overflow-hidden bg-slate-50 dark:bg-slate-800"
              >
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-[10px] text-slate-400 text-center p-1">
                    <UploadCloud className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                    <span>Upload Logo</span>
                  </div>
                )}
              </label>

              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Your Company / Freelancer Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="GSTIN / PAN / Tax Number"
                  value={companyTaxId}
                  onChange={(e) => setCompanyTaxId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <textarea
              rows={2}
              placeholder="Full Business Address..."
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Client or Employee details */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {docType === 'payslip' ? 'Employee Profile' : 'Bill To (Client / Customer)'}
            </h3>

            {docType === 'payslip' ? (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Employee Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Employee ID</label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Pay Period Month</label>
                  <input
                    type="text"
                    value={payPeriod}
                    onChange={(e) => setPayPeriod(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Client / Company Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
                />
                <textarea
                  rows={2}
                  placeholder="Client Billing Address..."
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
            )}
          </div>

          {/* Line items or Salary Breakdown */}
          {docType === 'payslip' ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Earnings & Deductions</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <span className="font-bold text-emerald-600 block">Earnings</span>
                  <div>
                    <label className="text-[11px] text-slate-500">Basic Salary</label>
                    <input
                      type="number"
                      value={basicSalary}
                      onChange={(e) => setBasicSalary(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500">HRA</label>
                    <input
                      type="number"
                      value={hra}
                      onChange={(e) => setHra(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500">Special Allowance</label>
                    <input
                      type="number"
                      value={specialAllowance}
                      onChange={(e) => setSpecialAllowance(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-rose-600 block">Deductions</span>
                  <div>
                    <label className="text-[11px] text-slate-500">Provident Fund (PF)</label>
                    <input
                      type="number"
                      value={providentFund}
                      onChange={(e) => setProvidentFund(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500">Income Tax (TDS)</label>
                    <input
                      type="number"
                      value={taxDeduction}
                      onChange={(e) => setTaxDeduction(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Line Items</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="px-3 py-1.5 rounded-xl font-semibold text-xs bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Row</span>
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Item description..."
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))}
                          className="w-full mt-0.5 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">Rate (₹):</span>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                          className="w-full mt-0.5 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">GST %:</span>
                        <input
                          type="number"
                          value={item.taxPercent}
                          onChange={(e) => updateItem(item.id, 'taxPercent', Number(e.target.value))}
                          className="w-full mt-0.5 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Printable A4 Document Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between print:hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live A4 Document Preview
            </span>
            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>

          {/* Document Sheet */}
          <div
            ref={previewCardRef}
            className="bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-10 font-sans text-xs space-y-6 min-h-[640px] print:shadow-none print:border-none print:p-0 print:m-0"
          >
            {/* Header */}
            <div className="flex justify-between items-start gap-4 border-b border-slate-200 pb-6">
              <div className="space-y-1">
                {logoUrl && <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain mb-2" />}
                <h2 className="text-lg font-black text-slate-900">{companyName}</h2>
                <p className="text-slate-500 text-[11px] max-w-xs">{companyAddress}</p>
                <p className="text-slate-600 text-[11px] font-mono">{companyTaxId}</p>
              </div>

              <div className="text-right space-y-1">
                <h1 className="text-xl font-black uppercase text-indigo-700 tracking-wider">
                  {docType === 'payslip'
                    ? 'Salary Payslip'
                    : docType === 'quotation'
                    ? 'Quotation'
                    : docType === 'receipt'
                    ? 'Payment Receipt'
                    : 'Tax Invoice'}
                </h1>
                <p className="font-mono font-bold text-slate-800 text-xs">#{docNumber}</p>
                <p className="text-slate-500 text-[11px]">Date: {docDate}</p>
                {docType !== 'payslip' && <p className="text-slate-500 text-[11px]">Due: {dueDate}</p>}
              </div>
            </div>

            {/* Recipient / Employee */}
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {docType === 'payslip' ? 'Employee Information' : 'Bill To'}
              </span>
              <p className="font-bold text-slate-900 text-sm">{clientName}</p>
              {docType === 'payslip' ? (
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mt-2 font-mono">
                  <span>ID: {employeeId}</span>
                  <span>Role: {designation}</span>
                  <span>Month: {payPeriod}</span>
                  <span>Bank: {bankAccount}</span>
                </div>
              ) : (
                <>
                  <p className="text-slate-500 text-[11px] whitespace-pre-line mt-0.5">{clientAddress}</p>
                  <p className="text-slate-600 text-[11px] font-mono mt-1">{clientTaxId}</p>
                </>
              )}
            </div>

            {/* Content Table */}
            {docType === 'payslip' ? (
              <div className="space-y-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 font-bold text-slate-700">
                      <th className="py-2">Earnings</th>
                      <th className="py-2 text-right">Amount (₹)</th>
                      <th className="py-2 pl-4">Deductions</th>
                      <th className="py-2 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    <tr>
                      <td className="py-1.5">Basic Salary</td>
                      <td className="py-1.5 text-right">₹{formatCurr(basicSalary)}</td>
                      <td className="py-1.5 pl-4">Provident Fund</td>
                      <td className="py-1.5 text-right">₹{formatCurr(providentFund)}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5">House Rent Allowance</td>
                      <td className="py-1.5 text-right">₹{formatCurr(hra)}</td>
                      <td className="py-1.5 pl-4">Income Tax (TDS)</td>
                      <td className="py-1.5 text-right">₹{formatCurr(taxDeduction)}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5">Special Allowance</td>
                      <td className="py-1.5 text-right">₹{formatCurr(specialAllowance)}</td>
                      <td className="py-1.5 pl-4">-</td>
                      <td className="py-1.5 text-right">-</td>
                    </tr>
                    <tr className="font-bold border-t border-slate-300">
                      <td className="py-2">Total Earnings</td>
                      <td className="py-2 text-right text-emerald-700">₹{formatCurr(payslipTotals.totalEarnings)}</td>
                      <td className="py-2 pl-4">Total Deductions</td>
                      <td className="py-2 text-right text-rose-700">₹{formatCurr(payslipTotals.totalDeductions)}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-sm">Net Take-Home Salary:</span>
                  <span className="font-black text-lg font-mono text-indigo-700">
                    ₹{formatCurr(payslipTotals.netSalary)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-slate-200 font-bold text-slate-700">
                      <th className="py-2">Description</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Rate</th>
                      <th className="py-2 text-right">Tax</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {items.map((item) => {
                      const lineSub = item.qty * item.rate;
                      const lineTax = (lineSub * item.taxPercent) / 100;
                      return (
                        <tr key={item.id}>
                          <td className="py-2 font-sans font-medium text-slate-900">{item.description}</td>
                          <td className="py-2 text-center">{item.qty}</td>
                          <td className="py-2 text-right">₹{formatCurr(item.rate)}</td>
                          <td className="py-2 text-right">{item.taxPercent}%</td>
                          <td className="py-2 text-right font-bold">₹{formatCurr(lineSub + lineTax)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="flex justify-end pt-4 border-t border-slate-200">
                  <div className="w-64 space-y-2 text-right font-mono text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span>₹{formatCurr(invoiceTotals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Total Tax (GST):</span>
                      <span>₹{formatCurr(invoiceTotals.totalTax)}</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-indigo-700 border-t border-slate-300 pt-2">
                      <span>Grand Total:</span>
                      <span>₹{formatCurr(invoiceTotals.grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes & Sign */}
            <div className="pt-8 border-t border-slate-200 flex justify-between items-end">
              <div className="max-w-xs text-[10px] text-slate-500">
                <span className="font-bold text-slate-700 block mb-0.5">Terms & Notes:</span>
                <p>{notes}</p>
              </div>

              <div className="text-center">
                <div className="w-36 border-b border-slate-400 mb-1" />
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Authorized Signatory</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
