import { textFor } from '../i18n';

function ContactView({ contactDraft, onChange, onSubmit, t }) {
  return (
    <section className="profile-grid">
      <article className="catalog-card profile-card">
        <p className="eyebrow">{textFor(t, 'contactTitle')}</p>
        <h2>{textFor(t, 'contactHeading')}</h2>
        <p className="profile-copy">{textFor(t, 'contactCopy')}</p>
      </article>

      <article className="catalog-card profile-card">
        <div className="field-grid">
          <label className="profile-field">
            <span>{textFor(t, 'contactReplyTo')}</span>
            <input
              type="email"
              value={contactDraft.replyTo}
              placeholder={textFor(t, 'contactReplyToPlaceholder')}
              onChange={(event) => onChange('replyTo', event.target.value)}
            />
          </label>

          <label className="profile-field">
            <span>{textFor(t, 'contactSubject')}</span>
            <input
              type="text"
              value={contactDraft.subject}
              placeholder={textFor(t, 'contactSubjectPlaceholder')}
              onChange={(event) => onChange('subject', event.target.value)}
            />
          </label>

          <label className="profile-field field-span">
            <span>{textFor(t, 'contactMessage')}</span>
            <textarea
              value={contactDraft.message}
              placeholder={textFor(t, 'contactMessagePlaceholder')}
              onChange={(event) => onChange('message', event.target.value)}
              rows={7}
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="primary-button save-button" onClick={onSubmit}>
            {textFor(t, 'contactSend')}
          </button>
        </div>
      </article>
    </section>
  );
}

export default ContactView;
