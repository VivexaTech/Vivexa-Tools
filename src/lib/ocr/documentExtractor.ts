/**
 * Professional Document Detail Extractor Engine
 * 100% Client-Side In-Memory Processing. Zero Server Storage. Zero Analytics on Data.
 * Advanced Spatial Layout Awareness & Multi-Pass Recognition.
 */
import jsQR from 'jsqr';

export type DocumentCategoryType = 'pan' | 'aadhaar' | 'voter_id' | 'general';
export type DocumentType = 'pan' | 'aadhaar' | 'voter_id' | 'driving_licence' | 'general';
export type ConfidenceRating = 'high' | 'medium' | 'low' | 'needs_review' | 'unverified';

export type FieldKey =
  | 'name'
  | 'nameHindi'
  | 'fatherName'
  | 'fatherNameHindi'
  | 'documentNumber'
  | 'dob'
  | 'gender'
  | 'issueDate'
  | 'expiryDate'
  | 'address'
  | 'addressHindi'
  | 'houseNumber'
  | 'street'
  | 'locality'
  | 'villageTownCity'
  | 'postOffice'
  | 'district'
  | 'state'
  | 'pinCode'
  | 'relativeName'
  | 'relativeNameHindi'
  | 'relationType';

export interface OcrBbox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface OcrWordItem {
  text: string;
  confidence: number;
  bbox: OcrBbox;
}

export interface OcrLineItem {
  text: string;
  confidence: number;
  bbox: OcrBbox;
  words?: OcrWordItem[];
}

export interface ExtractedField {
  key: FieldKey | string;
  label: string;
  value: string;
  hindiValue?: string;
  confidence: number; // 0 - 100%
  confidenceRating?: ConfidenceRating;
  maskedValue?: string;
  isMasked?: boolean;
  category?: 'personal' | 'identification' | 'address' | 'other';
  needsReviewNotice?: string;
}

export interface DocumentExtractionResult {
  documentType: DocumentType;
  fields: ExtractedField[];
  rawText: string;
  accuracyScore: number;
}

export interface AddressComponents {
  houseNumber?: string;
  street?: string;
  locality?: string;
  villageTownCity?: string;
  postOffice?: string;
  district?: string;
  state?: string;
  pinCode?: string;
}

export interface ExtractedImageItem {
  id: string;
  type: 'photo' | 'signature' | 'qr';
  label: string;
  dataUrl: string;
  width: number;
  height: number;
  isAdjusted?: boolean;
}

export interface QrExtractionResult {
  detected: boolean;
  qrData?: string;
  imageUrl?: string;
  verificationNotice: string;
}

export interface ComprehensiveExtractionResult {
  selectedType: DocumentCategoryType;
  detectedType: DocumentType;
  isConsistent: boolean;
  consistencyWarning?: string;
  fields: ExtractedField[];
  addressComponents?: AddressComponents;
  completeAddressEnglish?: string;
  completeAddressHindi?: string;
  images: ExtractedImageItem[];
  qrResult?: QrExtractionResult;
  rawText: string;
  overallConfidence: number;
  extractedAt: string;
}

/**
 * Mask Aadhaar number to display only the last 4 digits (e.g., "XXXX XXXX 1234")
 */
export function maskAadhaarNumber(aadhaar: string): string {
  const digits = aadhaar.replace(/\D/g, '');
  if (digits.length === 12) {
    return `XXXX XXXX ${digits.slice(8, 12)}`;
  }
  if (/[Xx*]{4}\s?[Xx*]{4}\s?\d{4}/.test(aadhaar)) {
    const last4 = aadhaar.replace(/\D/g, '').slice(-4);
    return `XXXX XXXX ${last4}`;
  }
  return aadhaar;
}

/**
 * Detect document type from raw OCR text
 */
export function detectDocumentType(text: string): DocumentType {
  const upper = text.toUpperCase();

  // PAN Check
  if (
    upper.includes('INCOME TAX') ||
    upper.includes('PERMANENT ACCOUNT') ||
    upper.includes('आयकर विभाग') ||
    /[A-Z]{5}[0-9]{4}[A-Z]/.test(upper)
  ) {
    return 'pan';
  }

  // Aadhaar Check
  if (
    upper.includes('AADHAAR') ||
    upper.includes('UNIQUE IDENTIFICATION') ||
    upper.includes('MERA AADHAAR') ||
    upper.includes('आधार') ||
    upper.includes('विशिष्ट पहचान') ||
    /\b\d{4}\s\d{4}\s\d{4}\b/.test(text) ||
    /\b[Xx*]{4}\s?[Xx*]{4}\s?\d{4}\b/.test(text)
  ) {
    return 'aadhaar';
  }

  // Voter ID Check
  if (
    upper.includes('ELECTION COMMISSION') ||
    upper.includes('ELECTORAL PHOTO') ||
    upper.includes('ELECTOR') ||
    upper.includes('भारत निर्वाचन आयोग') ||
    upper.includes('मतदाता पहचान') ||
    /\b[A-Z]{3}[0-9]{7}\b/.test(upper)
  ) {
    return 'voter_id';
  }

  // Driving Licence Check
  if (
    upper.includes('DRIVING LICENCE') ||
    upper.includes('DRIVING LICENSE') ||
    upper.includes('MOTOR VEHICLES') ||
    upper.includes('TRANSPORT DEPARTMENT')
  ) {
    return 'driving_licence';
  }

  return 'general';
}

/**
 * Validate document consistency without auto-switching
 */
export function validateDocumentConsistency(
  selectedType: DocumentCategoryType,
  rawText: string
): { isConsistent: boolean; detectedType: DocumentType; warning?: string } {
  if (selectedType === 'general') {
    return { isConsistent: true, detectedType: 'general' };
  }

  const detected = detectDocumentType(rawText);

  if (detected === 'general') {
    return { isConsistent: true, detectedType: detected };
  }

  if (detected !== selectedType) {
    const names: Record<DocumentType, string> = {
      pan: 'PAN Card',
      aadhaar: 'Aadhaar Card',
      voter_id: 'Voter ID Card',
      driving_licence: 'Driving Licence',
      general: 'Other Document',
    };
    return {
      isConsistent: false,
      detectedType: detected,
      warning: `The uploaded file appears to contain keywords matching a ${names[detected]} instead of the selected ${names[selectedType]}. Please review the fields or upload the intended document.`,
    };
  }

  return { isConsistent: true, detectedType: detected };
}

/**
 * Helper to determine confidence level rating
 */
export function getConfidenceRating(score: number): ConfidenceRating {
  if (score >= 82) return 'high';
  if (score >= 60) return 'medium';
  if (score >= 35) return 'needs_review';
  if (score > 0) return 'low';
  return 'unverified';
}

/**
 * Sanitizes candidate personal names:
 * - Strips leading non-alpha artifacts (e.g. `y )`, `No `, stray marks, bullet dots).
 * - Strips trailing punctuation, numbers or stray symbols.
 * - Filters out document headers or labels.
 */
export function cleanCandidateName(raw: string): string {
  if (!raw) return '';
  let cleaned = raw.trim();

  // Strip leading noise characters, single-letter prefixes or bullets
  cleaned = cleaned.replace(/^[yYnNoO\W\d_~|–—\\\/#]+/, '').trim();
  // Strip trailing noise
  cleaned = cleaned.replace(/[\W\d_~|–—]+$/, '').trim();

  // Strip leading 1-2 letter stray OCR artifact if followed by valid uppercase name (e.g. 'Fl RAHUL KUMAR' -> 'RAHUL KUMAR')
  cleaned = cleaned.replace(/^[A-Za-z]{1,2}\s+([A-Z]{3,}\b)/, '$1').trim();

  // Exclude known common header words if they appear as full or dominant words
  const isHeaderOnly = /^(INCOME|TAX|DEPARTMENT|GOVT|INDIA|GOVERNMENT|ACCOUNT|PERMANENT|SIGNATURE|FATHER|FATHERS|NAME|CARD|DATE|BIRTH|ELECTION|COMMISSION|UNIQUE|IDENTIFICATION|AUTHORITY|ELECTORAL|PHOTO|IDENTITY|जारी|करने|की|तिथि)$/i.test(
    cleaned
  );
  if (isHeaderOnly) return '';

  return cleaned;
}

/**
 * Convert raw text into synthetic OcrLineItem objects if detailed bounding boxes not available
 */
export function textToFallbackLines(text: string): OcrLineItem[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((t, idx) => ({
      text: t,
      confidence: 75,
      bbox: { x0: 0, y0: idx * 30, x1: 500, y1: (idx + 1) * 30 },
    }));
}

/**
 * Dedicated PAN Card Parser
 * Supports both Modern PAN (Layout A: with explicit Hindi/English labels)
 * and Old PAN (Layout B: 4-line left vertical stack without labels).
 */
export function parsePanCardDetails(rawText: string, ocrLines?: OcrLineItem[]): ExtractedField[] {
  const lines = (ocrLines && ocrLines.length > 0) ? ocrLines : textToFallbackLines(rawText);
  const fields: ExtractedField[] = [];

  // 1. PAN Number
  let panNum = '';
  let panConf = 0;
  for (const l of lines) {
    const match = l.text.match(/\b([A-Z]{5}[0-9]{4}[A-Z])\b/);
    if (match) {
      panNum = match[1];
      panConf = Math.max(l.confidence, 90);
      break;
    }
  }

  if (panNum) {
    fields.push({
      key: 'documentNumber',
      label: 'PAN Number',
      value: panNum,
      confidence: panConf,
      confidenceRating: getConfidenceRating(panConf),
      category: 'identification',
    });
  } else {
    fields.push({
      key: 'documentNumber',
      label: 'PAN Number',
      value: 'Unable to read',
      confidence: 0,
      confidenceRating: 'unverified',
      category: 'identification',
      needsReviewNotice: 'PAN number pattern (5 letters + 4 digits + 1 letter) was not clearly recognized.',
    });
  }

  // 2. Date of Birth
  let dobVal = '';
  let dobConf = 0;
  for (const l of lines) {
    const match =
      l.text.match(/(?:DOB|Date of Birth|Birth Date|जन्म की तारीख|जन्म तिथि)[:\s]*(\d{2}[/-]\d{2}[/-]\d{4})/i) ||
      l.text.match(/\b(\d{2}[/-]\d{2}[/-]\d{4})\b/);
    if (match) {
      dobVal = match[1];
      dobConf = Math.max(l.confidence, 88);
      break;
    }
  }

  if (dobVal) {
    fields.push({
      key: 'dob',
      label: 'Date of Birth',
      value: dobVal,
      confidence: dobConf,
      confidenceRating: getConfidenceRating(dobConf),
      category: 'personal',
    });
  } else {
    fields.push({
      key: 'dob',
      label: 'Date of Birth',
      value: 'Not available',
      confidence: 0,
      confidenceRating: 'unverified',
      category: 'personal',
    });
  }

  // 3. Name & Father's Name Layout Detection
  let nameEng = '';
  let nameConf = 0;
  let fatherEng = '';
  let fatherConf = 0;
  let nameHin = '';
  let fatherHin = '';

  // Helper to accurately identify explicit label lines without confusing with names like "SAMPLE NAME"
  const isExplicitNameLabel = (str: string): boolean => {
    const t = str.trim();
    if (/^(?:नाम\s*[\/:]\s*Name|Name[:\s]*|नाम[:\s]*|Cardholder(?:'s)?\s*Name[:\s]*|Full\s*Name[:\s]*)$/i.test(t)) return true;
    if (/नाम\s*[\/]\s*Name/i.test(t)) return true;
    return false;
  };

  const isExplicitFatherLabel = (str: string): boolean => {
    const t = str.trim();
    if (/^(?:पिता\s*का\s*नाम\s*[\/:]\s*Father(?:'s)?\s*Name|Father(?:'s)?\s*Name[:\s]*|पिता\s*का\s*नाम[:\s]*|Father[:\s]*)$/i.test(t)) return true;
    if (/पिता\s*का\s*नाम\s*[\/]\s*Father/i.test(t)) return true;
    if (/^(?:Father's Name|Father Name|पिता का नाम)$/i.test(t)) return true;
    return false;
  };

  // Check if Modern PAN with explicit labels
  let nameLabelIdx = -1;
  let fatherLabelIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    const text = lines[i].text;
    if (isExplicitNameLabel(text)) {
      nameLabelIdx = i;
    }
    if (isExplicitFatherLabel(text)) {
      fatherLabelIdx = i;
    }
  }

  // Layout A: Modern PAN with explicit labels
  if (nameLabelIdx !== -1) {
    // Check line right next to label or on the line directly below
    for (let k = nameLabelIdx + 1; k <= Math.min(nameLabelIdx + 2, lines.length - 1); k++) {
      const c = cleanCandidateName(lines[k].text);
      if (c && /^[A-Za-z\s.'-]{3,35}$/.test(c) && !/\d/.test(c)) {
        nameEng = c;
        nameConf = lines[k].confidence || 85;
        break;
      }
    }
  }

  if (fatherLabelIdx !== -1) {
    for (let k = fatherLabelIdx + 1; k <= Math.min(fatherLabelIdx + 2, lines.length - 1); k++) {
      const c = cleanCandidateName(lines[k].text);
      if (c && /^[A-Za-z\s.'-]{3,35}$/.test(c) && !/\d/.test(c) && c !== nameEng) {
        fatherEng = c;
        fatherConf = lines[k].confidence || 85;
        break;
      }
    }
  }

  // Layout B: Old PAN without labels (4-line stack below header: Name, Father, DOB, PAN)
  if (!nameEng || !fatherEng) {
    const candidateLines: { text: string; conf: number; idx: number }[] = [];

    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      // Exclude header words, DOB lines, PAN number lines
      if (/\b\d{2}[/-]\d{2}[/-]\d{4}\b/.test(l.text)) continue;
      if (/\b[A-Z]{5}[0-9]{4}[A-Z]\b/.test(l.text)) continue;
      if (/INCOME TAX|DEPARTMENT|GOVERNMENT OF INDIA|GOVT OF INDIA|आयकर विभाग/i.test(l.text)) continue;
      if (/SIGNATURE|हस्ताक्षर|PERMANENT|ACCOUNT/i.test(l.text)) continue;

      const c = cleanCandidateName(l.text);
      if (c && /^[A-Z\s.'-]{3,35}$/i.test(c) && !/\d/.test(c) && c.length >= 3) {
        candidateLines.push({ text: c, conf: l.confidence, idx: i });
      }
    }

    if (candidateLines.length >= 1 && !nameEng) {
      nameEng = candidateLines[0].text;
      nameConf = candidateLines[0].conf || 80;
    }
    if (candidateLines.length >= 2 && !fatherEng) {
      fatherEng = candidateLines[1].text;
      fatherConf = candidateLines[1].conf || 78;
    }
  }

  // Check Hindi Names
  for (const l of lines) {
    const t = l.text.trim();
    if (/[\u0900-\u097F]/.test(t)) {
      if (!/आयकर|विभाग|भारत|सरकार|पिता|माता|जन्म|तारीख|संख्या|कार्ड|स्थायी|लेखा/i.test(t)) {
        const c = t.replace(/^[^\u0900-\u097F]+/, '').replace(/[^\u0900-\u097F\s]+$/, '').trim();
        if (c.length >= 2 && !nameHin) {
          nameHin = c;
        } else if (c.length >= 2 && nameHin && !fatherHin && c !== nameHin) {
          fatherHin = c;
        }
      }
    }
  }

  // Full Name Field
  if (nameEng) {
    fields.push({
      key: 'name',
      label: 'Full Name (English)',
      value: nameEng,
      confidence: nameConf,
      confidenceRating: getConfidenceRating(nameConf),
      category: 'personal',
      needsReviewNotice: nameConf < 65 ? 'Confidence is moderate. Please verify character spelling.' : undefined,
    });
  } else {
    fields.push({
      key: 'name',
      label: 'Full Name (English)',
      value: 'Unable to read',
      confidence: 0,
      confidenceRating: 'unverified',
      category: 'personal',
      needsReviewNotice: 'Could not associate name line with Name label.',
    });
  }

  if (nameHin) {
    fields.push({
      key: 'nameHindi',
      label: 'Full Name (Hindi)',
      value: nameHin,
      confidence: 84,
      confidenceRating: 'high',
      category: 'personal',
    });
  }

  // Father's Name Field
  if (fatherEng) {
    fields.push({
      key: 'fatherName',
      label: "Father's Full Name (English)",
      value: fatherEng,
      confidence: fatherConf,
      confidenceRating: getConfidenceRating(fatherConf),
      category: 'personal',
      needsReviewNotice: fatherConf < 65 ? 'Please verify father name spelling.' : undefined,
    });
  } else {
    fields.push({
      key: 'fatherName',
      label: "Father's Full Name (English)",
      value: 'Not available',
      confidence: 0,
      confidenceRating: 'unverified',
      category: 'personal',
    });
  }

  if (fatherHin) {
    fields.push({
      key: 'fatherNameHindi',
      label: "Father's Full Name (Hindi)",
      value: fatherHin,
      confidence: 80,
      confidenceRating: 'medium',
      category: 'personal',
    });
  }

  return fields;
}

/**
 * Parse individual Indian address tokens into structured components
 */
export function parseAddressComponents(rawAddress: string): AddressComponents {
  const comp: AddressComponents = {};

  // PIN Code: 6 digits
  const pinMatch = rawAddress.match(/\b([1-9][0-9]{5})\b/);
  if (pinMatch) {
    comp.pinCode = pinMatch[1];
  }

  // Indian States & UTs
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
    'Ladakh', 'Chandigarh', 'Puducherry'
  ];

  for (const st of states) {
    if (new RegExp(`\\b${st}\\b`, 'i').test(rawAddress)) {
      comp.state = st;
      break;
    }
  }

  // Post Office
  const poMatch = rawAddress.match(/(?:P\.?O\.?|Post Office|डाकघर)[:\s]*([A-Za-z\s]+?)(?:,|$|\d)/i);
  if (poMatch && poMatch[1].trim()) {
    comp.postOffice = poMatch[1].trim();
  }

  // District
  const distMatch = rawAddress.match(/(?:Dist(?:rict)?|जिला)[:\s]*([A-Za-z\s]+?)(?:,|$|\n)/i);
  if (distMatch && distMatch[1].trim()) {
    comp.district = distMatch[1].trim();
  }

  // House / Building Number
  const houseMatch = rawAddress.match(
    /(?:(?:Flat|House|H\.|Plot|Building|Door|#)\s*(?:No\.?)?[:\s]*([A-Za-z0-9\-\/]+)|\b([0-9]{1,4}[\/\-][0-9A-Za-z]+)\b)/i
  );
  if (houseMatch) {
    comp.houseNumber = (houseMatch[1] || houseMatch[2]).trim();
  }

  // Street / Road
  const streetMatch = rawAddress.match(/([A-Za-z0-9\s]+(?:Road|Street|Marg|Lane|Cross|Main|Gali|Rasta))/i);
  if (streetMatch) {
    comp.street = streetMatch[1].trim();
  }

  // Locality / Area
  const localityMatch = rawAddress.match(
    /([A-Za-z0-9\s]+(?:Nagar|Colony|Sector|Vihar|Layout|Enclave|Area|Mohalla|Puram|Ward\s*No[\-\s]*\d+))/i
  );
  if (localityMatch) {
    comp.locality = localityMatch[1].trim();
  }

  return comp;
}

/**
 * Dedicated Aadhaar Card Parser
 * Handles Front, Back, Combined dual-side layouts, and e-Aadhaar letters.
 */
export function parseAadhaarCardDetails(rawText: string, ocrLines?: OcrLineItem[]): {
  fields: ExtractedField[];
  addressComponents: AddressComponents;
  completeAddressEnglish?: string;
  completeAddressHindi?: string;
} {
  const lines = (ocrLines && ocrLines.length > 0) ? ocrLines : textToFallbackLines(rawText);
  const fields: ExtractedField[] = [];

  // 1. Aadhaar Number (12 digits, spaced 4 4 4, or masked)
  let aadhaarNum = '';
  let isMasked = false;
  let maskedDisplay = '';
  let aadhConf = 0;

  for (const l of lines) {
    // Exclude VID (16 digits) and Enrollment (14 digits)
    if (/VID|Enrolment|Enrollment/i.test(l.text)) continue;

    const mMatch = l.text.match(/\b([Xx*]{4}\s?[Xx*]{4}\s?\d{4})\b/);
    const aMatch = l.text.match(/\b(\d{4}\s\d{4}\s\d{4})\b/);
    const cMatch = l.text.match(/\b(\d{12})\b/);

    if (mMatch) {
      const raw = mMatch[1].replace(/\s+/g, ' ');
      aadhaarNum = raw;
      isMasked = true;
      maskedDisplay = raw;
      aadhConf = Math.max(l.confidence, 92);
      break;
    } else if (aMatch) {
      aadhaarNum = aMatch[1];
      isMasked = false;
      maskedDisplay = maskAadhaarNumber(aadhaarNum);
      aadhConf = Math.max(l.confidence, 94);
      break;
    } else if (cMatch) {
      const raw = `${cMatch[1].slice(0, 4)} ${cMatch[1].slice(4, 8)} ${cMatch[1].slice(8, 12)}`;
      aadhaarNum = raw;
      isMasked = false;
      maskedDisplay = maskAadhaarNumber(raw);
      aadhConf = Math.max(l.confidence, 90);
      break;
    }
  }

  if (aadhaarNum) {
    fields.push({
      key: 'documentNumber',
      label: 'Aadhaar Number',
      value: aadhaarNum,
      maskedValue: maskedDisplay,
      isMasked,
      confidence: aadhConf,
      confidenceRating: getConfidenceRating(aadhConf),
      category: 'identification',
    });
  } else {
    fields.push({
      key: 'documentNumber',
      label: 'Aadhaar Number',
      value: 'Unable to read',
      confidence: 0,
      confidenceRating: 'unverified',
      category: 'identification',
      needsReviewNotice: '12-digit Aadhaar number not detected clearly.',
    });
  }

  // 2. Date of Birth or Year of Birth
  let dobVal = '';
  let isYobOnly = false;
  let dobConf = 0;

  for (const l of lines) {
    const fullDobMatch =
      l.text.match(/(?:DOB|Date of Birth|जन्म तिथि)[:\s]*(\d{2}[/-]\d{2}[/-]\d{4})/i) ||
      l.text.match(/\b(\d{2}[/-]\d{2}[/-]\d{4})\b/);
    if (fullDobMatch) {
      dobVal = fullDobMatch[1];
      dobConf = Math.max(l.confidence, 92);
      break;
    }
  }

  if (!dobVal) {
    for (const l of lines) {
      const yobMatch =
        l.text.match(/(?:Year of Birth|YOB|जन्म वर्ष)[:\s]*(\d{4})/i) ||
        l.text.match(/\b(19\d{2}|20\d{2})\b/);
      if (yobMatch) {
        dobVal = `Year of Birth: ${yobMatch[1]}`;
        isYobOnly = true;
        dobConf = Math.max(l.confidence, 86);
        break;
      }
    }
  }

  fields.push({
    key: 'dob',
    label: isYobOnly ? 'Year of Birth' : 'Date of Birth',
    value: dobVal || 'Not available',
    confidence: dobVal ? dobConf : 0,
    confidenceRating: getConfidenceRating(dobConf),
    category: 'personal',
  });

  // 3. Gender
  let gender = '';
  let genderConf = 0;
  for (const l of lines) {
    const gMatch = l.text.match(/\b(MALE|FEMALE|TRANSGENDER|पुरुष|महिला|ट्रांसजेंडर)\b/i);
    if (gMatch) {
      const matched = gMatch[1].toUpperCase();
      if (matched === 'पुरुष') gender = 'MALE';
      else if (matched === 'महिला') gender = 'FEMALE';
      else if (matched === 'ट्रांसजेंडर') gender = 'TRANSGENDER';
      else gender = matched;
      genderConf = Math.max(l.confidence, 90);
      break;
    }
  }

  fields.push({
    key: 'gender',
    label: 'Gender',
    value: gender || 'Unable to read',
    confidence: gender ? genderConf : 0,
    confidenceRating: getConfidenceRating(genderConf),
    category: 'personal',
  });

  // 4. Name (English & Hindi)
  let nameEng = '';
  let nameEngConf = 0;
  let nameHin = '';

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const t = l.text;
    if (/Government|India|Unique|Identification|Authority|Enrollment|MERA|AADHAAR|भारत|विशिष्ट/i.test(t)) {
      continue;
    }
    if (/DOB|Male|Female|Address|आम आदमी|पहचान/i.test(t)) continue;

    // Hindi name usually appears on front before English name
    if (/[\u0900-\u097F]/.test(t) && !nameHin && !/जन्म|तारीख|वर्ष|महिला|पुरुष|पता|सरकार/i.test(t)) {
      const cleaned = t.replace(/^[^\u0900-\u097F]+/, '').replace(/[^\u0900-\u097F\s]+$/, '').trim();
      if (cleaned.length >= 2) nameHin = cleaned;
    }

    // English name
    const cleanedEng = cleanCandidateName(t);
    if (/^[A-Za-z\s.'-]{3,35}$/.test(cleanedEng) && !nameEng) {
      if (!/GOVERNMENT|INDIA|AADHAAR|DOB|MALE|FEMALE|DATE|BIRTH|YEAR/i.test(cleanedEng)) {
        nameEng = cleanedEng;
        nameEngConf = l.confidence || 85;
      }
    }
  }

  fields.push({
    key: 'name',
    label: 'Full Name (English)',
    value: nameEng || 'Unable to read',
    confidence: nameEng ? nameEngConf : 0,
    confidenceRating: getConfidenceRating(nameEngConf),
    category: 'personal',
  });

  if (nameHin) {
    fields.push({
      key: 'nameHindi',
      label: 'Full Name (Hindi)',
      value: nameHin,
      confidence: 85,
      confidenceRating: 'high',
      category: 'personal',
    });
  }

  // 5. Address (English & Hindi)
  let addressEng = '';
  let addressHin = '';

  const addrEngMatch = rawText.match(
    /(?:Address|C\/O|S\/O|W\/O|D\/O)[:\s]*([\s\S]{15,240}?)(?:\b[1-9][0-9]{5}\b|$)/i
  );
  if (addrEngMatch) {
    addressEng = addrEngMatch[0].replace(/\n+/g, ', ').trim();
  }

  const addrHinMatch = rawText.match(/(?:पता)[:\s]*([\s\S]{15,240}?)(?:\b[1-9][0-9]{5}\b|$)/);
  if (addrHinMatch) {
    addressHin = addrHinMatch[0].replace(/\n+/g, ', ').trim();
  }

  if (addressEng) {
    fields.push({
      key: 'address',
      label: 'Complete Address (English)',
      value: addressEng,
      confidence: 84,
      confidenceRating: 'high',
      category: 'address',
    });
  }

  if (addressHin) {
    fields.push({
      key: 'addressHindi',
      label: 'Complete Address (Hindi)',
      value: addressHin,
      confidence: 80,
      confidenceRating: 'high',
      category: 'address',
    });
  }

  const addressComponents = parseAddressComponents(addressEng || rawText);

  if (addressComponents.pinCode) {
    fields.push({
      key: 'pinCode',
      label: 'PIN Code',
      value: addressComponents.pinCode,
      confidence: 96,
      confidenceRating: 'high',
      category: 'address',
    });
  }
  if (addressComponents.state) {
    fields.push({
      key: 'state',
      label: 'State',
      value: addressComponents.state,
      confidence: 90,
      confidenceRating: 'high',
      category: 'address',
    });
  }
  if (addressComponents.district) {
    fields.push({
      key: 'district',
      label: 'District',
      value: addressComponents.district,
      confidence: 82,
      confidenceRating: 'high',
      category: 'address',
    });
  }
  if (addressComponents.houseNumber) {
    fields.push({
      key: 'houseNumber',
      label: 'House / Building No.',
      value: addressComponents.houseNumber,
      confidence: 78,
      confidenceRating: 'medium',
      category: 'address',
    });
  }

  return {
    fields,
    addressComponents,
    completeAddressEnglish: addressEng || undefined,
    completeAddressHindi: addressHin || undefined,
  };
}

/**
 * Dedicated Voter ID (EPIC) Parser
 */
export function parseVoterIdDetails(rawText: string, ocrLines?: OcrLineItem[]): ExtractedField[] {
  const lines = (ocrLines && ocrLines.length > 0) ? ocrLines : textToFallbackLines(rawText);
  const fields: ExtractedField[] = [];

  // 1. EPIC Number
  let epicNum = '';
  let epicConf = 0;
  const epicRegex = /\b([A-Z]{3}[0-9]{7})\b/;
  const altEpicRegex = /\b([A-Z]{2,3}\/[0-9]{2,3}\/[0-9]{3,7})\b/;

  for (const l of lines) {
    const m = l.text.match(epicRegex) || l.text.match(altEpicRegex);
    if (m) {
      epicNum = m[1];
      epicConf = Math.max(l.confidence, 92);
      break;
    }
  }

  if (epicNum) {
    fields.push({
      key: 'documentNumber',
      label: 'Voter ID / EPIC Number',
      value: epicNum,
      confidence: epicConf,
      confidenceRating: getConfidenceRating(epicConf),
      category: 'identification',
    });
  } else {
    fields.push({
      key: 'documentNumber',
      label: 'Voter ID / EPIC Number',
      value: 'Unable to read',
      confidence: 0,
      confidenceRating: 'unverified',
      category: 'identification',
    });
  }

  // 2. Elector Name
  let nameEng = '';
  let nameConf = 0;
  let nameHin = '';

  const nameMatch =
    rawText.match(/(?:Elector(?:'s)?\s*Name|निर्वाचक का नाम)[: \t]*(?:\r?\n)?[ \t]*([A-Za-z ]{3,35})/i) ||
    rawText.match(/\bName[: \t]*(?:\r?\n)?[ \t]*([A-Za-z ]{3,35})/i);
  if (nameMatch) {
    nameEng = cleanCandidateName(nameMatch[1]);
    nameConf = 88;
  }

  for (const l of lines) {
    if (/[\u0900-\u097F]/.test(l.text)) {
      if (!/निर्वाचन|आयोग|पहचान|पत्र|पिता|पति|माता|आयु|लिंग/i.test(l.text) && !nameHin) {
        nameHin = l.text.trim();
        break;
      }
    }
  }

  fields.push({
    key: 'name',
    label: "Elector's Name (English)",
    value: nameEng || 'Unable to read',
    confidence: nameEng ? nameConf : 0,
    confidenceRating: getConfidenceRating(nameConf),
    category: 'personal',
  });

  if (nameHin) {
    fields.push({
      key: 'nameHindi',
      label: "Elector's Name (Hindi)",
      value: nameHin,
      confidence: 82,
      confidenceRating: 'high',
      category: 'personal',
    });
  }

  // 3. Relative Name (Father, Husband, Mother)
  let relNameEng = '';
  let relType = "Father's Name";
  let relConf = 0;

  const fatherMatch = rawText.match(/(?:Father(?:'s)?\s*Name|पिता का नाम)[: \t]*(?:\r?\n)?[ \t]*([A-Za-z ]{3,35})/i);
  const husbandMatch = rawText.match(/(?:Husband(?:'s)?\s*Name|पति का नाम)[: \t]*(?:\r?\n)?[ \t]*([A-Za-z ]{3,35})/i);
  const motherMatch = rawText.match(/(?:Mother(?:'s)?\s*Name|माता का नाम)[: \t]*(?:\r?\n)?[ \t]*([A-Za-z ]{3,35})/i);

  if (husbandMatch) {
    relNameEng = cleanCandidateName(husbandMatch[1]);
    relType = "Husband's Name";
    relConf = 85;
  } else if (motherMatch) {
    relNameEng = cleanCandidateName(motherMatch[1]);
    relType = "Mother's Name";
    relConf = 85;
  } else if (fatherMatch) {
    relNameEng = cleanCandidateName(fatherMatch[1]);
    relType = "Father's Name";
    relConf = 85;
  }

  fields.push({
    key: 'relativeName',
    label: `${relType} (English)`,
    value: relNameEng || 'Not available',
    confidence: relNameEng ? relConf : 0,
    confidenceRating: getConfidenceRating(relConf),
    category: 'personal',
  });

  // 4. Date of Birth or Age
  const dobMatch =
    rawText.match(/(?:DOB|Date of Birth|जन्म तिथि)[:\s]*(\d{2}[/-]\d{2}[/-]\d{4})/i) ||
    rawText.match(/\b(\d{2}[/-]\d{2}[/-]\d{4})\b/);
  const ageMatch = rawText.match(/(?:Age|आयु)[:\s]*(\d{1,3})\s*(?:Years|वर्ष)?/i);

  if (dobMatch) {
    fields.push({
      key: 'dob',
      label: 'Date of Birth',
      value: dobMatch[1],
      confidence: 90,
      confidenceRating: 'high',
      category: 'personal',
    });
  } else if (ageMatch) {
    fields.push({
      key: 'dob',
      label: 'Age as per Record',
      value: `${ageMatch[1]} Years (Date of birth Not available)`,
      confidence: 82,
      confidenceRating: 'high',
      category: 'personal',
    });
  } else {
    fields.push({
      key: 'dob',
      label: 'Date of Birth',
      value: 'Not available',
      confidence: 0,
      confidenceRating: 'unverified',
      category: 'personal',
    });
  }

  return fields;
}

/**
 * Dedicated General Document Parser
 */
export function parseGeneralDocumentDetails(rawText: string): ExtractedField[] {
  const fields: ExtractedField[] = [];

  const dateMatches = Array.from(rawText.matchAll(/\b(\d{2}[/-]\d{2}[/-]\d{4})\b/g));
  if (dateMatches.length > 0) {
    fields.push({
      key: 'dob',
      label: 'Detected Date(s)',
      value: dateMatches.map((m) => m[1]).slice(0, 3).join(', '),
      confidence: 80,
      confidenceRating: 'medium',
      category: 'other',
    });
  }

  const refMatches = Array.from(rawText.matchAll(/(?:Ref|Reference|Doc|No\.|Number|Invoice|ID)[:\s]*([A-Z0-9\-\/]{5,25})/gi));
  if (refMatches.length > 0) {
    fields.push({
      key: 'documentNumber',
      label: 'Detected Reference / ID',
      value: refMatches[0][1],
      confidence: 75,
      confidenceRating: 'medium',
      category: 'identification',
    });
  }

  const emailMatch = rawText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/);
  if (emailMatch) {
    fields.push({
      key: 'email',
      label: 'Detected Email Address',
      value: emailMatch[0],
      confidence: 90,
      confidenceRating: 'high',
      category: 'personal',
    });
  }

  const phoneMatch = rawText.match(/(?:\+91[\-\s]?)?[6-9]\d{9}\b/);
  if (phoneMatch) {
    fields.push({
      key: 'phone',
      label: 'Detected Mobile Number',
      value: phoneMatch[0],
      confidence: 85,
      confidenceRating: 'high',
      category: 'personal',
    });
  }

  return fields;
}

/**
 * Universal Extraction Function (Main Entrypoint)
 */
export function extractFieldsFromText(
  rawText: string,
  selectedFields: FieldKey[],
  docType: DocumentType,
  ocrLines?: OcrLineItem[]
): DocumentExtractionResult {
  let fields: ExtractedField[] = [];

  if (docType === 'pan') {
    fields = parsePanCardDetails(rawText, ocrLines);
  } else if (docType === 'aadhaar') {
    fields = parseAadhaarCardDetails(rawText, ocrLines).fields;
  } else if (docType === 'voter_id') {
    fields = parseVoterIdDetails(rawText, ocrLines);
  } else {
    fields = parseGeneralDocumentDetails(rawText);
  }

  if (selectedFields && selectedFields.length > 0) {
    const keySet = new Set<string>(selectedFields);
    const filtered = fields.filter((f) => keySet.has(f.key) || f.key === 'documentNumber');
    if (filtered.length > 0) {
      fields = filtered;
    }
  }

  const validFields = fields.filter((f) => f.confidence > 0);
  const avgConf =
    validFields.length > 0
      ? Math.round(validFields.reduce((acc, f) => acc + f.confidence, 0) / validFields.length)
      : 0;

  return {
    documentType: docType,
    fields,
    rawText,
    accuracyScore: avgConf,
  };
}

/**
 * Adaptive Image Extraction (Photograph, Signature, QR Code)
 * Detects whether Photo is on Left (Modern PAN, Aadhaar, Voter) or Right (Old PAN).
 */
export async function extractDocumentImages(
  canvas: HTMLCanvasElement,
  docType: DocumentCategoryType,
  rawText?: string
): Promise<{ images: ExtractedImageItem[]; qrResult?: QrExtractionResult }> {
  const images: ExtractedImageItem[] = [];
  let qrResult: QrExtractionResult = {
    detected: false,
    verificationNotice: 'Client-side QR parsing only. No external server authentication.',
  };

  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');
  if (!ctx || width < 20 || height < 20) {
    return { images, qrResult };
  }

  // 1. QR Code Detection using jsQR
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const qrCode = jsQR(imgData.data, imgData.width, imgData.height, {
      inversionAttempts: 'attemptBoth',
    });

    if (qrCode && qrCode.location) {
      const loc = qrCode.location;
      const xs = [loc.topLeftCorner.x, loc.topRightCorner.x, loc.bottomRightCorner.x, loc.bottomLeftCorner.x];
      const ys = [loc.topLeftCorner.y, loc.topRightCorner.y, loc.bottomRightCorner.y, loc.bottomLeftCorner.y];
      const minX = Math.max(0, Math.min(...xs));
      const maxX = Math.min(width, Math.max(...xs));
      const minY = Math.max(0, Math.min(...ys));
      const maxY = Math.min(height, Math.max(...ys));

      const qrW = maxX - minX;
      const qrH = maxY - minY;

      if (qrW > 20 && qrH > 20) {
        const padX = Math.round(qrW * 0.08);
        const padY = Math.round(qrH * 0.08);
        const cropX = Math.max(0, minX - padX);
        const cropY = Math.max(0, minY - padY);
        const cropW = Math.min(width - cropX, qrW + padX * 2);
        const cropH = Math.min(height - cropY, qrH + padY * 2);

        const qrCanvas = document.createElement('canvas');
        qrCanvas.width = cropW;
        qrCanvas.height = cropH;
        const qrCtx = qrCanvas.getContext('2d');
        if (qrCtx) {
          qrCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
          const qrDataUrl = qrCanvas.toDataURL('image/png');

          images.push({
            id: 'qr-code',
            type: 'qr',
            label: 'Extracted QR Code',
            dataUrl: qrDataUrl,
            width: cropW,
            height: cropH,
          });

          qrResult = {
            detected: true,
            qrData: qrCode.data,
            imageUrl: qrDataUrl,
            verificationNotice:
              'Official QR code data decoded locally. For legal verification, UIDAI authentication is required.',
          };
        }
      }
    }
  } catch (err) {
    console.warn('QR Code scan error', err);
  }

  // 2. Photograph Extraction
  try {
    let px = 0;
    let py = 0;
    let pw = 0;
    let ph = 0;

    // Detect if Old PAN (Photo on right side)
    const isOldPan = docType === 'pan' && rawText && !/नाम\s*\/\s*Name/i.test(rawText) && /SAMPLE|Father's Name|Signature/i.test(rawText);

    if (docType === 'pan') {
      if (isOldPan) {
        // Old PAN Photo on Right
        px = Math.round(width * 0.68);
        py = Math.round(height * 0.22);
        pw = Math.round(width * 0.28);
        ph = Math.round(height * 0.45);
      } else {
        // Modern PAN Photo on Left
        px = Math.round(width * 0.05);
        py = Math.round(height * 0.22);
        pw = Math.round(width * 0.32);
        ph = Math.round(height * 0.44);
      }
    } else if (docType === 'aadhaar') {
      // Aadhaar Card Photo on Left
      px = Math.round(width * 0.08);
      py = Math.round(height * 0.20);
      pw = Math.round(width * 0.28);
      ph = Math.round(height * 0.46);
    } else if (docType === 'voter_id') {
      // Voter ID Photo on Left
      px = Math.round(width * 0.05);
      py = Math.round(height * 0.18);
      pw = Math.round(width * 0.32);
      ph = Math.round(height * 0.46);
    }

    if (pw > 30 && ph > 30) {
      const photoCanvas = document.createElement('canvas');
      photoCanvas.width = pw;
      photoCanvas.height = ph;
      const photoCtx = photoCanvas.getContext('2d');
      if (photoCtx) {
        photoCtx.drawImage(canvas, px, py, pw, ph, 0, 0, pw, ph);
        const photoDataUrl = photoCanvas.toDataURL('image/png');
        images.push({
          id: 'photo',
          type: 'photo',
          label: 'Document Photograph',
          dataUrl: photoDataUrl,
          width: pw,
          height: ph,
        });
      }
    }
  } catch (err) {
    console.warn('Photo extraction error', err);
  }

  // 3. Signature Extraction (PAN cards)
  if (docType === 'pan') {
    try {
      const isOldPan = rawText && !/नाम\s*\/\s*Name/i.test(rawText);
      const sx = isOldPan ? Math.round(width * 0.65) : Math.round(width * 0.05);
      const sy = Math.round(height * 0.68);
      const sw = isOldPan ? Math.round(width * 0.30) : Math.round(width * 0.42);
      const sh = Math.round(height * 0.24);

      if (sw > 20 && sh > 10) {
        const sigCanvas = document.createElement('canvas');
        sigCanvas.width = sw;
        sigCanvas.height = sh;
        const sigCtx = sigCanvas.getContext('2d');
        if (sigCtx) {
          sigCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);

          // Contrast enhancement filter to make signature strokes sharp
          const sigImg = sigCtx.getImageData(0, 0, sw, sh);
          const data = sigImg.data;
          for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            // Threshold background to pure white while preserving ink
            const val = gray < 165 ? Math.max(0, gray - 30) : 255;
            data[i] = val;
            data[i + 1] = val;
            data[i + 2] = val;
          }
          sigCtx.putImageData(sigImg, 0, 0);

          const sigDataUrl = sigCanvas.toDataURL('image/png');
          images.push({
            id: 'signature',
            type: 'signature',
            label: 'Extracted Signature',
            dataUrl: sigDataUrl,
            width: sw,
            height: sh,
          });
        }
      }
    } catch (err) {
      console.warn('Signature extraction error', err);
    }
  }

  return { images, qrResult };
}

/**
 * Export helpers
 */
export function exportToJson(
  fields: ExtractedField[],
  docType: string,
  options?: { maskSensitive?: boolean }
): string {
  const exportObj: Record<string, any> = {
    documentType: docType,
    exportedAt: new Date().toISOString(),
    fields: {},
  };

  fields.forEach((f) => {
    const val = options?.maskSensitive && f.maskedValue ? f.maskedValue : f.value;
    exportObj.fields[f.key] = {
      label: f.label,
      value: val,
      hindiValue: f.hindiValue,
      confidence: `${f.confidence}%`,
      confidenceRating: f.confidenceRating,
    };
  });

  return JSON.stringify(exportObj, null, 2);
}

export function exportToCsv(fields: ExtractedField[]): string {
  const headers = ['Field Key', 'Field Label', 'Extracted Value', 'Hindi Value', 'Confidence'];
  const rows = fields.map((f) => [
    `"${f.key}"`,
    `"${f.label.replace(/"/g, '""')}"`,
    `"${f.value.replace(/"/g, '""')}"`,
    `"${(f.hindiValue || '').replace(/"/g, '""')}"`,
    `"${f.confidence}%"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function exportToText(
  fields: ExtractedField[],
  docType: string,
  options?: { maskSensitive?: boolean }
): string {
  const lines: string[] = [
    '========================================',
    `VIVEXA TOOLS - DOCUMENT DETAIL EXTRACTOR`,
    `Document Type: ${docType.toUpperCase()}`,
    `Extracted At: ${new Date().toLocaleString()}`,
    '========================================\n',
  ];

  fields.forEach((f) => {
    const val = options?.maskSensitive && f.maskedValue ? f.maskedValue : f.value;
    lines.push(`${f.label}: ${val}`);
    if (f.hindiValue) {
      lines.push(`${f.label} (Hindi): ${f.hindiValue}`);
    }
  });

  return lines.join('\n');
}
