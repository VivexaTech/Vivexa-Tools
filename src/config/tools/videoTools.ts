import { ToolDefinition } from '@/types/tools';

export const VIDEO_TOOLS: ToolDefinition[] = [
  {
    id: 'video-trimmer',
    name: 'Video Trimmer',
    slug: 'video-trimmer',
    category: 'video',
    subcategory: 'Trimming',
    shortDescription: 'Cut and trim video clips to exact start and end times in your browser.',
    fullDescription: 'Trim unwanted beginnings, endings, or middle sections from your videos. Play and scrub video footage, drag visual start and end markers, review the exact trimmed duration, and export the clip locally with hardware-accelerated MediaRecorder.',
    searchKeywords: ['trim video', 'cut video', 'shorten video', 'clip video', 'video editor'],
    icon: 'Scissors',
    supportedInputFormats: ['.mp4', '.webm', '.mov', '.ogg'],
    supportedOutputFormats: ['.webm', '.mp4'],
    processingEngine: 'HTML5 Video & Canvas MediaStream Recorder',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload your video',
        description: 'Select your video file (MP4, WebM, or MOV).'
      },
      {
        step: 2,
        title: 'Set Start and End timestamps',
        description: 'Play the video or scrub the timeline. Use the Start and End markers or numeric inputs to select the clip boundaries.'
      },
      {
        step: 3,
        title: 'Process clip',
        description: 'Click "Trim Video". The client stream engine records the bounded time interval directly in your browser.'
      },
      {
        step: 4,
        title: 'Download trimmed video',
        description: 'Save the cut clip to your device.'
      }
    ],
    faqs: [
      {
        question: 'Does trimming upload my video to a remote server?',
        answer: 'No. The entire playback, frame extraction, and recording pipeline occurs locally inside your browser.'
      },
      {
        question: 'What video formats are supported?',
        answer: 'Standard MP4 (H.264), WebM (VP8/VP9), and MOV files supported by your browser are processed smoothly.'
      }
    ],
    relatedToolSlugs: ['video-compressor', 'video-splitter', 'audio-converter'],
    seoTitle: 'Video Trimmer Online Free - Cut and Trim Video Clips | Vivexa Tools',
    seoDescription: 'Trim and cut videos online for free. Set start and end points and export clips with complete local privacy.'
  },
  {
    id: 'video-splitter',
    name: 'Video Splitter',
    slug: 'video-splitter',
    category: 'video',
    subcategory: 'Splitting',
    shortDescription: 'Split long videos into equal segments or custom clips for WhatsApp & social stories.',
    fullDescription: 'Split long videos into multiple shorter segments (e.g. 30-second clips for WhatsApp Status, Instagram Stories, or custom split points) directly in your browser.',
    searchKeywords: ['split video', 'whatsapp status 30s', 'instagram story split', 'cut video in parts'],
    icon: 'Layers',
    supportedInputFormats: ['.mp4', '.webm', '.mov'],
    supportedOutputFormats: ['.webm', '.mp4'],
    processingEngine: 'HTML5 Video Segment Engine',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload video to split',
        description: 'Select the video file you want to split.'
      },
      {
        step: 2,
        title: 'Select split duration or count',
        description: 'Choose preset 30-second intervals (ideal for WhatsApp/Instagram status) or set custom segment length in seconds.'
      },
      {
        step: 3,
        title: 'Process segments',
        description: 'Click "Split Video" to export each segment.'
      },
      {
        step: 4,
        title: 'Download clips',
        description: 'Save each clip to your device.'
      }
    ],
    faqs: [
      {
        question: 'Can I split a 2-minute video into 30-second chunks?',
        answer: 'Yes! Selecting 30-second intervals will automatically partition the video into 4 sequential 30-second clips.'
      }
    ],
    relatedToolSlugs: ['video-trimmer', 'video-compressor'],
    seoTitle: 'Video Splitter Online Free - Split Video for WhatsApp & Stories | Vivexa Tools',
    seoDescription: 'Split videos into 30-second status clips or custom durations online without server uploads.'
  },
  {
    id: 'video-compressor',
    name: 'Video Compressor',
    slug: 'video-compressor',
    category: 'video',
    subcategory: 'Compression',
    shortDescription: 'Compress video file size by adjusting resolution and bitrate.',
    fullDescription: 'Reduce heavy video file sizes for easy emailing and messaging. Downscale 4K and 1080p footage to 720p, 480p, or 360p, adjust video bitrate, and export compressed clips locally without quality destruction.',
    searchKeywords: ['compress video', 'reduce video size', 'smaller mp4', 'shrink video', 'video optimizer'],
    icon: 'Minimize2',
    supportedInputFormats: ['.mp4', '.webm', '.mov'],
    supportedOutputFormats: ['.webm', '.mp4'],
    processingEngine: 'Hardware-Accelerated Canvas & MediaRecorder',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload video',
        description: 'Select your video file.'
      },
      {
        step: 2,
        title: 'Select target resolution and bitrate',
        description: 'Choose 720p (HD, balanced), 480p (compact, for messaging), or 360p (ultra compact), and adjust video bitrate (0.5 Mbps to 2.5 Mbps).'
      },
      {
        step: 3,
        title: 'Compress video',
        description: 'Click "Start Compression". The browser plays and transcodes video frames at the new resolution.'
      },
      {
        step: 4,
        title: 'Compare size and download',
        description: 'Check the file size savings percentage and download your compressed video.'
      }
    ],
    faqs: [
      {
        question: 'Does video compression take longer on older computers or phones?',
        answer: 'Because video frame encoding uses client-side CPU/GPU resources, processing time depends on clip duration and hardware acceleration capabilities.'
      }
    ],
    relatedToolSlugs: ['video-trimmer', 'audio-compressor'],
    seoTitle: 'Video Compressor Online Free - Reduce Video File Size Privately | Vivexa Tools',
    seoDescription: 'Compress video file size online for free. Downscale resolution to 720p or 480p locally in your browser.'
  }
];
