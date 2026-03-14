import { textFor } from '../i18n';

function SettingsView({
  dietDrafts,
  foodCategoryDrafts,
  newDietName,
  newFoodCategory,
  onAddDietType,
  onAddFoodCategory,
  onDeleteFoodCategory,
  onDeleteDietType,
  onEditDietType,
  onEditFoodCategory,
  onSaveDietTypes,
  onToggleDietVisibility,
  setNewDietName,
  setNewFoodCategory,
  t,
}) {
  return (
    <section className="settings-page">
      <article className="catalog-card settings-card">
        <p className="eyebrow">{textFor(t, 'menuSettings')}</p>
        <div className="settings-columns">
          <section className="settings-column">
            <h2>{textFor(t, 'settingsFoodCategories')}</h2>
            <div className="settings-list">
              {foodCategoryDrafts.map((category) => (
                <div key={category.id} className="settings-row">
                  <div className="settings-row-main">
                    <input
                      type="text"
                      value={category.name}
                      onChange={(event) => onEditFoodCategory(category.id, event.target.value)}
                    />
                  </div>
                  <div className="settings-actions">
                    <button type="button" className="secondary-button" onClick={() => onDeleteFoodCategory(category.id)}>
                      {textFor(t, 'settingsDelete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="add-form settings-form">
              <input
                type="text"
                value={newFoodCategory}
                placeholder={textFor(t, 'settingsCategoryNamePlaceholder')}
                onChange={(event) => setNewFoodCategory(event.target.value)}
              />
              <button type="button" onClick={onAddFoodCategory}>
                {textFor(t, 'settingsAddCategory')}
              </button>
            </div>
          </section>

          <section className="settings-column">
            <h2>{textFor(t, 'settingsDietTypes')}</h2>
            <div className="settings-list">
              {dietDrafts.map((dietType) => (
                <div key={dietType.id} className="settings-row">
                  <div className="settings-row-main">
                    <div className="settings-language-grid">
                      <input
                        type="text"
                        value={dietType.names?.en ?? dietType.name}
                        placeholder="English"
                        onChange={(event) => onEditDietType(dietType.id, 'en', event.target.value)}
                      />
                      <input
                        type="text"
                        value={dietType.names?.hu ?? ''}
                        placeholder="Magyar"
                        onChange={(event) => onEditDietType(dietType.id, 'hu', event.target.value)}
                      />
                      <input
                        type="text"
                        value={dietType.names?.es ?? ''}
                        placeholder="Español"
                        onChange={(event) => onEditDietType(dietType.id, 'es', event.target.value)}
                      />
                      <input
                        type="text"
                        value={dietType.names?.it ?? ''}
                        placeholder="Italiano"
                        onChange={(event) => onEditDietType(dietType.id, 'it', event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="settings-actions">
                    <label className="toggle-inline">
                      <input
                        type="checkbox"
                        checked={dietType.visible}
                        onChange={() => onToggleDietVisibility(dietType.id)}
                      />
                      <span>{textFor(t, 'settingsShowDiet')}</span>
                    </label>
                    <button type="button" className="secondary-button" onClick={() => onDeleteDietType(dietType.id)}>
                      {textFor(t, 'settingsDelete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="add-form settings-form">
              <div className="settings-language-grid">
                <input
                  type="text"
                  value={newDietName.en}
                  placeholder={`${textFor(t, 'settingsDietNamePlaceholder')} (EN)`}
                  onChange={(event) => setNewDietName((current) => ({ ...current, en: event.target.value }))}
                />
                <input
                  type="text"
                  value={newDietName.hu}
                  placeholder="Magyar"
                  onChange={(event) => setNewDietName((current) => ({ ...current, hu: event.target.value }))}
                />
                <input
                  type="text"
                  value={newDietName.es}
                  placeholder="Español"
                  onChange={(event) => setNewDietName((current) => ({ ...current, es: event.target.value }))}
                />
                <input
                  type="text"
                  value={newDietName.it}
                  placeholder="Italiano"
                  onChange={(event) => setNewDietName((current) => ({ ...current, it: event.target.value }))}
                />
              </div>
              <button type="button" onClick={onAddDietType}>
                {textFor(t, 'settingsAddDiet')}
              </button>
            </div>
          </section>
        </div>

        <div className="form-actions settings-save-row">
          <button type="button" className="primary-button save-button" onClick={onSaveDietTypes}>
            {textFor(t, 'settingsSave')}
          </button>
        </div>
      </article>
    </section>
  );
}

export default SettingsView;
