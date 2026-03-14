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
    <section className="profile-grid">
      <article className="catalog-card profile-card">
        <p className="eyebrow">{textFor(t, 'menuSettings')}</p>
        <h2>{textFor(t, 'settingsTitle')}</h2>
        <p className="profile-copy">{textFor(t, 'settingsCopy')}</p>
      </article>

      <article className="catalog-card profile-card">
        <div className="settings-list">
          {dietDrafts.map((dietType) => (
            <div key={dietType.id} className="settings-row">
              <div className="settings-row-main">
                <input
                  type="text"
                  value={dietType.name}
                  onChange={(event) => onEditDietType(dietType.id, event.target.value)}
                />
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
          <input
            type="text"
            value={newDietName}
            placeholder={textFor(t, 'settingsDietNamePlaceholder')}
            onChange={(event) => setNewDietName(event.target.value)}
          />
          <button type="button" onClick={onAddDietType}>
            {textFor(t, 'settingsAddDiet')}
          </button>
        </div>

        <p className="eyebrow">{textFor(t, 'settingsFoodCategories')}</p>
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

        <div className="form-actions">
          <button type="button" className="primary-button save-button" onClick={onSaveDietTypes}>
            {textFor(t, 'settingsSave')}
          </button>
        </div>
      </article>
    </section>
  );
}

export default SettingsView;
