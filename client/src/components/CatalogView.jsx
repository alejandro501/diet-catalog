import { useMemo, useState } from 'react';
import { fadeLimit, filterOptions, sectionNames } from '../catalog';
import { textFor, translations } from '../i18n';
import { localizedDietDescription, localizedDietName } from '../lib/app-helpers';
import SmoothieSection from './SmoothieSection';

function CatalogView({
  activeDiet,
  catalog,
  dietTypes,
  drafts,
  filters,
  foodCategories,
  handleAddItem,
  handleDraftChange,
  handleRemoveItem,
  handleAddSmoothie,
  handleRemoveSmoothie,
  handleAddSmoothieIngredient,
  handleRemoveSmoothieIngredient,
  language,
  readOnly = false,
  setActiveDiet,
  setFilters,
  t,
}) {
  const activeCatalog = catalog[activeDiet] ?? { foods: [], drinks: [], smoothies: [], vitamins: [], spices: [] };
  const visibleDietTypes = dietTypes.filter((dietType) => dietType.visible);
  const activeDietMeta = dietTypes.find((dietType) => dietType.name === activeDiet);
  const activeFoodOptions = ['All', ...foodCategories];
  const [expandedSections, setExpandedSections] = useState({});

  const filteredSections = useMemo(() => {
    return sectionNames.filter((section) => section !== 'smoothies').reduce((acc, section) => {
      const selectedFilter = filters[section] ?? 'All';
      const currentSection = activeCatalog[section] ?? [];
      acc[section] = currentSection.filter((item) => selectedFilter === 'All' || item.category === selectedFilter);
      return acc;
    }, {});
  }, [activeCatalog, filters]);

  return (
    <section className="catalog-layout">
      <article className="catalog-card diet-selector-panel">
        <p className="eyebrow">{textFor(t, 'dietNavigation')}</p>
        <div className="diet-selector-list">
          {visibleDietTypes.map((dietType) => (
            <button
              key={dietType.id}
              type="button"
              className={dietType.name === activeDiet ? 'diet-link active' : 'diet-link'}
              onClick={() => setActiveDiet(dietType.name)}
            >
              <span className="diet-link-title">{localizedDietName(dietType, language)}</span>
              <span className="diet-link-meta">
                <strong>
                  {(catalog[dietType.name]?.foods.length ?? 0) +
                    (catalog[dietType.name]?.drinks.length ?? 0) +
                    (catalog[dietType.name]?.smoothies.length ?? 0) +
                    (catalog[dietType.name]?.vitamins.length ?? 0) +
                    (catalog[dietType.name]?.spices.length ?? 0)}
                </strong>
                <small>{textFor(t, 'items')}</small>
              </span>
            </button>
          ))}
        </div>
      </article>

      <div className="catalog-main">
        <section className="hero-card">
          <div className="hero-row">
            <div>
              <h2>{localizedDietName(activeDietMeta, language) || activeDiet}</h2>
              {localizedDietDescription(activeDietMeta, language) ? (
                <p>{localizedDietDescription(activeDietMeta, language)}</p>
              ) : null}
            </div>
            <div className="hero-stats">
              <div>
                <strong>{activeCatalog.foods.length}</strong>
                <span>{textFor(t, 'foods')}</span>
              </div>
              <div>
                <strong>{activeCatalog.drinks.length}</strong>
                <span>{textFor(t, 'drinks')}</span>
              </div>
              <div>
                <strong>{activeCatalog.vitamins.length}</strong>
                <span>{textFor(t, 'vitamins')}</span>
              </div>
              <div>
                <strong>{activeCatalog.smoothies.length}</strong>
                <span>{textFor(t, 'smoothies')}</span>
              </div>
              <div>
                <strong>{activeCatalog.spices.length}</strong>
                <span>{textFor(t, 'spices')}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section-grid">
          {sectionNames.filter((section) => section !== 'smoothies').map((section) => {
            const sectionItems = filteredSections[section];
            const isExpanded = expandedSections[section] ?? false;
            const shouldClamp = sectionItems.length > fadeLimit && !isExpanded;
            const visibleItems = shouldClamp ? sectionItems.slice(0, fadeLimit) : sectionItems;

            return (
            <article key={section} className="catalog-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">{textFor(t, 'section')}</p>
                  <h3>{textFor(t, section)}</h3>
                </div>
                {(section === 'foods' ? activeFoodOptions : filterOptions[section]).length > 1 ? (
                  <label className="filter-control">
                    <span>{textFor(t, 'filter')}</span>
                    <select
                      value={filters[section] ?? 'All'}
                      disabled={readOnly}
                      onChange={(event) =>
                        setFilters((current) => ({
                          ...current,
                          [section]: event.target.value,
                        }))
                      }
                    >
                      {(section === 'foods' ? activeFoodOptions : filterOptions[section]).map((option) => (
                        <option key={option} value={option}>
                          {t.filters?.[option] ?? translations.en.filters[option] ?? option}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
              </div>

              {!readOnly ? (
                <div className="add-form compact-form">
                  <input
                    type="text"
                    value={drafts[section].name}
                    placeholder={t.addPlaceholder?.[section] ?? translations.en.addPlaceholder[section]}
                    onChange={(event) => handleDraftChange(section, 'name', event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleAddItem(section);
                      }
                    }}
                  />
                  <select
                    value={drafts[section].category}
                    onChange={(event) => handleDraftChange(section, 'category', event.target.value)}
                  >
                    {(section === 'foods' ? foodCategories : filterOptions[section].filter((option) => option !== 'All')).map((option) => (
                      <option key={option} value={option}>
                        {t.filters?.[option] ?? translations.en.filters[option] ?? option}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={() => handleAddItem(section)}>
                    {textFor(t, 'add')}
                  </button>
                </div>
              ) : null}

              <ul className="item-list">
                {visibleItems.length === 0 ? (
                  <li className="empty-state">{textFor(t, 'noItems')}</li>
                ) : (
                  visibleItems.map((item) => (
                    <li key={item.id} className="item-row">
                      <div>
                        <strong>{item.name}</strong>
                        <span>
                          {t.filters?.[item.category] ??
                            translations.en.filters[item.category] ??
                            item.category}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => handleRemoveItem(section, item.id)}
                      >
                        {textFor(t, 'remove')}
                      </button>
                    </li>
                  ))
                )}
              </ul>

              {sectionItems.length > fadeLimit ? (
                <div className={shouldClamp ? 'section-fade-wrap active' : 'section-fade-wrap'}>
                  <button
                    type="button"
                    className="secondary-button section-toggle"
                    onClick={() =>
                      setExpandedSections((current) => ({
                        ...current,
                        [section]: !isExpanded,
                      }))
                    }
                  >
                    {isExpanded ? textFor(t, 'sectionCollapse') : textFor(t, 'sectionExpand')}
                  </button>
                </div>
              ) : null}
            </article>
          )})}

          <SmoothieSection
            smoothies={activeCatalog.smoothies}
            onAddSmoothie={handleAddSmoothie}
            onRemoveSmoothie={handleRemoveSmoothie}
            onAddIngredient={handleAddSmoothieIngredient}
            onRemoveIngredient={handleRemoveSmoothieIngredient}
            language={language}
            readOnly={readOnly}
            t={t}
          />
        </section>
      </div>
    </section>
  );
}

export default CatalogView;
