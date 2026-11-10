import { ToolDefinition } from '@/types/tools';

export const BUSINESS_TOOLS: ToolDefinition[] = [
  {
    id: 'payslip-generator',
    name: 'Salary Payslip Generator',
    slug: 'payslip-generator',
    category: 'business',
    subcategory: 'HR & Payroll',
    shortDescription: 'Create professional salary slips with earnings, deductions, and print-ready PDF export.',
    fullDescription: 'Generate compliant salary payslips for employees and contractors. Enter company details, employee name and designation, bank accounts, earnings (Basic, HRA, Conveyance, Special Allowance), and deductions (Provident Fund, Professional Tax, TDS). Features automatic net pay calculation, amount in words conversion, company logo uploads, and clean A4 print/PDF downloads.',
    searchKeywords: ['payslip generator', 'salary slip maker', 'free payslip online', 'salary slip generator with logo', 'download salary slip pdf', 'employee pay slip'],
    icon: 'FileText',
    supportedInputFormats: ['Form Input', 'Company Logo (.png, .jpg)'],
    supportedOutputFormats: ['Printable A4 Payslip', '.pdf'],
    processingEngine: 'Browser Layout Engine with Print Vector PDF Generator',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Enter Employer & Employee Info',
        description: 'Provide company name, employee designation, ID number, and pay period month.'
      },
      {
        step: 2,
        title: 'Add Earnings & Allowances',
        description: 'Fill in Basic Salary, House Rent Allowance (HRA), Medical Allowance, and bonuses.'
      },
      {
        step: 3,
        title: 'Specify Deductions',
        description: 'Enter statutory deductions such as Provident Fund (PF), Income Tax (TDS), and loan repayments.'
      },
      {
        step: 4,
        title: 'Print or Download PDF',
        description: 'Preview the formatted A4 salary slip and print or save directly as a clean PDF.'
      }
    ],
    faqs: [
      {
        question: 'Is my payroll data saved on any external database?',
        answer: 'No! All employee and payroll information is generated purely in your browser memory and disappears when you close or reload the tab.'
      },
      {
        question: 'Can I add my business logo to the salary slip?',
        answer: 'Yes! Upload your PNG or JPG logo and it will be embedded into the header of the payslip.'
      }
    ],
    relatedToolSlugs: ['invoice-generator', 'quotation-generator', 'income-expense-tracker'],
    seoTitle: 'Free Salary Payslip Generator Online - Professional Payroll Slips | Vivexa Tools',
    seoDescription: 'Generate professional employee salary payslips with earnings, deductions, net pay in words, and company logo. Download printable PDF.'
  },
  {
    id: 'invoice-generator',
    name: 'Invoice Generator',
    slug: 'invoice-generator',
    category: 'business',
    subcategory: 'Invoicing & Billing',
    shortDescription: 'Generate professional GST-compliant business invoices with customizable line items and PDF export.',
    fullDescription: 'Create beautiful, GST-compliant invoices for clients and customers. Add company branding and logos, customer billing details, invoice and due dates, unlimited line items with quantity, unit rate, and tax rates, discounts, payment terms, and bank details. Exports directly to print-ready A4 PDF format without accounts or watermarks.',
    searchKeywords: ['invoice generator', 'free invoice maker', 'gst invoice generator', 'billing invoice online', 'download invoice pdf', 'freelance invoice'],
    icon: 'Receipt',
    supportedInputFormats: ['Form Input', 'Logo Image'],
    supportedOutputFormats: ['Printable A4 Invoice', '.pdf'],
    processingEngine: 'Dynamic Document Formatting & Print Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Enter Business and Client Details',
        description: 'Add your business name, address, GSTIN/tax number, and your client\'s billing address.'
      },
      {
        step: 2,
        title: 'Add Items and Pricing',
        description: 'Enter product or service line items with quantity, unit rates, and applicable tax percentages.'
      },
      {
        step: 3,
        title: 'Specify Payment Details & Notes',
        description: 'Add your bank account details, UPI ID, payment terms, and thank-you notes.'
      },
      {
        step: 4,
        title: 'Save and Download PDF',
        description: 'Review the high-definition invoice preview and print or save as a professional PDF.'
      }
    ],
    faqs: [
      {
        question: 'Does the invoice include GST / Tax breakdown?',
        answer: 'Yes! It calculates subtotal, tax amounts per item, total tax, and final grand total automatically.'
      },
      {
        question: 'Are there any Vivexa watermarks on the invoice?',
        answer: 'No. Generated invoices are completely clean, professional, and unwatermarked.'
      }
    ],
    relatedToolSlugs: ['quotation-generator', 'receipt-generator', 'gst-calculator'],
    seoTitle: 'Free Invoice Generator Online - Professional GST & Business Invoices | Vivexa Tools',
    seoDescription: 'Create and download professional business invoices online. Custom line items, GST tax calculations, logo support, and printable PDF export.'
  },
  {
    id: 'quotation-generator',
    name: 'Quotation / Estimate Generator',
    slug: 'quotation-generator',
    category: 'business',
    subcategory: 'Receipts & Quotes',
    shortDescription: 'Create professional price quotations and project cost estimates for clients.',
    fullDescription: 'Build formal project proposals and price quotations for potential clients. Outline project scope, deliverable breakdown, itemized rates, validity periods, milestone terms, and business contact information. Export clean, trustworthy PDF quotations that win projects.',
    searchKeywords: ['quotation generator', 'price estimate maker', 'project estimate generator', 'freelance quote maker', 'quotation pdf'],
    icon: 'FileText',
    supportedInputFormats: ['Form Input', 'Logo Image'],
    supportedOutputFormats: ['Printable A4 Quotation', '.pdf'],
    processingEngine: 'Browser Estimate & Quotation Layout Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Fill Business and Client Details',
        description: 'Provide your company identity, quotation reference number, and client information.'
      },
      {
        step: 2,
        title: 'Add Project Deliverables',
        description: 'List project phases, hourly rates, materials, or fixed cost deliverables with quantities.'
      },
      {
        step: 3,
        title: 'Define Validity & Scope Terms',
        description: 'Specify quotation expiration date (e.g. valid for 30 days) and project revision policies.'
      },
      {
        step: 4,
        title: 'Generate PDF Quotation',
        description: 'Export a professional PDF quote to send to your prospective client via email or WhatsApp.'
      }
    ],
    faqs: [
      {
        question: 'Can I convert a quotation to an invoice later?',
        answer: 'Yes! You can copy the itemized deliverables directly into our Invoice Generator when the client approves.'
      },
      {
        question: 'Can I include terms and conditions?',
        answer: 'Yes! A dedicated section allows you to clearly outline payment milestones, validity, and scope boundaries.'
      }
    ],
    relatedToolSlugs: ['invoice-generator', 'receipt-generator', 'gst-calculator'],
    seoTitle: 'Free Quotation Generator Online - Professional Price Estimates | Vivexa Tools',
    seoDescription: 'Create professional project estimates and price quotations for clients. Itemized pricing, validity dates, terms, and clean PDF export.'
  },
  {
    id: 'receipt-generator',
    name: 'Payment Receipt Generator',
    slug: 'receipt-generator',
    category: 'business',
    subcategory: 'Receipts & Quotes',
    shortDescription: 'Create payment receipts, rent receipts, and transaction vouchers with instant PDF download.',
    fullDescription: 'Generate official payment receipts and house rent receipts for cash, bank transfers, UPI, or card payments. Includes receipt number, payment date, payer name, amount in numbers and words, payment mode, purpose of payment, and digital signature lines.',
    searchKeywords: ['receipt generator', 'payment receipt maker', 'rent receipt generator', 'cash receipt online', 'receipt voucher pdf'],
    icon: 'Receipt',
    supportedInputFormats: ['Form Input', 'Signatures'],
    supportedOutputFormats: ['Printable Receipt Voucher', '.pdf'],
    processingEngine: 'Transaction Receipt & Voucher Layout Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Enter Receipt Details',
        description: 'Specify Receipt Number, Date, Received From (payer), and Received By (payee).'
      },
      {
        step: 2,
        title: 'Enter Payment Amount',
        description: 'Input the received sum; the amount in words generates automatically.'
      },
      {
        step: 3,
        title: 'Select Payment Method & Purpose',
        description: 'Select Cash, UPI, Cheque, or Bank Transfer, and mention purpose (e.g. Monthly Rent, Consulting Fee).'
      },
      {
        step: 4,
        title: 'Print or Save Receipt',
        description: 'Download the receipt as a formatted PDF voucher or print for accounting records.'
      }
    ],
    faqs: [
      {
        question: 'Can I use this for House Rent Allowance (HRA) tax exemption receipts?',
        answer: 'Yes! Fill in landlord name, address, tenant name, monthly rent amount, and PAN number to generate valid rent receipts for HR submission.'
      },
      {
        question: 'Is there support for cash voucher format?',
        answer: 'Yes, it formats cleanly as either a single payment receipt or an official cash payment voucher.'
      }
    ],
    relatedToolSlugs: ['invoice-generator', 'payslip-generator', 'gst-calculator'],
    seoTitle: 'Free Receipt Generator Online - Payment & Rent Receipts | Vivexa Tools',
    seoDescription: 'Generate professional payment receipts and house rent receipts online. Automatic amount in words, payment methods, and printable PDF download.'
  },
  {
    id: 'income-expense-tracker',
    name: 'Income & Expense Tracker',
    slug: 'income-expense-tracker',
    category: 'business',
    subcategory: 'Expense Tracking',
    shortDescription: 'Track daily earnings, expenses, monthly budgets, and cash flow privately in your browser.',
    fullDescription: 'A private personal and business money management tool. Log income and expense transactions, categorize spending (Food, Housing, Travel, Client Income, Subscriptions), view net balance and savings rates, filter by date ranges, and export your transaction ledger to CSV with 100% offline localStorage privacy.',
    searchKeywords: ['income expense tracker', 'expense manager', 'budget tracker', 'personal finance online', 'cash flow tracker', 'offline expense tracker'],
    icon: 'Wallet',
    supportedInputFormats: ['Transaction Forms', 'Category Tags'],
    supportedOutputFormats: ['Cash Flow Dashboard', 'Spreadsheet .csv'],
    processingEngine: 'Client-Side LocalStorage Cashflow Analytics Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Add Income or Expense',
        description: 'Click "+ Add Transaction", enter the amount, select category, and add an optional note.'
      },
      {
        step: 2,
        title: 'Review Financial Dashboard',
        description: 'Monitor your total income, total spending, net savings, and category distribution charts.'
      },
      {
        step: 3,
        title: 'Search and Filter',
        description: 'Filter entries by Income, Expense, category, or search specific note keywords.'
      },
      {
        step: 4,
        title: 'Export to CSV',
        description: 'Download your complete transaction ledger as a standard CSV file for Excel or Google Sheets.'
      }
    ],
    faqs: [
      {
        question: 'Where is my financial transaction data stored?',
        answer: 'Data is stored exclusively inside your browser\'s private localStorage. Nobody else—not even Vivexa Tools—can access or see your finances.'
      },
      {
        question: 'Will my entries be lost if I close the browser?',
        answer: 'No. Browser localStorage persists your entries across reloads and visits on the same device and browser.'
      }
    ],
    relatedToolSlugs: ['emi-calculator', 'invoice-generator', 'gst-calculator'],
    seoTitle: 'Free Income & Expense Tracker Online - Private Budget & Cash Flow | Vivexa Tools',
    seoDescription: 'Track daily income and expenses privately in your browser. Real-time cash flow summaries, category charts, and CSV spreadsheet export.'
  }
];
