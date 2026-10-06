import { useState, type ReactNode } from 'react';
import { LoginScreen, WRONG_PASSWORD, type Preview } from './LoginScreen';
import { accentPresets, type Copy, defaultCopy, defaultTheme, fontStacks, type FontChoice, type Theme } from './theme';

type Frame = { preview: Preview; label: string; width: number; height: number };

const mobileFrames: Frame[] = [
  { preview: 'default', label: 'Empty', width: 390, height: 800 },
  { preview: 'filled', label: 'Filled', width: 390, height: 800 },
  { preview: 'validation', label: 'Validation errors', width: 390, height: 800 },
  { preview: 'loading', label: 'Loading', width: 390, height: 800 },
  { preview: 'error', label: 'Wrong credentials', width: 390, height: 800 },
  { preview: 'success', label: 'Signed in', width: 390, height: 800 },
];

const desktopFrames: Frame[] = [
  { preview: 'default', label: 'Desktop', width: 1280, height: 800 },
  { preview: 'error', label: 'Desktop, wrong credentials', width: 1280, height: 800 },
];

const copyGroups: { title: string; keys: (keyof Copy)[] }[] = [
  { title: 'Header', keys: ['brand', 'title', 'subtitle'] },
  { title: 'Form', keys: ['emailLabel', 'passwordLabel', 'forgot', 'remember', 'submit', 'loading'] },
  { title: 'Footer', keys: ['divider', 'signupPrompt', 'signupLink'] },
  { title: 'States', keys: ['errorTitle', 'errorBody', 'successTitle'] },
  { title: 'Brand panel', keys: ['tagline', 'taglineBody'] },
];

function humanize(key: string) {
  const s = key.replace(/([A-Z])/g, ' $1').toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

type Props = {
  theme: Theme;
  copy: Copy;
  setTheme: (t: Theme) => void;
  setCopy: (c: Copy) => void;
};

export function Canvas({ theme, copy, setTheme, setCopy }: Props) {
  const [zoom, setZoom] = useState(0.6);
  const [copied, setCopied] = useState(false);
  const patch = (p: Partial<Theme>) => setTheme({ ...theme, ...p });

  async function exportJson() {
    await navigator.clipboard.writeText(JSON.stringify({ theme, copy }, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="canvas">
      <aside className="panel">
        <div className="panel-head">
          <h1>Login screen</h1>
          <a className="panel-link" href="#/">
            Open live screen ↗
          </a>
        </div>

        <Section title="Style">
          <Control label="Accent">
            <div className="swatches">
              {accentPresets.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`swatch${theme.accent === c ? ' is-active' : ''}`}
                  style={{ background: c }}
                  aria-label={`Accent ${c}`}
                  onClick={() => patch({ accent: c })}
                />
              ))}
              <input
                type="color"
                className="color-input"
                value={theme.accent}
                aria-label="Custom accent"
                onChange={(e) => patch({ accent: e.target.value })}
              />
            </div>
          </Control>
          <Control label={`Corner radius · ${theme.radius}px`}>
            <input
              type="range"
              min={0}
              max={24}
              value={theme.radius}
              onChange={(e) => patch({ radius: Number(e.target.value) })}
            />
          </Control>
          <Control label="Font">
            <select value={theme.font} onChange={(e) => patch({ font: e.target.value as FontChoice })}>
              {Object.entries(fontStacks).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </Control>
          <Control label="Mode">
            <Segmented
              value={theme.mode}
              options={[
                ['light', 'Light'],
                ['dark', 'Dark'],
              ]}
              onChange={(mode) => patch({ mode })}
            />
          </Control>
          <Control label="Desktop layout">
            <Segmented
              value={theme.layout}
              options={[
                ['split', 'Split'],
                ['centered', 'Centered card'],
              ]}
              onChange={(layout) => patch({ layout })}
            />
          </Control>
          <label className="toggle">
            <input type="checkbox" checked={theme.showSocial} onChange={(e) => patch({ showSocial: e.target.checked })} />
            <span>Social sign-in buttons</span>
          </label>
        </Section>

        {copyGroups.map((g) => (
          <Section key={g.title} title={`Copy · ${g.title}`}>
            {g.keys.map((k) => (
              <Control key={k} label={humanize(k)}>
                <input type="text" value={copy[k]} onChange={(e) => setCopy({ ...copy, [k]: e.target.value })} />
              </Control>
            ))}
          </Section>
        ))}

        <div className="panel-actions">
          <button type="button" className="panel-btn" onClick={exportJson}>
            {copied ? 'Copied' : 'Copy JSON'}
          </button>
          <button
            type="button"
            className="panel-btn panel-btn--ghost"
            onClick={() => {
              setTheme(defaultTheme);
              setCopy(defaultCopy);
            }}
          >
            Reset
          </button>
        </div>
      </aside>

      <div className="board">
        <div className="board-bar">
          <span>
            Frames are live: type, submit, toggle. Password <code>{WRONG_PASSWORD}</code> triggers the error state.
          </span>
          <label className="zoom">
            Zoom
            <input type="range" min={0.3} max={1} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
            <span>{Math.round(zoom * 100)}%</span>
          </label>
        </div>
        <h2 className="board-title">Mobile · 390</h2>
        <div className="frames">
          {mobileFrames.map((f) => (
            <FrameView key={f.preview} frame={f} zoom={zoom} theme={theme} copy={copy} />
          ))}
        </div>
        <h2 className="board-title">Desktop · 1280</h2>
        <div className="frames">
          {desktopFrames.map((f) => (
            <FrameView key={f.preview} frame={f} zoom={zoom * 0.6} theme={theme} copy={copy} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FrameView({ frame, zoom, theme, copy }: { frame: Frame; zoom: number; theme: Theme; copy: Copy }) {
  return (
    <figure className="frame">
      <figcaption>{frame.label}</figcaption>
      <div className="frame-outer" style={{ width: frame.width * zoom, height: frame.height * zoom }}>
        <div
          className="frame-inner"
          style={{ width: frame.width, height: frame.height, transform: `scale(${zoom})` }}
        >
          <LoginScreen theme={theme} copy={copy} preview={frame.preview} />
        </div>
      </div>
    </figure>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="section" open>
      <summary>{title}</summary>
      <div className="section-body">{children}</div>
    </details>
  );
}

function Control({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="control">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
}) {
  return (
    <div className="segmented" role="radiogroup">
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          className={value === v ? 'is-active' : ''}
          onClick={() => onChange(v)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
