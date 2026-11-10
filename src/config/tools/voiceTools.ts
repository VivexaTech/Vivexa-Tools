import { ToolDefinition } from '@/types/tools';

export const VOICE_TOOLS: ToolDefinition[] = [
  {
    id: 'speech-to-text',
    name: 'Speech to Text',
    slug: 'speech-to-text',
    category: 'voice',
    subcategory: 'Speech Recognition',
    shortDescription: 'Convert spoken voice into written text transcripts using native Web Speech recognition.',
    fullDescription: 'Speak into your device microphone to generate accurate written transcripts in real-time. Features multi-language support (English US/UK/India, Hindi, Spanish, French, German), continuous dictation mode, interim live preview, auto-capitalization, word counter, and one-click text export without external API keys or server audio storage.',
    searchKeywords: ['speech to text', 'voice to text', 'voice dictation', 'transcribe audio', 'speech recognition online', 'voice typing'],
    icon: 'Mic',
    supportedInputFormats: ['Microphone Audio Stream'],
    supportedOutputFormats: ['Text Transcript', '.txt'],
    processingEngine: 'Browser Web Speech API (webkitSpeechRecognition)',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Select Language',
        description: 'Choose your speaking language (e.g., English, Hindi, Spanish, French).'
      },
      {
        step: 2,
        title: 'Grant Microphone Permission',
        description: 'Click "Start Recording" and allow your browser access to your device microphone.'
      },
      {
        step: 3,
        title: 'Speak Clearly',
        description: 'Dictate your sentences. Live words appear on screen in real-time as you talk.'
      },
      {
        step: 4,
        title: 'Copy or Download Transcript',
        description: 'Stop recording, review the written text, and copy to clipboard or download as a .txt file.'
      }
    ],
    faqs: [
      {
        question: 'Is my voice recorded and stored on your servers?',
        answer: 'No. Vivexa Tools never stores, transmits, or logs your audio. Processing uses your browser\'s native speech engine.'
      },
      {
        question: 'Which browsers support Web Speech API?',
        answer: 'Google Chrome, Microsoft Edge, Safari, and other modern Chromium-based browsers have built-in support for Web Speech API.'
      }
    ],
    relatedToolSlugs: ['text-to-speech', 'typing-speed-test', 'ocr-pdf'],
    seoTitle: 'Free Speech to Text Online - Live Voice Dictation & Transcriber | Vivexa Tools',
    seoDescription: 'Transcribe your voice into text in real-time using your browser microphone. Multi-language speech recognition, 100% private with no account required.'
  },
  {
    id: 'text-to-speech',
    name: 'Text to Speech',
    slug: 'text-to-speech',
    category: 'voice',
    subcategory: 'Voice Synthesis',
    shortDescription: 'Convert written articles, notes, and messages into natural audible speech.',
    fullDescription: 'Listen to any written text spoken aloud with natural browser speech synthesis. Select from your system\'s installed voices across accents and languages, adjust reading speed (rate), pitch, and volume, pause and resume playback, and listen without any cloud API quotas or server limits.',
    searchKeywords: ['text to speech', 'tts online', 'read text aloud', 'voice generator', 'speech synthesis', 'listen to text'],
    icon: 'Volume2',
    supportedInputFormats: ['Pasted Text', 'Articles', 'Notes'],
    supportedOutputFormats: ['Audio Playback', 'System Voice Output'],
    processingEngine: 'Browser Native SpeechSynthesis Web API',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Enter or Paste Text',
        description: 'Type or paste the paragraphs, article, or essay you want read aloud.'
      },
      {
        step: 2,
        title: 'Select Voice & Accent',
        description: 'Choose among the natural voices available on your operating system.'
      },
      {
        step: 3,
        title: 'Adjust Speed and Pitch',
        description: 'Customize speech rate, pitch tone, and playback volume to your preference.'
      },
      {
        step: 4,
        title: 'Play, Pause, and Listen',
        description: 'Click "Play" to start speaking with real-time word tracking, or pause/resume anytime.'
      }
    ],
    faqs: [
      {
        question: 'Are there any word or character limits?',
        answer: 'There are no artificial word limits. You can read entire articles or documents comfortably.'
      },
      {
        question: 'Why do voices differ on different computers?',
        answer: 'The tool uses the high-quality speech synthesizers installed on your operating system (Windows, macOS, iOS, Android, or Linux).'
      }
    ],
    relatedToolSlugs: ['speech-to-text', 'typing-speed-test', 'pdf-to-word'],
    seoTitle: 'Free Text to Speech Online - Natural Voice Reader | Vivexa Tools',
    seoDescription: 'Convert text into natural sounding speech in your browser. Choose system voices, customize speed and pitch, and listen privately without limits.'
  }
];
