import { useState } from 'react';
import { textFor } from '../i18n';

function SmoothieSection({
  smoothies,
  onAddSmoothie,
  onRemoveSmoothie,
  onAddIngredient,
  onRemoveIngredient,
  readOnly,
  t,
}) {
  const [draftName, setDraftName] = useState('');
  const [draftIngredient, setDraftIngredient] = useState('');
  const [draftIngredients, setDraftIngredients] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  function handleQueueIngredient() {
    const nextIngredient = draftIngredient.trim();
    if (!nextIngredient) {
      return;
    }

    setDraftIngredients((current) => [...current, nextIngredient]);
    setDraftIngredient('');
  }

  function handleRemoveQueuedIngredient(index) {
    setDraftIngredients((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function handleSaveSmoothie() {
    const name = draftName.trim();
    if (!name) {
      return;
    }

    onAddSmoothie({
      name,
      ingredients: draftIngredients,
    });
    setDraftName('');
    setDraftIngredient('');
    setDraftIngredients([]);
  }

  return (
    <article className="catalog-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">{textFor(t, 'section')}</p>
          <h3>{textFor(t, 'smoothies')}</h3>
        </div>
      </div>

      {!readOnly ? (
        <div className="smoothie-form">
          <input
            type="text"
            value={draftName}
            placeholder={textFor(t, 'smoothieNamePlaceholder')}
            onChange={(event) => setDraftName(event.target.value)}
          />

          <div className="compact-form">
            <input
              type="text"
              value={draftIngredient}
              placeholder={textFor(t, 'smoothieIngredientPlaceholder')}
              onChange={(event) => setDraftIngredient(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleQueueIngredient();
                }
              }}
            />
            <button type="button" onClick={handleQueueIngredient}>
              {textFor(t, 'smoothieAddIngredient')}
            </button>
          </div>

          {draftIngredients.length > 0 ? (
            <div className="ingredient-chip-list">
              {draftIngredients.map((ingredient, index) => (
                <button
                  key={`${ingredient}-${index}`}
                  type="button"
                  className="ingredient-chip"
                  onClick={() => handleRemoveQueuedIngredient(index)}
                >
                  {ingredient}
                </button>
              ))}
            </div>
          ) : null}

          <div className="form-actions">
            <button type="button" className="primary-button save-button" onClick={handleSaveSmoothie}>
              {textFor(t, 'smoothieSave')}
            </button>
          </div>
        </div>
      ) : null}

      <ul className="item-list">
        {smoothies.length === 0 ? (
          <li className="empty-state">{textFor(t, 'noItems')}</li>
        ) : (
          smoothies.map((smoothie) => {
            const isExpanded = expandedId === smoothie.id;

            return (
              <li key={smoothie.id} className="smoothie-card">
                <div className="smoothie-header">
                  <div>
                    <strong>{smoothie.name}</strong>
                    <span>{smoothie.ingredients.length} ingredients</span>
                  </div>
                  <div className="smoothie-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setExpandedId(isExpanded ? null : smoothie.id)}
                    >
                      {isExpanded ? textFor(t, 'smoothieCollapse') : textFor(t, 'smoothieExpand')}
                    </button>
                    {!readOnly ? (
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => onRemoveSmoothie(smoothie.id)}
                      >
                        {textFor(t, 'remove')}
                      </button>
                    ) : null}
                  </div>
                </div>

                {isExpanded ? (
                  <div className="smoothie-body">
                    {smoothie.ingredients.length > 0 ? (
                      <div className="ingredient-chip-list">
                        {smoothie.ingredients.map((ingredient, index) => (
                          <div key={`${ingredient}-${index}`} className="ingredient-chip static">
                            <span>{ingredient}</span>
                            {!readOnly ? (
                              <button
                                type="button"
                                className="ingredient-remove"
                                onClick={() => onRemoveIngredient(smoothie.id, index)}
                              >
                                ×
                              </button>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">{textFor(t, 'smoothieNoIngredients')}</div>
                    )}

                    {!readOnly ? (
                      <div className="compact-form">
                        <input
                          type="text"
                          placeholder={textFor(t, 'smoothieIngredientPlaceholder')}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              onAddIngredient(smoothie.id, event.currentTarget.value);
                              event.currentTarget.value = '';
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(event) => {
                            const input = event.currentTarget.previousElementSibling;
                            onAddIngredient(smoothie.id, input.value);
                            input.value = '';
                          }}
                        >
                          {textFor(t, 'smoothieAddIngredient')}
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })
        )}
      </ul>
    </article>
  );
}

export default SmoothieSection;
