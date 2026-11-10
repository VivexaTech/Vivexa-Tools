import { ToolDefinition } from '@/types/tools';

export const CALCULATOR_TOOLS: ToolDefinition[] = [
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    slug: 'age-calculator',
    category: 'calculator',
    subcategory: 'Age & Time',
    shortDescription: 'Calculate your exact chronological age in years, months, days, hours, and seconds.',
    fullDescription: 'Accurately determine chronological age from any date of birth with precise handling of leap years and variable month days. Features real-time live ticking age in seconds, total days lived, days remaining until your next birthday, and Western and Chinese zodiac signs.',
    searchKeywords: ['age calculator', 'calculate age', 'date of birth calculator', 'chronological age', 'birthday countdown', 'days lived'],
    icon: 'Calendar',
    supportedInputFormats: ['Date Picker', 'Date Strings'],
    supportedOutputFormats: ['Detailed Age Breakdown', 'Summary Text'],
    processingEngine: 'High-Precision Chronological Calendar Math Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Enter Date of Birth',
        description: 'Select your birth day, month, and year from the interactive calendar.'
      },
      {
        step: 2,
        title: 'Choose Target Date (Optional)',
        description: 'Leave as today to calculate current age, or select a past/future milestone date.'
      },
      {
        step: 3,
        title: 'View Comprehensive Age Breakdown',
        description: 'See your age in years, months, and days, along with a live ticking second counter.'
      },
      {
        step: 4,
        title: 'Explore Milestones',
        description: 'Check total days, hours, and minutes lived, plus the countdown to your next birthday.'
      }
    ],
    faqs: [
      {
        question: 'Does this calculator properly calculate leap years?',
        answer: 'Yes! It accounts for every leap day (February 29) according to Gregorian calendar rules.'
      },
      {
        question: 'Can I calculate age as of a specific date in the past?',
        answer: 'Yes! Simply toggle the "Calculate Age As Of" date to any past or future date.'
      }
    ],
    relatedToolSlugs: ['emi-calculator', 'gst-calculator', 'cgpa-to-percentage'],
    seoTitle: 'Free Age Calculator Online - Exact Years, Months, Days & Seconds | Vivexa Tools',
    seoDescription: 'Calculate your exact chronological age down to the second. Accurate leap year handling, next birthday countdown, and total days lived.'
  },
  {
    id: 'emi-calculator',
    name: 'EMI Calculator',
    slug: 'emi-calculator',
    category: 'calculator',
    subcategory: 'Financial',
    shortDescription: 'Calculate monthly loan EMI, total interest, and interactive amortization schedule.',
    fullDescription: 'Comprehensive Equated Monthly Installment (EMI) calculator for home loans, car loans, education loans, and personal loans. Computes monthly payment amounts, total interest payable, loan repayment breakdown charts, and a complete month-by-month and year-by-year amortization schedule with CSV export.',
    searchKeywords: ['emi calculator', 'loan calculator', 'home loan emi', 'car loan calculator', 'amortization schedule', 'interest calculator'],
    icon: 'DollarSign',
    supportedInputFormats: ['Loan Amount', 'Interest Rate', 'Tenure'],
    supportedOutputFormats: ['EMI Breakdown', 'Amortization Table', '.csv'],
    processingEngine: 'Standard Compounded Equated Monthly Installment Math Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Enter Loan Principal',
        description: 'Type or drag the slider for your total loan amount (e.g. ₹10,00,000 or $50,000).'
      },
      {
        step: 2,
        title: 'Enter Annual Interest Rate',
        description: 'Input the annual interest rate percentage charged by the bank or lender.'
      },
      {
        step: 3,
        title: 'Set Loan Tenure',
        description: 'Select loan duration in years or months to instantly see the recalculated monthly EMI.'
      },
      {
        step: 4,
        title: 'Review Breakdown & Schedule',
        description: 'Analyze principal vs interest distribution and export the complete repayment schedule to CSV.'
      }
    ],
    faqs: [
      {
        question: 'What is the formula used for EMI calculation?',
        answer: 'The standard reducing balance formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1], where P is Principal, R is monthly interest rate, and N is the number of monthly installments.'
      },
      {
        question: 'Can I use this for both Home and Car loans?',
        answer: 'Yes! It works universally for home loans, personal loans, vehicle loans, and business loans.'
      }
    ],
    relatedToolSlugs: ['gst-calculator', 'income-expense-tracker', 'age-calculator'],
    seoTitle: 'Free EMI Calculator Online - Home & Car Loan EMI with Amortization | Vivexa Tools',
    seoDescription: 'Calculate monthly loan EMI, total interest payable, and full amortization schedule for home, car, and personal loans. Export to CSV.'
  },
  {
    id: 'gst-calculator',
    name: 'GST Calculator',
    slug: 'gst-calculator',
    category: 'calculator',
    subcategory: 'Tax & GST',
    shortDescription: 'Calculate GST inclusive and exclusive amounts with CGST, SGST, and IGST breakdowns.',
    fullDescription: 'Accurate Goods and Services Tax (GST) calculator for business owners, accountants, freelancers, and shoppers. Easily switch between "GST Exclusive" (adding GST to base price) and "GST Inclusive" (extracting GST from gross amount). Provides 0%, 5%, 12%, 18%, 28%, and custom rates with exact CGST/SGST 50/50 split and IGST interstate calculations.',
    searchKeywords: ['gst calculator', 'calculate gst', 'reverse gst', 'cgst sgst calculator', 'gst inclusive', 'gst exclusive'],
    icon: 'Percent',
    supportedInputFormats: ['Amount', 'GST Slab %'],
    supportedOutputFormats: ['Tax Summary', 'Copy Breakdown'],
    processingEngine: 'Precision Financial Tax Calculation Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Choose Calculation Mode',
        description: 'Select "Add GST" (Exclusive) to calculate tax on base price, or "Remove GST" (Inclusive) to find net price before tax.'
      },
      {
        step: 2,
        title: 'Enter Amount',
        description: 'Input the net price or gross invoice total.'
      },
      {
        step: 3,
        title: 'Select GST Slab',
        description: 'Click standard tax slabs (0%, 5%, 12%, 18%, 28%) or type a custom tax percentage.'
      },
      {
        step: 4,
        title: 'View CGST/SGST/IGST Split',
        description: 'Check the exact split between Central GST (50%), State GST (50%), and Total GST, and copy the summary.'
      }
    ],
    faqs: [
      {
        question: 'What is the difference between GST Inclusive and Exclusive?',
        answer: 'GST Exclusive means the tax has not yet been added to the base amount. GST Inclusive means the entered price already contains the tax, and the tool extracts the original base value.'
      },
      {
        question: 'How are CGST and SGST divided?',
        answer: 'For intra-state transactions, GST is divided equally: 50% CGST to Central Government and 50% SGST to State Government. For inter-state sales, 100% IGST is applied.'
      }
    ],
    relatedToolSlugs: ['invoice-generator', 'receipt-generator', 'emi-calculator'],
    seoTitle: 'Free GST Calculator Online - Add or Remove GST with CGST & SGST | Vivexa Tools',
    seoDescription: 'Calculate GST inclusive and exclusive amounts online. Instant CGST, SGST, and IGST breakdowns with standard 5%, 12%, 18%, and 28% tax slabs.'
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    slug: 'unit-converter',
    category: 'calculator',
    subcategory: 'Unit Conversion',
    shortDescription: 'Convert between Length, Weight, Temperature, Area, Volume, Speed, Time, and Data Storage.',
    fullDescription: 'Fast, multi-category unit converter for scientific, educational, and everyday measurements. Seamlessly convert between metric and imperial systems across length (m, km, cm, mm, ft, in, miles), mass/weight (kg, g, lbs, oz), temperature (°C, °F, K), area, volume, speed, time, and computer storage (Bytes, KB, MB, GB, TB).',
    searchKeywords: ['unit converter', 'convert units', 'metric to imperial', 'kg to lbs', 'cm to inches', 'celsius to fahrenheit', 'data storage converter'],
    icon: 'Scale',
    supportedInputFormats: ['Numbers', 'Unit Types'],
    supportedOutputFormats: ['Converted Value', 'Formula Explanation'],
    processingEngine: 'High-Precision Standard Unit Conversion Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Select Conversion Category',
        description: 'Choose Length, Weight/Mass, Temperature, Area, Volume, Speed, Time, or Data Storage.'
      },
      {
        step: 2,
        title: 'Pick From and To Units',
        description: 'Select your starting unit and desired target unit from the dropdown lists.'
      },
      {
        step: 3,
        title: 'Enter Amount',
        description: 'Type the value to be converted; results update instantaneously with full decimal precision.'
      },
      {
        step: 4,
        title: 'Copy or Swap',
        description: 'Use the swap button to invert units, or copy the final converted number directly.'
      }
    ],
    faqs: [
      {
        question: 'Does this converter use binary or decimal data storage units?',
        answer: 'It supports standard decimal storage (1 KB = 1000 Bytes) and binary kibibyte calculations (1 KiB = 1024 Bytes) with high accuracy.'
      },
      {
        question: 'Can I convert negative temperatures?',
        answer: 'Yes! Negative temperatures in Celsius and Fahrenheit are fully supported down to absolute zero.'
      }
    ],
    relatedToolSlugs: ['currency-converter', 'age-calculator', 'cgpa-to-percentage'],
    seoTitle: 'Free Universal Unit Converter Online - Length, Weight, Temp & Data | Vivexa Tools',
    seoDescription: 'Convert between units across length, weight, temperature, area, volume, speed, and digital storage. Fast, accurate, and completely free.'
  },
  {
    id: 'currency-converter',
    name: 'Currency Converter',
    slug: 'currency-converter',
    category: 'calculator',
    subcategory: 'Currency',
    shortDescription: 'Convert world currencies with benchmark exchange rates and custom rate overrides.',
    fullDescription: 'Convert values between major world currencies including INR, USD, EUR, GBP, AED, CAD, AUD, JPY, SGD, and CHF. Includes trusted benchmark conversion rates, transparent last updated disclosures, quick currency swap, a comparison matrix against top world currencies, and custom rate override capabilities.',
    searchKeywords: ['currency converter', 'convert usd to inr', 'exchange rates', 'forex converter', 'eur to usd', 'currency exchange'],
    icon: 'Coins',
    supportedInputFormats: ['Currency Pairs', 'Amounts'],
    supportedOutputFormats: ['Converted Currency', 'Conversion Table'],
    processingEngine: 'Forex Ratio Math Engine with Custom Benchmark Overrides',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Choose Base and Target Currencies',
        description: 'Select your source currency (e.g. USD) and destination currency (e.g. INR).'
      },
      {
        step: 2,
        title: 'Enter Amount',
        description: 'Type any quantity to instantly compute the converted currency value.'
      },
      {
        step: 3,
        title: 'Adjust Exchange Rate (Optional)',
        description: 'Use the benchmark rate or type your bank\'s exact live forex rate to calculate precise totals.'
      },
      {
        step: 4,
        title: 'View Comparison Matrix',
        description: 'Inspect the comparison table showing how your base amount converts across all major global currencies.'
      }
    ],
    faqs: [
      {
        question: 'Can I enter my bank\'s specific card markup rate?',
        answer: 'Yes! Click "Customize Rate" to input any custom exchange rate or forex fee.'
      },
      {
        question: 'Does this converter require an internet connection?',
        answer: 'The converter includes built-in benchmark exchange rates that work 100% offline in your browser.'
      }
    ],
    relatedToolSlugs: ['unit-converter', 'gst-calculator', 'emi-calculator'],
    seoTitle: 'Free Currency Converter Online - Real-Time Exchange Rates | Vivexa Tools',
    seoDescription: 'Convert currencies between USD, INR, EUR, GBP, AED, and more. Benchmark rates, custom rate overrides, and instant multi-currency comparison table.'
  }
];
