import { textFor } from '../i18n';
import CatalogView from './CatalogView';

function SharedListsView({
  activeDiet,
  dietTypes,
  language,
  loading,
  onSelectShare,
  selectedShare,
  setActiveDiet,
  sharedCatalog,
  sharedEntries,
  t,
}) {
  return (
    <div className="shared-layout">
      <section className="catalog-card shared-sidebar">
        <p className="eyebrow">{textFor(t, 'menuShared')}</p>
        <h2>{textFor(t, 'sharedTitle')}</h2>
        <p className="profile-copy">{textFor(t, 'sharedCopy')}</p>

        {sharedEntries.length === 0 ? (
          <div className="empty-state">{textFor(t, 'sharedEmpty')}</div>
        ) : (
          <div className="shared-list">
            {sharedEntries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={selectedShare?.id === entry.id ? 'shared-link active' : 'shared-link'}
                onClick={() => onSelectShare(entry)}
              >
                <span>{entry.ownerName || entry.ownerUsername || textFor(t, 'anonymousUser')}</span>
                <small>{entry.dietLabel}</small>
              </button>
            ))}
          </div>
        )}
      </section>

      <div className="shared-content">
        {!selectedShare ? (
          <section className="catalog-card empty-panel">{textFor(t, 'sharedSelectPrompt')}</section>
        ) : loading ? (
          <section className="catalog-card empty-panel">{textFor(t, 'sharedLoading')}</section>
        ) : (
          <CatalogView
            activeDiet={activeDiet}
            catalog={sharedCatalog}
            dietTypes={dietTypes}
            drafts={{
              foods: { name: '', category: 'Fruits' },
              drinks: { name: '', category: 'Water' },
              smoothies: { name: '', category: 'Smoothie' },
              vitamins: { name: '', category: 'Vitamin' },
              spices: { name: '', category: 'Herb' },
            }}
            filters={{ foods: 'All', drinks: 'All', smoothies: 'All', vitamins: 'All', spices: 'All' }}
            foodCategories={[]}
            handleAddItem={() => {}}
            handleAddSmoothie={() => {}}
            handleAddSmoothieIngredient={() => {}}
            handleDraftChange={() => {}}
            handleRemoveItem={() => {}}
            handleRemoveSmoothie={() => {}}
            handleRemoveSmoothieIngredient={() => {}}
            language={language}
            readOnly
            shareCandidates={[]}
            sharedRecipients={[]}
            setActiveDiet={setActiveDiet}
            setFilters={() => {}}
            t={t}
          />
        )}
      </div>
    </div>
  );
}

export default SharedListsView;
