import { textFor } from '../i18n';
import { avatarFallback } from '../lib/app-helpers';

function ProfileView({ onSave, profileDraft, savingProfile, setProfileDraft, t }) {
  return (
    <section className="profile-grid">
      <article className="catalog-card profile-card">
        <p className="eyebrow">{textFor(t, 'menuProfile')}</p>
        <h2>{textFor(t, 'profileTitle')}</h2>
        <p className="profile-copy">{textFor(t, 'profileCopy')}</p>
        <div className="profile-preview">
          <div className="avatar-fallback">{avatarFallback(profileDraft)}</div>
          <div>
            <strong>{profileDraft.name || textFor(t, 'anonymousUser')}</strong>
            <span>@{profileDraft.username || 'username'}</span>
          </div>
        </div>
      </article>

      <article className="catalog-card profile-card">
        <div className="field-grid">
          <label className="profile-field">
            <span>{textFor(t, 'profileName')}</span>
            <input
              type="text"
              value={profileDraft.name}
              placeholder={textFor(t, 'profileNamePlaceholder')}
              onChange={(event) => setProfileDraft((current) => ({ ...current, name: event.target.value }))}
            />
          </label>

          <label className="profile-field">
            <span>{textFor(t, 'profileUsername')}</span>
            <input
              type="text"
              value={profileDraft.username}
              placeholder={textFor(t, 'profileUsernamePlaceholder')}
              onChange={(event) =>
                setProfileDraft((current) => ({ ...current, username: event.target.value }))
              }
            />
          </label>

          <label className="share-toggle field-span">
            <input
              type="checkbox"
              checked={profileDraft.isPublic === true}
              onChange={(event) =>
                setProfileDraft((current) => ({ ...current, isPublic: event.target.checked }))
              }
            />
            <div>
              <strong>{textFor(t, 'profilePublicLabel')}</strong>
              <span>{textFor(t, 'profilePublicHelp')}</span>
            </div>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="primary-button save-button" onClick={onSave} disabled={savingProfile}>
            {textFor(t, 'profileSave')}
          </button>
        </div>
      </article>
    </section>
  );
}

export default ProfileView;
