import { defaultDietTypes } from '../catalog';
import { textFor } from '../i18n';
import { buildSharedDietTypes } from '../lib/firestore-data';
import CatalogView from './CatalogView';

function SharedListsView({
  activeDiet,
  loading,
  onSelectProfile,
  selectedProfile,
  setActiveDiet,
  sharedCatalog,
  sharedProfiles,
  t,
}) {
  return (
    <div className="shared-layout">
      <section className="catalog-card shared-sidebar">
        <p className="eyebrow">{textFor(t, 'menuShared')}</p>
        <h2>{textFor(t, 'sharedTitle')}</h2>
        <p className="profile-copy">{textFor(t, 'sharedCopy')}</p>

        {sharedProfiles.length === 0 ? (
          <div className="empty-state">{textFor(t, 'sharedEmpty')}</div>
        ) : (
          <div className="shared-list">
            {sharedProfiles.map((profile) => (
              <button
                key={profile.id}
                type="button"
                className={selectedProfile?.id === profile.id ? 'shared-link active' : 'shared-link'}
                onClick={() => onSelectProfile(profile)}
              >
                <span>{profile.name || textFor(t, 'anonymousUser')}</span>
                <small>@{profile.username || 'username'}</small>
              </button>
            ))}
          </div>
        )}
      </section>

      <div className="shared-content">
        {!selectedProfile ? (
          <section className="catalog-card empty-panel">{textFor(t, 'sharedSelectPrompt')}</section>
        ) : loading ? (
          <section className="catalog-card empty-panel">{textFor(t, 'sharedLoading')}</section>
        ) : (
          <CatalogView
            activeDiet={activeDiet}
            catalog={sharedCatalog}
            dietTypes={buildSharedDietTypes(sharedCatalog)}
            drafts={{
              foods: { name: '', category: 'Fruits' },
              drinks: { name: '', category: 'Water' },
              smoothies: { name: '', category: 'Smoothie' },
              vitamins: { name: '', category: 'Vitamin' },
            }}
            filters={{ foods: 'All', drinks: 'All', smoothies: 'All', vitamins: 'All' }}
            foodCategories={[]}
            handleAddItem={() => {}}
            handleAddSmoothie={() => {}}
            handleAddSmoothieIngredient={() => {}}
            handleDraftChange={() => {}}
            handleRemoveItem={() => {}}
            handleRemoveSmoothie={() => {}}
            handleRemoveSmoothieIngredient={() => {}}
            readOnly
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
