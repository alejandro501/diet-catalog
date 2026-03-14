import { textFor } from '../i18n';

function ContactView({ contactDraft, onChange, onSubmit, t }) {
  return (
    <section className="contact-layout">
      <article className="catalog-card contact-intro-card">
        <p className="profile-copy">{textFor(t, 'contactCopy')}</p>
      </article>

      <article className="catalog-card profile-card">
        <div className="field-grid">
          <label className="profile-field">
            <span>{textFor(t, 'contactName')}</span>
            <input
              type="text"
              value={contactDraft.name}
              placeholder={textFor(t, 'contactNamePlaceholder')}
              maxLength={50}
              onChange={(event) => onChange('name', event.target.value)}
            />
          </label>

          <label className="profile-field">
            <span>{textFor(t, 'contactReplyTo')}</span>
            <input
              type="email"
              value={contactDraft.replyTo}
              placeholder={textFor(t, 'contactReplyToPlaceholder')}
              autoComplete="off"
              maxLength={50}
              onChange={(event) => onChange('replyTo', event.target.value)}
            />
          </label>

          <label className="profile-field">
            <span>{textFor(t, 'contactSubject')}</span>
            <input
              type="text"
              value={contactDraft.subject}
              placeholder={textFor(t, 'contactSubjectPlaceholder')}
              maxLength={50}
              onChange={(event) => onChange('subject', event.target.value)}
            />
          </label>

          <label className="profile-field field-span">
            <span>
              {textFor(t, 'contactMessage')} <strong className="required-mark">*</strong>
            </span>
            <textarea
              value={contactDraft.message}
              placeholder={textFor(t, 'contactMessagePlaceholder')}
              onChange={(event) => onChange('message', event.target.value)}
              rows={7}
            />
            <small className="field-counter">{contactDraft.message.length}/1000</small>
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
