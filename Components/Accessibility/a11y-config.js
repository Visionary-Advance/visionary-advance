// Central config for the accessibility widget.
// Settings are a flat object persisted to localStorage and mirrored onto
// <html> as classes / CSS variables by A11yProvider.

export const STORAGE_KEY = 'va-a11y-settings'

export const DEFAULT_SETTINGS = {
  // Content
  fontScale: 1, // 1 | 1.1 | 1.25 | 1.4 | 1.6
  lineHeight: 0, // 0 off | 1 | 2 | 3
  letterSpacing: 0, // 0 off | 1 | 2 | 3
  dyslexiaFont: false,
  readableFont: false,
  highlightLinks: false,
  highlightHeadings: false,

  // Color
  contrast: 'off', // off | dark | light
  invert: false,
  grayscale: false,
  saturation: 'off', // off | low | high

  // Tools / orientation
  stopAnimations: false,
  bigCursor: false,
  readingGuide: false,
  readingMask: false,
  highlightFocus: false,
  hideImages: false,
  tts: false, // text-to-speech mode (click text to read)
}

// One-click profiles bundle several settings. Selecting a profile merges its
// patch over current settings; toggling it again reverts those keys to default.
export const PROFILES = [
  {
    id: 'seizure-safe',
    label: 'Seizure Safe',
    desc: 'Stops motion and reduces flashing',
    icon: 'bolt',
    patch: { stopAnimations: true, saturation: 'low' },
  },
  {
    id: 'vision-impaired',
    label: 'Vision Impaired',
    desc: 'Larger text and higher contrast',
    icon: 'eye',
    patch: { fontScale: 1.4, lineHeight: 2, contrast: 'dark', highlightLinks: true },
  },
  {
    id: 'adhd-friendly',
    label: 'ADHD Friendly',
    desc: 'Reading mask to reduce distractions',
    icon: 'target',
    patch: { readingMask: true, stopAnimations: true, highlightLinks: true },
  },
  {
    id: 'dyslexia-friendly',
    label: 'Dyslexia Friendly',
    desc: 'Dyslexia font with extra spacing',
    icon: 'book',
    patch: { dyslexiaFont: true, lineHeight: 2, letterSpacing: 1 },
  },
  {
    id: 'low-vision',
    label: 'Low Vision',
    desc: 'Maximum text size and spacing',
    icon: 'plus',
    patch: { fontScale: 1.6, lineHeight: 3, letterSpacing: 2, highlightLinks: true },
  },
  {
    id: 'keyboard-nav',
    label: 'Keyboard Nav',
    desc: 'Strong visible focus outlines',
    icon: 'keyboard',
    patch: { highlightFocus: true, highlightLinks: true },
  },
]

// Stepper helpers — cycle through allowed values.
export const FONT_SCALES = [1, 1.1, 1.25, 1.4, 1.6]
export const LEVELS = [0, 1, 2, 3]

export function isProfileActive(settings, profile) {
  return Object.entries(profile.patch).every(([k, v]) => settings[k] === v)
}
