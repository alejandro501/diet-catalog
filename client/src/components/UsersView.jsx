import { textFor } from '../i18n';
import { avatarFallback } from '../lib/app-helpers';

function UsersView({ currentUserId, profiles, t }) {
  return (
    <>
      <section className="catalog-card empty-panel">{textFor(t, 'usersCopy')}</section>

      {profiles.length === 0 ? (
        <section className="catalog-card empty-panel">{textFor(t, 'usersEmpty')}</section>
      ) : (
        <section className="users-grid">
          {profiles.map((profile) => {
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
                </div>
              </article>
            );
          })}
        </section>
      )}
    </>
  );
}

export default UsersView;
