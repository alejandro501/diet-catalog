import { textFor, translations } from '../i18n';

function AuthScreen({
  authMode,
  authValues,
  isSubmitting,
  language,
  languageOptions,
  message,
  onChangeLanguage,
  onSubmit,
  setAuthMode,
  setAuthValues,
  t,
}) {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="topbar auth-topbar">
          <label className="language-control topbar-language auth-language">
            <span>{textFor(t, 'language')}</span>
            <select value={language} onChange={(event) => onChangeLanguage(event.target.value)}>
              {languageOptions.map((option) => (
                <option key={option} value={option}>
                  {t.languages?.[option] ?? translations.en.languages[option]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="eyebrow">{textFor(t, 'appTitle')}</p>
        <h1>{textFor(t, 'authTitle')}</h1>
        <p className="auth-copy">{textFor(t, 'authCopy')}</p>

        <div className="auth-toggle-row">
          <button
            type="button"
            className={authMode === 'sign-in' ? 'auth-toggle active' : 'auth-toggle'}
            onClick={() => setAuthMode('sign-in')}
          >
            {textFor(t, 'signIn')}
          </button>
          <button
            type="button"
            className={authMode === 'sign-up' ? 'auth-toggle active' : 'auth-toggle'}
            onClick={() => setAuthMode('sign-up')}
          >
            {textFor(t, 'signUp')}
          </button>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            <span>{textFor(t, 'email')}</span>
            <input
              type="email"
              value={authValues.email}
              onChange={(event) =>
                setAuthValues((current) => ({ ...current, email: event.target.value }))
              }
              required
            />
          </label>

          <label>
            <span>{textFor(t, 'password')}</span>
            <input
              type="password"
              value={authValues.password}
              onChange={(event) =>
                setAuthValues((current) => ({ ...current, password: event.target.value }))
              }
              required
              minLength={6}
            />
          </label>

          {authMode === 'sign-up' ? (
            <label>
              <span>{textFor(t, 'confirmPassword')}</span>
              <input
                type="password"
                value={authValues.confirmPassword}
                onChange={(event) =>
                  setAuthValues((current) => ({ ...current, confirmPassword: event.target.value }))
                }
                required
                minLength={6}
              />
            </label>
          ) : null}

          <button type="submit" disabled={isSubmitting}>
            {authMode === 'sign-in' ? textFor(t, 'signIn') : textFor(t, 'signUp')}
          </button>
        </form>

        {message ? <p className="status-message">{message}</p> : null}
      </section>
    </main>
  );
}

export default AuthScreen;
