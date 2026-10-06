import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { type Copy, type Theme, themeStyle } from './theme';
import { AlertIcon, AppleIcon, CheckIcon, EyeIcon, EyeOffIcon, GoogleIcon, LogoMark } from './icons';

export type Preview = 'default' | 'filled' | 'validation' | 'loading' | 'error' | 'success';

type Status = 'idle' | 'loading' | 'error' | 'success';
type FieldErrors = { email?: string; password?: string };

// Submitting this password simulates a rejected sign-in so the error state can be tried live.
export const WRONG_PASSWORD = 'wrongpass';
const DEMO_EMAIL = 'alex@example.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ERR_EMAIL_INVALID = 'Enter a valid email address.';
const ERR_PASSWORD_SHORT = 'Password must be at least 8 characters.';

function initialState(preview: Preview | undefined) {
  switch (preview) {
    case 'filled':
      return { email: DEMO_EMAIL, password: 'correct-horse', status: 'idle' as Status, errors: {} };
    case 'validation':
      return {
        email: 'alex@',
        password: '1234',
        status: 'idle' as Status,
        errors: { email: ERR_EMAIL_INVALID, password: ERR_PASSWORD_SHORT },
      };
    case 'loading':
      return { email: DEMO_EMAIL, password: 'correct-horse', status: 'loading' as Status, errors: {} };
    case 'error':
      return { email: DEMO_EMAIL, password: WRONG_PASSWORD, status: 'error' as Status, errors: {} };
    case 'success':
      return { email: DEMO_EMAIL, password: '', status: 'success' as Status, errors: {} };
    default:
      return { email: '', password: '', status: 'idle' as Status, errors: {} };
  }
}

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!email.trim()) errors.email = 'Enter your email address.';
  else if (!EMAIL_RE.test(email.trim())) errors.email = ERR_EMAIL_INVALID;
  if (!password) errors.password = 'Enter your password.';
  else if (password.length < 8) errors.password = ERR_PASSWORD_SHORT;
  return errors;
}

type Props = { theme: Theme; copy: Copy; preview?: Preview };

export function LoginScreen({ theme, copy, preview }: Props) {
  const init = initialState(preview);
  const [email, setEmail] = useState(init.email);
  const [password, setPassword] = useState(init.password);
  const [status, setStatus] = useState<Status>(init.status);
  const [errors, setErrors] = useState<FieldErrors>(init.errors);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const timer = useRef<number | undefined>(undefined);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const id = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const loading = status === 'loading';

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    const next = validate(email, password);
    setErrors(next);
    if (next.email || next.password) {
      setStatus('idle');
      (next.email ? emailRef : passwordRef).current?.focus();
      return;
    }
    setStatus('loading');
    timer.current = window.setTimeout(() => {
      setStatus(password === WRONG_PASSWORD ? 'error' : 'success');
    }, 1200);
  }

  function onEmailChange(value: string) {
    setEmail(value);
    if (errors.email) setErrors((x) => ({ ...x, email: undefined }));
    if (status === 'error') setStatus('idle');
  }

  function onPasswordChange(value: string) {
    setPassword(value);
    if (errors.password) setErrors((x) => ({ ...x, password: undefined }));
    if (status === 'error') setStatus('idle');
  }

  function signOut() {
    setPassword('');
    setErrors({});
    setStatus('idle');
  }

  return (
    <div className="login" data-mode={theme.mode} style={themeStyle(theme)}>
      <div className="login-shell" data-layout={theme.layout}>
        <aside className="brand-panel">
          <div className="brand-row brand-row--inverse">
            <LogoMark letter={copy.brand} />
            <span>{copy.brand}</span>
          </div>
          <div className="brand-copy">
            <h2>{copy.tagline}</h2>
            <p>{copy.taglineBody}</p>
          </div>
          <p className="brand-foot">© 2026 {copy.brand}</p>
        </aside>

        <main className="form-pane">
          <div className="card">
            <div className="brand-row brand-row--form">
              <LogoMark letter={copy.brand} />
              <span>{copy.brand}</span>
            </div>

            {status === 'success' ? (
              <div className="success" role="status">
                <div className="success-icon">
                  <CheckIcon />
                </div>
                <h1>{copy.successTitle}</h1>
                <p className="subtitle">
                  Signed in as <strong>{email}</strong>
                </p>
                <button type="button" className="btn btn-secondary" onClick={signOut}>
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <header className="heading">
                  <h1>{copy.title}</h1>
                  <p className="subtitle">{copy.subtitle}</p>
                </header>

                <form noValidate onSubmit={onSubmit} className="form">
                  {status === 'error' && (
                    <div className="alert" role="alert">
                      <AlertIcon />
                      <div>
                        <strong>{copy.errorTitle}</strong>
                        <span>{copy.errorBody}</span>
                      </div>
                    </div>
                  )}

                  <div className={`field${errors.email ? ' has-error' : ''}`}>
                    <label htmlFor={`${id}-email`}>{copy.emailLabel}</label>
                    <input
                      ref={emailRef}
                      id={`${id}-email`}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={email}
                      disabled={loading}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? `${id}-email-error` : undefined}
                      onChange={(e) => onEmailChange(e.target.value)}
                    />
                    {errors.email && (
                      <p className="field-error" id={`${id}-email-error`}>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className={`field${errors.password ? ' has-error' : ''}`}>
                    <div className="label-row">
                      <label htmlFor={`${id}-password`}>{copy.passwordLabel}</label>
                      <a href="#" className="link link--small" onClick={(e) => e.preventDefault()}>
                        {copy.forgot}
                      </a>
                    </div>
                    <div className="input-wrap">
                      <input
                        ref={passwordRef}
                        id={`${id}-password`}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        disabled={loading}
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? `${id}-password-error` : undefined}
                        onChange={(e) => onPasswordChange(e.target.value)}
                      />
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showPassword}
                        disabled={loading}
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="field-error" id={`${id}-password-error`}>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={remember}
                      disabled={loading}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span>{copy.remember}</span>
                  </label>

                  <button type="submit" className="btn btn-primary" disabled={loading} aria-busy={loading}>
                    {loading ? (
                      <>
                        <span className="spinner" aria-hidden />
                        {copy.loading}
                      </>
                    ) : (
                      copy.submit
                    )}
                  </button>
                </form>

                {theme.showSocial && (
                  <>
                    <div className="divider">
                      <span>{copy.divider}</span>
                    </div>
                    <div className="social">
                      <button type="button" className="btn btn-secondary" disabled={loading}>
                        <GoogleIcon />
                        Google
                      </button>
                      <button type="button" className="btn btn-secondary" disabled={loading}>
                        <AppleIcon />
                        Apple
                      </button>
                    </div>
                  </>
                )}

                <p className="signup">
                  {copy.signupPrompt}{' '}
                  <a href="#" className="link" onClick={(e) => e.preventDefault()}>
                    {copy.signupLink}
                  </a>
                </p>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
