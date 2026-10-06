import type { CSSProperties } from 'react';

export type FontChoice = 'inter' | 'system' | 'serif' | 'mono';

export type Theme = {
  accent: string;
  radius: number;
  font: FontChoice;
  mode: 'light' | 'dark';
  layout: 'split' | 'centered';
  showSocial: boolean;
};

export type Copy = {
  brand: string;
  title: string;
  subtitle: string;
  emailLabel: string;
  passwordLabel: string;
  forgot: string;
  remember: string;
  submit: string;
  loading: string;
  divider: string;
  signupPrompt: string;
  signupLink: string;
  errorTitle: string;
  errorBody: string;
  successTitle: string;
  tagline: string;
  taglineBody: string;
};

export const defaultTheme: Theme = {
  accent: '#4f46e5',
  radius: 12,
  font: 'inter',
  mode: 'light',
  layout: 'split',
  showSocial: true,
};

export const defaultCopy: Copy = {
  brand: 'Canvas',
  title: 'Welcome back',
  subtitle: 'Sign in to pick up where you left off.',
  emailLabel: 'Email',
  passwordLabel: 'Password',
  forgot: 'Forgot password?',
  remember: 'Keep me signed in',
  submit: 'Sign in',
  loading: 'Signing in…',
  divider: 'or continue with',
  signupPrompt: 'New here?',
  signupLink: 'Create an account',
  errorTitle: 'Those details don’t match',
  errorBody: 'Check your email and password, or reset your password.',
  successTitle: 'You’re signed in',
  tagline: 'Design, tweak and ship in one place.',
  taglineBody: 'Every screen side by side, with live controls for style and copy.',
};

export const accentPresets = ['#4f46e5', '#0ea5e9', '#10b981', '#f97316', '#e11d48', '#111827'];

export const fontStacks: Record<FontChoice, { label: string; stack: string }> = {
  inter: { label: 'Inter', stack: "'Inter', system-ui, sans-serif" },
  system: { label: 'System', stack: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" },
  serif: { label: 'Fraunces', stack: "'Fraunces', Georgia, serif" },
  mono: { label: 'JetBrains Mono', stack: "'JetBrains Mono', ui-monospace, monospace" },
};

function readableOn(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return '#ffffff';
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.4 ? '#0b0e14' : '#ffffff';
}

export function themeStyle(theme: Theme): CSSProperties {
  return {
    '--accent': theme.accent,
    '--on-accent': readableOn(theme.accent),
    '--radius': `${theme.radius}px`,
    '--font': fontStacks[theme.font].stack,
  } as CSSProperties;
}
