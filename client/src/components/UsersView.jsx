import { textFor } from '../i18n';
import { avatarFallback } from '../lib/app-helpers';

function UsersView({ currentUserId, onToggleShare, profiles, sharedRecipientIds, t }) {
  return (
    <>
      <section className="hero-card compact-hero">
        <p className="eyebrow">{textFor(t, 'menuUsers')}</p>
        <div className="hero-row">
          <div>
            <h2>{textFor(t, 'usersTitle')}</h2>
            <p>{textFor(t, 'usersCopy')}</p>
          </div>
        </div>
      </section>

      {profiles.length === 0 ? (
        <section className="catalog-card empty-panel">{textFor(t, 'usersEmpty')}</section>
      ) : (
        <section className="users-grid">
          {profiles.map((profile) => {
            const isShared = sharedRecipientIds.has(profile.id);
            const isSelf = profile.id === currentUserId;

            return (
              <article key={profile.id} className="catalog-card user-card">
                <div className="user-row">
                  <div className="avatar-fallback small-avatar">{avatarFallback(profile)}</div>
                  <div>
                    <h3>{profile.name || textFor(t, 'anonymousUser')}</h3>
                    <p>@{profile.username || 'username'}</p>
                  </div>
                </div>
                <div className="pill-row">
                  {isSelf ? <span className="pill private">You</span> : null}
                  {isShared ? <span className="pill shared">{textFor(t, 'sharedByYou')}</span> : null}
                </div>
                {!isSelf ? (
                  <button type="button" className="secondary-button" onClick={() => onToggleShare(profile)}>
                    {isShared ? textFor(t, 'unshareWithUser') : textFor(t, 'shareWithUser')}
                  </button>
                ) : null}
              </article>
            );
          })}
        </section>
      )}
    </>
  );
}

export default UsersView;
