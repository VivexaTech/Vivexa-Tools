import { ToolDefinition } from '@/types/tools';

export const STUDENT_TOOLS: ToolDefinition[] = [
  {
    id: 'cgpa-to-percentage',
    name: 'CGPA to Percentage Calculator',
    slug: 'cgpa-to-percentage',
    category: 'student',
    subcategory: 'Grade Conversion',
    shortDescription: 'Convert CGPA scores to equivalent percentage marks using university formulas.',
    fullDescription: 'Convert your Cumulative Grade Point Average (CGPA) on a 10-point scale into accurate percentage marks. Supports the standard CBSE / AICTE 9.5 multiplier, Mumbai University formula, VTU, and custom conversion formulas, with an interactive semester-wise SGPA calculator and credit weighting.',
    searchKeywords: ['cgpa to percentage', 'convert cgpa to marks', 'cbse cgpa to percentage', 'aicte cgpa formula', 'gpa converter', 'percentage calculator'],
    icon: 'GraduationCap',
    supportedInputFormats: ['CGPA (10-point)', 'Semester SGPA & Credits'],
    supportedOutputFormats: ['Percentage %', 'Equivalent Grade Division'],
    processingEngine: 'Academic Grading Formula Calculation Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Choose University Formula',
        description: 'Select CBSE/AICTE (CGPA × 9.5), Mumbai University, VTU, or enter a custom multiplier.'
      },
      {
        step: 2,
        title: 'Enter CGPA Score',
        description: 'Input your 10-point CGPA (e.g. 8.4) or switch to Semester Mode to compute weighted average.'
      },
      {
        step: 3,
        title: 'View Equivalent Percentage',
        description: 'The tool calculates your exact percentage and classifies your academic division (First Class with Distinction, First Class, etc.).'
      },
      {
        step: 4,
        title: 'Copy or Share',
        description: 'Copy your verified calculation breakdown to include in resume or college applications.'
      }
    ],
    faqs: [
      {
        question: 'Why does CBSE multiply CGPA by 9.5?',
        answer: 'CBSE derived the 9.5 multiplier by analyzing the performance of the top candidates over multiple board examinations to calculate the average mark represented by each grade point.'
      },
      {
        question: 'Can I calculate overall CGPA from individual semesters?',
        answer: 'Yes! Toggle "Semester Breakdown" to enter your SGPA and credit hours for all 8 semesters.'
      }
    ],
    relatedToolSlugs: ['percentage-to-cgpa', 'typing-speed-test', 'resume-generator'],
    seoTitle: 'Free CGPA to Percentage Calculator Online - CBSE, AICTE & Engineering | Vivexa Tools',
    seoDescription: 'Convert 10-point CGPA to percentage using CBSE, AICTE, and university formulas. Accurate academic division calculation with semester GPA support.'
  },
  {
    id: 'percentage-to-cgpa',
    name: 'Percentage to CGPA Calculator',
    slug: 'percentage-to-cgpa',
    category: 'student',
    subcategory: 'Grade Conversion',
    shortDescription: 'Convert percentage marks to equivalent 10-point CGPA and 4.0 GPA scales.',
    fullDescription: 'Convert your academic percentage into a 10-point scale CGPA or 4.0 US GPA for international university admissions, job portals, and scholarship applications. Supports standard CBSE reverse formulas (% ÷ 9.5) and international grading scale conversions.',
    searchKeywords: ['percentage to cgpa', 'convert percentage to gpa', 'marks to cgpa', 'percentage to 4.0 gpa', 'cbse marks to cgpa'],
    icon: 'GraduationCap',
    supportedInputFormats: ['Percentage %', 'Marks Obtained / Total Marks'],
    supportedOutputFormats: ['10-Point CGPA', '4.0 US GPA Scale', 'Letter Grade'],
    processingEngine: 'Reverse Academic Scale Normalization Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Enter Percentage or Marks',
        description: 'Type your overall percentage mark (e.g. 82.5%) or enter total marks obtained.'
      },
      {
        step: 2,
        title: 'Select Conversion Standard',
        description: 'Choose standard 10-point scale (% ÷ 9.5) or 4.0 US Grade Point Average scale.'
      },
      {
        step: 3,
        title: 'Inspect Equivalent GPA',
        description: 'View your converted CGPA, 4.0 GPA equivalent, and corresponding letter grade (A+, A, B).'
      },
      {
        step: 4,
        title: 'Copy or Save',
        description: 'Copy the calculation summary for college applications and job portals.'
      }
    ],
    faqs: [
      {
        question: 'How is percentage converted back to CGPA?',
        answer: 'For standard CBSE/AICTE, Percentage divided by 9.5 yields your 10-point CGPA. For example, 76% ÷ 9.5 = 8.0 CGPA.'
      },
      {
        question: 'Does this calculate 4.0 GPA for US universities?',
        answer: 'Yes! It provides an estimated 4.0 scale GPA based on standard WES international grade conversion benchmarks.'
      }
    ],
    relatedToolSlugs: ['cgpa-to-percentage', 'typing-speed-test', 'resume-generator'],
    seoTitle: 'Free Percentage to CGPA Calculator Online - 10-Point & 4.0 Scale | Vivexa Tools',
    seoDescription: 'Convert your percentage marks to 10-point CGPA and 4.0 US GPA scales. Ideal for international college applications and job portals.'
  },
  {
    id: 'typing-speed-test',
    name: 'Typing Speed Test',
    slug: 'typing-speed-test',
    category: 'student',
    subcategory: 'Typing Practice',
    shortDescription: 'Measure your typing speed (WPM) and accuracy with real-time feedback and passages.',
    fullDescription: 'Test and improve your keyboard typing speed with interactive typing challenges. Select 30-second, 60-second, or 2-minute timed tests across easy, medium, and advanced difficulty passages. Measures gross and net Words Per Minute (WPM), accuracy percentage, keystroke cadence, and error counts with paste prevention for genuine results.',
    searchKeywords: ['typing speed test', 'typing test wpm', 'keyboard speed test', 'check typing speed', 'words per minute test', 'typing test online'],
    icon: 'Keyboard',
    supportedInputFormats: ['Keyboard Keystroke Events'],
    supportedOutputFormats: ['WPM Score', 'Accuracy %', 'Error Diagnostics'],
    processingEngine: 'High-Resolution Keystroke Cadence Timing Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Select Test Duration and Difficulty',
        description: 'Choose 30 seconds, 60 seconds, or 120 seconds, and select easy, medium, or coding text.'
      },
      {
        step: 2,
        title: 'Start Typing the Passage',
        description: 'Click into the typing box and begin typing. The timer starts automatically on your first keystroke.'
      },
      {
        step: 3,
        title: 'Monitor Live Accuracy',
        description: 'Correct letters highlight in green, errors highlight in red, and live WPM updates in real-time.'
      },
      {
        step: 4,
        title: 'Analyze Scorecard',
        description: 'Review your gross WPM, net WPM, accuracy percentage, and total errors, or restart to beat your high score.'
      }
    ],
    faqs: [
      {
        question: 'What is considered a good typing speed?',
        answer: 'The average typing speed is about 40 WPM. Professional typists and programmers typically type between 65 to 90+ WPM with 95%+ accuracy.'
      },
      {
        question: 'Can I paste text into the typing box?',
        answer: 'No. Copy and paste are disabled to guarantee an honest and accurate evaluation of your typing ability.'
      }
    ],
    relatedToolSlugs: ['cgpa-to-percentage', 'resume-generator', 'speech-to-text'],
    seoTitle: 'Free Typing Speed Test Online - WPM & Accuracy Checker | Vivexa Tools',
    seoDescription: 'Test your typing speed and accuracy in WPM with timed 1-minute and 2-minute challenges. Real-time feedback, detailed scorecards, and no registration required.'
  }
];
