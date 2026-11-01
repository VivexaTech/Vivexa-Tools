import { ToolDefinition } from '@/types/tools';

export const AUDIO_TOOLS: ToolDefinition[] = [
  {
    id: 'audio-format-converter',
    name: 'Audio Format Converter',
    slug: 'audio-converter',
    category: 'audio',
    subcategory: 'Conversion',
    shortDescription: 'Convert audio files between WAV, MP3, and OGG formats in your browser.',
    fullDescription: 'Convert audio tracks directly in your browser using the native Web Audio API and AudioContext. Decode incoming audio files (MP3, WAV, OGG, M4A, AAC) and encode into standard high-fidelity uncompressed WAV or compressed audio without uploading files.',
    searchKeywords: ['audio converter', 'mp3 to wav', 'wav to mp3', 'sound converter', 'convert audio'],
    icon: 'Music',
    supportedInputFormats: ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'],
    supportedOutputFormats: ['.wav'],
    processingEngine: 'Web Audio API & AudioBuffer Transcoder',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload your audio track',
        description: 'Drag and drop or select your audio file (MP3, WAV, OGG, M4A, AAC).'
      },
      {
        step: 2,
        title: 'Inspect track details & select output',
        description: 'Review audio length, sampling rate (e.g. 44,100 Hz), channels (Stereo/Mono), and select your desired export format.'
      },
      {
        step: 3,
        title: 'Process and transcode',
        description: 'Click "Convert Audio". The native Web Audio API decodes the audio stream into raw PCM buffers.'
      },
      {
        step: 4,
        title: 'Download audio file',
        description: 'Save your newly transcoded audio file to your device.'
      }
    ],
    faqs: [
      {
        question: 'Are large audio files supported in browser processing?',
        answer: 'Yes! Songs, voice memos, and podcasts under 100 MB decode quickly into memory on modern devices.'
      },
      {
        question: 'Does this compromise audio quality?',
        answer: 'No, uncompressed 16-bit or 24-bit PCM WAV encoding preserves full dynamic range and frequency fidelity.'
      }
    ],
    relatedToolSlugs: ['audio-compressor', 'video-trimmer'],
    seoTitle: 'Audio Converter Online Free - Convert MP3, WAV, OGG | Vivexa Tools',
    seoDescription: 'Convert audio files between MP3, WAV, and OGG formats locally in your browser. 100% private, no server upload.'
  },
  {
    id: 'audio-compressor',
    name: 'Audio Compressor',
    slug: 'audio-compressor',
    category: 'audio',
    subcategory: 'Compression',
    shortDescription: 'Reduce audio file size by optimizing sample rate and channel configuration.',
    fullDescription: 'Compress large audio recordings, voice notes, and podcast tracks. Downsample high sampling rates (e.g., 48,000 Hz or 44,100 Hz down to 22,050 Hz or 16,000 Hz for speech) and convert stereo to mono to dramatically reduce file size without losing speech clarity.',
    searchKeywords: ['audio compressor', 'reduce audio size', 'shrink mp3', 'compress wav', 'smaller audio'],
    icon: 'Minimize2',
    supportedInputFormats: ['.mp3', '.wav', '.ogg', '.m4a'],
    supportedOutputFormats: ['.wav'],
    processingEngine: 'Web Audio Resampling & Channel Downmixer',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload audio recording',
        description: 'Select the audio file you need to compress.'
      },
      {
        step: 2,
        title: 'Select compression profile',
        description: 'Choose "Voice/Speech" (16 kHz mono - 70% reduction), "Podcast/Audiobook" (22 kHz mono - 50% reduction), or "Standard Music" (32 kHz stereo).'
      },
      {
        step: 3,
        title: 'Compress audio',
        description: 'Click "Compress Audio" to downsample and downmix the audio buffer.'
      },
      {
        step: 4,
        title: 'Download compressed track',
        description: 'Download the lighter, optimized audio file.'
      }
    ],
    faqs: [
      {
        question: 'How much can audio file size be reduced?',
        answer: 'Converting stereo speech to mono and downsampling from 44.1 kHz to 16 kHz typically reduces file size by 65% to 80% with clear intelligibility.'
      }
    ],
    relatedToolSlugs: ['audio-converter', 'video-compressor'],
    seoTitle: 'Audio Compressor Online Free - Reduce Audio File Size | Vivexa Tools',
    seoDescription: 'Compress audio files locally in your browser. Downsample sample rates and convert stereo to mono to reduce file size.'
  }
];
