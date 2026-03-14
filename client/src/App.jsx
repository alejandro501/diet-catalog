import { useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  buildCatalog,
  createEmptyCatalog,
  defaultDietTypes,
  defaultSeedItems,
  filterOptions,
  languageOptions,
  sectionNames,
} from './catalog';
import { auth, db, hasFirebaseEnv } from './lib/firebase';

const LANGUAGE_STORAGE_KEY = 'diet-catalog-language';

const menuItems = [
  { id: 'profile', textKey: 'menuProfile' },
  { id: 'catalog', textKey: 'menuCatalog' },
  { id: 'users', textKey: 'menuUsers' },
  { id: 'shared', textKey: 'menuShared' },
  { id: 'settings', textKey: 'menuSettings' },
];

const translations = {
  en: {
    appTitle: 'Diet Catalog',
    dietNavigation: 'Diet navigation',
    foods: 'Foods',
    drinks: 'Drinks',
    vitamins: 'Vitamins',
    section: 'Section',
    filter: 'Filter',
    add: 'Add',
    remove: 'Remove',
    items: 'items',
    language: 'Language',
    noItems: 'No items match this filter.',
    loading: 'Loading your catalog...',
    saveError: 'Something went wrong while talking to Firebase.',
    missingConfig:
      'Firebase environment variables are missing. Add the VITE_FIREBASE_* values from your Firebase web app.',
    authTitle: 'Sign in to your catalog',
    authCopy: 'Use email and password to load the same catalog from any browser.',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    signIn: 'Sign In',
    signUp: 'Create Account',
    signOut: 'Sign Out',
    authSuccessSignUp: 'Account created. You can now sign in.',
    passwordMismatch: 'Passwords do not match.',
    authInvalidEmail: 'Enter a valid email address.',
    authEmailInUse: 'That email is already registered.',
    authWeakPassword: 'Password must be at least 6 characters.',
    authInvalidCredential: 'Email or password is incorrect.',
    authTooManyRequests: 'Too many attempts. Try again later.',
    authOperationNotAllowed: 'Email/password sign-in is not enabled in Firebase Authentication.',
    authUnauthorizedDomain:
      'This domain is not authorized in Firebase Authentication. Add it under Authorized domains.',
    networkBlocked:
      'A browser extension or privacy tool is blocking Firebase requests. Disable blockers for this site and try again.',
    requestAborted: 'The request was interrupted before it finished. Try again.',
    addPlaceholder: {
      foods: 'Add a food',
      drinks: 'Add a drink',
      vitamins: 'Add a vitamin',
    },
    filters: {
      All: 'All',
      Fruits: 'Fruits',
      Vegetables: 'Vegetables',
      'Side Dish': 'Side Dish',
      Protein: 'Protein',
      Grains: 'Grains',
      Water: 'Water',
      Tea: 'Tea',
      Juice: 'Juice',
      Smoothie: 'Smoothie',
      Coffee: 'Coffee',
      'Omega-3': 'Omega-3',
      Mineral: 'Mineral',
      Vitamin: 'Vitamin',
      Probiotic: 'Probiotic',
      Electrolyte: 'Electrolyte',
    },
    languages: {
      en: 'English',
      hu: 'Hungarian',
      es: 'Spanish',
      it: 'Italian',
    },
    menuCatalog: 'Catalog',
    menuProfile: 'Profile',
    menuUsers: 'Users',
    menuShared: 'Shared Lists',
    menuSettings: 'Settings',
    profileTitle: 'Profile',
    profileCopy: 'Set the public identity other users will see when browsing the app.',
    profileName: 'Name',
    profileUsername: 'Username',
    profileSave: 'Save Profile',
    profileSaved: 'Profile saved.',
    profileNamePlaceholder: 'Your display name',
    profileUsernamePlaceholder: 'your-username',
    profileNameRequired: 'Name is required.',
    profileUsernameRequired: 'Username is required.',
    profileUsernameTaken: 'That username is already in use.',
    profileUsernameFormat: 'Username can only use letters, numbers, dots, underscores, and hyphens.',
    usersTitle: 'Users',
    usersCopy: 'Choose which users can access your diet list.',
    usersEmpty: 'No users found yet.',
    sharedTitle: 'Shared Lists',
    sharedCopy: 'These are diet lists shared directly with you.',
    sharedEmpty: 'No lists have been shared with you yet.',
    sharedSelectPrompt: 'Choose a shared list to preview its catalog.',
    sharedLoading: 'Loading shared catalog...',
    sharedOwner: 'Shared by',
    shareWithUser: 'Share My List',
    unshareWithUser: 'Unshare My List',
    shareCreated: 'List shared.',
    shareRemoved: 'Shared access removed.',
    sharedWithYou: 'Shared with you',
    sharedByYou: 'You share with this user',
    anonymousUser: 'Anonymous User',
    settingsTitle: 'Settings',
    settingsCopy: 'Add diet types, hide them from the catalog, or delete them completely.',
    settingsDietTypes: 'Diet Types',
    settingsAddDiet: 'Add Diet Type',
    settingsDietName: 'Diet Name',
    settingsDietNamePlaceholder: 'For example Paleo',
    settingsVisible: 'Visible',
    settingsHidden: 'Hidden',
    settingsDelete: 'Delete',
    settingsSave: 'Save Diet Types',
    settingsSaved: 'Diet types saved.',
    settingsDietNameRequired: 'Diet name is required.',
    settingsDietNameTaken: 'That diet type already exists.',
    settingsNeedVisibleDiet: 'Keep at least one visible diet type.',
  },
  hu: {
    appTitle: 'Dieta Katalogus',
    foods: 'Etelek',
    drinks: 'Italok',
    section: 'Szekcio',
    filter: 'Szuro',
    add: 'Hozzaadas',
    remove: 'Torles',
    items: 'tetel',
    language: 'Nyelv',
    noItems: 'Nincs a szuronek megfelelo tetel.',
    loading: 'A katalogus betoltese folyamatban...',
    saveError: 'Hiba tortent a Firebase elerese kozben.',
    missingConfig: 'Hianyzik a Firebase konfiguracio.',
    authTitle: 'Jelentkezz be a katalogushoz',
    authCopy: 'Emaillel es jelszoval ugyanazt a katalogust tobb bongeszobol is elerheted.',
    email: 'Email',
    password: 'Jelszo',
    confirmPassword: 'Jelszo Megerositese',
    signIn: 'Belepes',
    signUp: 'Fiok Letrehozasa',
    signOut: 'Kijelentkezes',
    authSuccessSignUp: 'A fiok letrejott. Most mar bejelentkezhetsz.',
    passwordMismatch: 'A jelszavak nem egyeznek.',
    addPlaceholder: {
      foods: 'Etel hozzaadasa',
      drinks: 'Ital hozzaadasa',
    },
    filters: {
      All: 'Osszes',
      Fruits: 'Gyumolcsok',
      Vegetables: 'Zoldsegek',
      'Side Dish': 'Koret',
      Protein: 'Feherje',
      Grains: 'Gabona',
      Water: 'Viz',
      Tea: 'Tea',
      Juice: 'Gyumolcsle',
      Smoothie: 'Turmix',
      Coffee: 'Kave',
    },
    languages: {
      en: 'Angol',
      hu: 'Magyar',
      es: 'Spanyol',
      it: 'Olasz',
    },
  },
  es: {
    appTitle: 'Catalogo de Dietas',
    foods: 'Alimentos',
    drinks: 'Bebidas',
    section: 'Seccion',
    filter: 'Filtro',
    add: 'Agregar',
    remove: 'Eliminar',
    items: 'elementos',
    language: 'Idioma',
    noItems: 'No hay elementos que coincidan con este filtro.',
    loading: 'Cargando tu catalogo...',
    saveError: 'Ocurrio un error al comunicarse con Firebase.',
    missingConfig: 'Faltan variables de entorno de Firebase.',
    authTitle: 'Inicia sesion en tu catalogo',
    authCopy: 'Usa correo y contrasena para cargar el mismo catalogo desde cualquier navegador.',
    email: 'Correo',
    password: 'Contrasena',
    confirmPassword: 'Confirmar Contrasena',
    signIn: 'Iniciar Sesion',
    signUp: 'Crear Cuenta',
    signOut: 'Cerrar Sesion',
    authSuccessSignUp: 'Cuenta creada. Ahora puedes iniciar sesion.',
    passwordMismatch: 'Las contrasenas no coinciden.',
    addPlaceholder: {
      foods: 'Agregar un alimento',
      drinks: 'Agregar una bebida',
    },
    filters: {
      All: 'Todos',
      Fruits: 'Frutas',
      Vegetables: 'Verduras',
      'Side Dish': 'Guarnicion',
      Protein: 'Proteina',
      Grains: 'Granos',
      Water: 'Agua',
      Tea: 'Te',
      Juice: 'Jugo',
      Smoothie: 'Batido',
      Coffee: 'Cafe',
    },
    languages: {
      en: 'Ingles',
      hu: 'Hungaro',
      es: 'Espanol',
      it: 'Italiano',
    },
  },
  it: {
    appTitle: 'Catalogo Diete',
    dietNavigation: 'Navigazione Diete',
    foods: 'Cibi',
    drinks: 'Bevande',
    vitamins: 'Vitamine',
    section: 'Sezione',
    filter: 'Filtro',
    add: 'Aggiungi',
    remove: 'Rimuovi',
    items: 'elementi',
    language: 'Lingua',
    noItems: 'Nessun elemento corrisponde a questo filtro.',
    loading: 'Caricamento del catalogo...',
    saveError: 'Si e verificato un errore durante la comunicazione con Firebase.',
    missingConfig: 'Mancano le variabili di ambiente Firebase.',
    authTitle: 'Accedi al tuo catalogo',
    authCopy: 'Usa email e password per aprire lo stesso catalogo da qualsiasi browser.',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Conferma Password',
    signIn: 'Accedi',
    signUp: 'Crea Account',
    signOut: 'Esci',
    authSuccessSignUp: 'Account creato. Ora puoi accedere.',
    passwordMismatch: 'Le password non coincidono.',
    authInvalidEmail: 'Inserisci un indirizzo email valido.',
    authEmailInUse: 'Questa email e gia registrata.',
    authWeakPassword: 'La password deve contenere almeno 6 caratteri.',
    authInvalidCredential: 'Email o password non corretti.',
    authTooManyRequests: 'Troppi tentativi. Riprova piu tardi.',
    authOperationNotAllowed: 'L accesso con email e password non e abilitato in Firebase Authentication.',
    authUnauthorizedDomain:
      'Questo dominio non e autorizzato in Firebase Authentication. Aggiungilo agli Authorized domains.',
    networkBlocked:
      'Un estensione del browser o uno strumento di privacy sta bloccando Firebase. Disattiva i blocchi per questo sito e riprova.',
    requestAborted: 'La richiesta e stata interrotta prima del completamento. Riprova.',
    addPlaceholder: {
      foods: 'Aggiungi un cibo',
      drinks: 'Aggiungi una bevanda',
      vitamins: 'Aggiungi una vitamina',
    },
    filters: {
      All: 'Tutti',
      Fruits: 'Frutta',
      Vegetables: 'Verdure',
      'Side Dish': 'Contorno',
      Protein: 'Proteine',
      Grains: 'Cereali',
      Water: 'Acqua',
      Tea: 'Tè',
      Juice: 'Succo',
      Smoothie: 'Frullato',
      Coffee: 'Caffè',
      'Omega-3': 'Omega-3',
      Mineral: 'Minerale',
      Vitamin: 'Vitamina',
      Probiotic: 'Probiotico',
      Electrolyte: 'Elettrolita',
    },
    languages: {
      en: 'Inglese',
      hu: 'Ungherese',
      es: 'Spagnolo',
      it: 'Italiano',
    },
    menuCatalog: 'Catalogo',
    menuProfile: 'Profilo',
    menuUsers: 'Utenti',
    menuShared: 'Liste Condivise',
    menuSettings: 'Impostazioni',
    profileTitle: 'Profilo',
    profileCopy: 'Imposta l identita pubblica che gli altri utenti vedranno nell app.',
    profileName: 'Nome',
    profileUsername: 'Username',
    profileSave: 'Salva Profilo',
    profileSaved: 'Profilo salvato.',
    profileNamePlaceholder: 'Il tuo nome visibile',
    profileUsernamePlaceholder: 'tuo-username',
    profileNameRequired: 'Il nome e obbligatorio.',
    profileUsernameRequired: 'Lo username e obbligatorio.',
    profileUsernameTaken: 'Questo username e gia in uso.',
    profileUsernameFormat:
      'Lo username puo contenere solo lettere, numeri, punti, underscore e trattini.',
    usersTitle: 'Utenti',
    usersCopy: 'Scegli quali utenti possono accedere alla tua lista dieta.',
    usersEmpty: 'Nessun utente trovato.',
    sharedTitle: 'Liste Condivise',
    sharedCopy: 'Queste sono le liste dieta condivise direttamente con te.',
    sharedEmpty: 'Nessuna lista e stata condivisa con te.',
    sharedSelectPrompt: 'Scegli una lista condivisa per vedere il catalogo.',
    sharedLoading: 'Caricamento catalogo condiviso...',
    sharedOwner: 'Condiviso da',
    shareWithUser: 'Condividi la Mia Lista',
    unshareWithUser: 'Rimuovi Condivisione',
    shareCreated: 'Lista condivisa.',
    shareRemoved: 'Accesso condiviso rimosso.',
    sharedWithYou: 'Condiviso con te',
    sharedByYou: 'Condividi con questo utente',
    anonymousUser: 'Utente Anonimo',
    settingsTitle: 'Impostazioni',
    settingsCopy: 'Aggiungi tipi di dieta, nascondili nel catalogo o eliminali completamente.',
    settingsDietTypes: 'Tipi di Dieta',
    settingsAddDiet: 'Aggiungi Tipo Dieta',
    settingsDietName: 'Nome Dieta',
    settingsDietNamePlaceholder: 'Per esempio Paleo',
    settingsVisible: 'Visibile',
    settingsHidden: 'Nascosto',
    settingsDelete: 'Elimina',
    settingsSave: 'Salva Tipi Dieta',
    settingsSaved: 'Tipi di dieta salvati.',
    settingsDietNameRequired: 'Il nome della dieta e obbligatorio.',
    settingsDietNameTaken: 'Questo tipo di dieta esiste gia.',
    settingsNeedVisibleDiet: 'Mantieni almeno un tipo di dieta visibile.',
  },
};

function textFor(t, key) {
  return t[key] ?? translations.en[key] ?? key;
}

function readStoredLanguage() {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return languageOptions.includes(saved) ? saved : 'en';
}

function formatFirebaseError(error, t) {
  const code = error?.code ?? '';
  const message = error?.message ?? '';

  if (error?.name === 'AbortError') {
    return textFor(t, 'requestAborted');
  }

  if (message.includes('ERR_BLOCKED_BY_CLIENT')) {
    return textFor(t, 'networkBlocked');
  }

  switch (code) {
    case 'auth/invalid-email':
      return textFor(t, 'authInvalidEmail');
    case 'auth/email-already-in-use':
      return textFor(t, 'authEmailInUse');
    case 'auth/weak-password':
      return textFor(t, 'authWeakPassword');
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return textFor(t, 'authInvalidCredential');
    case 'auth/too-many-requests':
      return textFor(t, 'authTooManyRequests');
    case 'auth/operation-not-allowed':
      return textFor(t, 'authOperationNotAllowed');
    case 'auth/unauthorized-domain':
      return textFor(t, 'authUnauthorizedDomain');
    case 'permission-denied':
      return 'Check Firestore rules and sharing access.';
    case 'unavailable':
      return textFor(t, 'networkBlocked');
    default:
      return message || textFor(t, 'saveError');
  }
}

function userDocRef(userId) {
  return doc(db, 'users', userId);
}

function profileDocRef(userId) {
  return doc(db, 'profiles', userId);
}

function shareDocRef(ownerId, recipientId) {
  return doc(db, 'shares', `${ownerId}_${recipientId}`);
}

function catalogCollectionRef(userId) {
  return collection(db, 'users', userId, 'catalogItems');
}

function normalizeUsername(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
}

function titleFromEmail(email) {
  const seed = email?.split('@')[0] ?? 'User';
  return seed.replace(/[._-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function avatarFallback(profile) {
  const name = profile?.name?.trim() || profile?.username?.trim() || 'U';
  return name.charAt(0).toUpperCase();
}

function mapProfileDoc(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name ?? '',
    username: data.username ?? '',
    normalizedUsername: data.normalizedUsername ?? '',
  };
}

function mapShareDoc(snapshot) {
  return snapshot.data();
}

function sortProfiles(profiles) {
  return [...profiles].sort((left, right) => {
    const leftLabel = (left.name || left.username || '').toLowerCase();
    const rightLabel = (right.name || right.username || '').toLowerCase();
    return leftLabel.localeCompare(rightLabel);
  });
}

function normalizeDietTypes(rawDietTypes) {
  const safe = Array.isArray(rawDietTypes) && rawDietTypes.length > 0 ? rawDietTypes : defaultDietTypes;
  return safe.map((dietType, index) => ({
    id: dietType.id || `${dietType.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'diet'}-${index}`,
    name: dietType.name || `Diet ${index + 1}`,
    visible: dietType.visible !== false,
    description: dietType.description ?? '',
  }));
}

function AuthScreen({
  authMode,
  authValues,
  isSubmitting,
  message,
  onSubmit,
  setAuthMode,
  setAuthValues,
  t,
}) {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">{textFor(t, 'appTitle')}</p>
        <h1>{textFor(t, 'authTitle')}</h1>
        <p className="auth-copy">{textFor(t, 'authCopy')}</p>

        <div className="auth-toggle-row">
          <button
            type="button"
            className={authMode === 'sign-in' ? 'auth-toggle active' : 'auth-toggle'}
            onClick={() => setAuthMode('sign-in')}
          >
            {textFor(t, 'signIn')}
          </button>
          <button
            type="button"
            className={authMode === 'sign-up' ? 'auth-toggle active' : 'auth-toggle'}
            onClick={() => setAuthMode('sign-up')}
          >
            {textFor(t, 'signUp')}
          </button>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            <span>{textFor(t, 'email')}</span>
            <input
              type="email"
              value={authValues.email}
              onChange={(event) =>
                setAuthValues((current) => ({ ...current, email: event.target.value }))
              }
              required
            />
          </label>

          <label>
            <span>{textFor(t, 'password')}</span>
            <input
              type="password"
              value={authValues.password}
              onChange={(event) =>
                setAuthValues((current) => ({ ...current, password: event.target.value }))
              }
              required
              minLength={6}
            />
          </label>

          {authMode === 'sign-up' ? (
            <label>
              <span>{textFor(t, 'confirmPassword')}</span>
              <input
                type="password"
                value={authValues.confirmPassword}
                onChange={(event) =>
                  setAuthValues((current) => ({ ...current, confirmPassword: event.target.value }))
                }
                required
                minLength={6}
              />
            </label>
          ) : null}

          <button type="submit" disabled={isSubmitting}>
            {authMode === 'sign-in' ? textFor(t, 'signIn') : textFor(t, 'signUp')}
          </button>
        </form>

        {message ? <p className="status-message">{message}</p> : null}
      </section>
    </main>
  );
}

function CatalogView({
  activeDiet,
  catalog,
  dietTypes,
  drafts,
  filters,
  handleAddItem,
  handleDraftChange,
  handleRemoveItem,
  readOnly = false,
  setActiveDiet,
  setFilters,
  t,
}) {
  const activeCatalog = catalog[activeDiet] ?? { foods: [], drinks: [], vitamins: [] };
  const visibleDietTypes = dietTypes.filter((dietType) => dietType.visible);
  const activeDietMeta = dietTypes.find((dietType) => dietType.name === activeDiet);

  const filteredSections = useMemo(() => {
    return sectionNames.reduce((acc, section) => {
      const selectedFilter = filters[section] ?? 'All';
      acc[section] = activeCatalog[section].filter((item) => {
        return selectedFilter === 'All' || item.category === selectedFilter;
      });
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
              <span>{dietType.name}</span>
              <small>
                {(catalog[dietType.name]?.foods.length ?? 0) +
                  (catalog[dietType.name]?.drinks.length ?? 0)}{' '}
                {textFor(t, 'items')}
              </small>
            </button>
          ))}
        </div>
      </article>

      <div className="catalog-main">
        <section className="hero-card">
          <div className="hero-row">
            <div>
              <h2>{activeDiet}</h2>
              {activeDietMeta?.description ? <p>{activeDietMeta.description}</p> : null}
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
            </div>
          </div>
        </section>

        <section className="section-grid">
          {sectionNames.map((section) => (
            <article key={section} className="catalog-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">{textFor(t, 'section')}</p>
                  <h3>{textFor(t, section)}</h3>
                </div>
              <label className="filter-control">
                <span>{textFor(t, 'filter')}</span>
                <select
                  value={filters[section]}
                  disabled={readOnly}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                        [section]: event.target.value,
                      }))
                    }
                  >
                    {filterOptions[section].map((option) => (
                      <option key={option} value={option}>
                        {t.filters?.[option] ?? translations.en.filters[option]}
                      </option>
                    ))}
                  </select>
              </label>
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
                    {filterOptions[section].filter((option) => option !== 'All').map((option) => (
                      <option key={option} value={option}>
                        {t.filters?.[option] ?? translations.en.filters[option]}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={() => handleAddItem(section)}>
                    {textFor(t, 'add')}
                  </button>
                </div>
              ) : null}

              <ul className="item-list">
                {filteredSections[section].length === 0 ? (
                  <li className="empty-state">{textFor(t, 'noItems')}</li>
                ) : (
                  filteredSections[section].map((item) => (
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
            </article>
          ))}
        </section>
      </div>
    </section>
  );
}

function ProfileView({ onSave, profileDraft, savingProfile, setProfileDraft, t }) {
  return (
    <section className="profile-grid">
      <article className="catalog-card profile-card">
        <p className="eyebrow">{textFor(t, 'menuProfile')}</p>
        <h2>{textFor(t, 'profileTitle')}</h2>
        <p className="profile-copy">{textFor(t, 'profileCopy')}</p>
        <div className="profile-preview">
          <div className="avatar-fallback">{avatarFallback(profileDraft)}</div>
          <div>
            <strong>{profileDraft.name || textFor(t, 'anonymousUser')}</strong>
            <span>@{profileDraft.username || 'username'}</span>
          </div>
        </div>
      </article>

      <article className="catalog-card profile-card">
        <div className="field-grid">
          <label className="profile-field">
            <span>{textFor(t, 'profileName')}</span>
            <input
              type="text"
              value={profileDraft.name}
              placeholder={textFor(t, 'profileNamePlaceholder')}
              onChange={(event) => setProfileDraft((current) => ({ ...current, name: event.target.value }))}
            />
          </label>

          <label className="profile-field">
            <span>{textFor(t, 'profileUsername')}</span>
            <input
              type="text"
              value={profileDraft.username}
              placeholder={textFor(t, 'profileUsernamePlaceholder')}
              onChange={(event) =>
                setProfileDraft((current) => ({ ...current, username: event.target.value }))
              }
            />
          </label>
        </div>

        <button type="button" className="primary-button" onClick={onSave} disabled={savingProfile}>
          {textFor(t, 'profileSave')}
        </button>
      </article>
    </section>
  );
}

function UsersView({ currentUserId, onToggleShare, profiles, sharedRecipientIds, t }) {
  const visibleProfiles = profiles.filter((profile) => profile.id !== currentUserId);

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

      {visibleProfiles.length === 0 ? (
        <section className="catalog-card empty-panel">{textFor(t, 'usersEmpty')}</section>
      ) : (
        <section className="users-grid">
          {visibleProfiles.map((profile) => {
            const isShared = sharedRecipientIds.has(profile.id);

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
                  {isShared ? <span className="pill shared">{textFor(t, 'sharedByYou')}</span> : null}
                </div>
                <button type="button" className="secondary-button" onClick={() => onToggleShare(profile)}>
                  {isShared ? textFor(t, 'unshareWithUser') : textFor(t, 'shareWithUser')}
                </button>
              </article>
            );
          })}
        </section>
      )}
    </>
  );
}

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
            dietTypes={Object.keys(sharedCatalog).map((name, index) => ({ id: `shared-${index}`, name, visible: true }))}
            drafts={{ foods: { name: '', category: 'Fruits' }, drinks: { name: '', category: 'Water' } }}
            filters={{ foods: 'All', drinks: 'All' }}
            handleAddItem={() => {}}
            handleDraftChange={() => {}}
            handleRemoveItem={() => {}}
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

function SettingsView({
  dietDrafts,
  newDietName,
  onAddDietType,
  onDeleteDietType,
  onEditDietType,
  onSaveDietTypes,
  onToggleDietVisibility,
  setNewDietName,
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
                <span>{dietType.visible ? textFor(t, 'settingsVisible') : textFor(t, 'settingsHidden')}</span>
              </div>
              <div className="settings-actions">
                <label className="toggle-inline">
                  <input
                    type="checkbox"
                    checked={dietType.visible}
                    onChange={() => onToggleDietVisibility(dietType.id)}
                  />
                  <span>{textFor(t, 'settingsVisible')}</span>
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

        <button type="button" className="primary-button" onClick={onSaveDietTypes}>
          {textFor(t, 'settingsSave')}
        </button>
      </article>
    </section>
  );
}

async function ensureUserSetup(user) {
  const privateRef = userDocRef(user.uid);
  const publicRef = profileDocRef(user.uid);
  const [privateSnapshot, publicSnapshot, catalogSnapshot] = await Promise.all([
    getDoc(privateRef),
    getDoc(publicRef),
    getDocs(catalogCollectionRef(user.uid)),
  ]);
  const defaultName = titleFromEmail(user.email);
  const defaultUsername = normalizeUsername(user.email?.split('@')[0] ?? user.uid.slice(0, 8));
  const normalizedDietTypes = normalizeDietTypes(privateSnapshot.data()?.dietTypes);
  const batch = writeBatch(db);
  let shouldCommit = false;

  if (!privateSnapshot.exists() || !privateSnapshot.data()?.catalogInitialized || !privateSnapshot.data()?.dietTypes) {
    batch.set(
      privateRef,
      {
        language: privateSnapshot.data()?.language ?? 'en',
        catalogInitialized: true,
        dietTypes: normalizedDietTypes,
        createdAt: privateSnapshot.data()?.createdAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    if (!privateSnapshot.exists() || !privateSnapshot.data()?.catalogInitialized) {
      for (const item of defaultSeedItems) {
        const itemRef = doc(catalogCollectionRef(user.uid));
        batch.set(itemRef, {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    }

    shouldCommit = true;
  }

  if (!publicSnapshot.exists()) {
    batch.set(
      publicRef,
      {
        name: defaultName,
        username: defaultUsername,
        normalizedUsername: defaultUsername,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    shouldCommit = true;
  }

  const existingSeedKeys = new Set(
    catalogSnapshot.docs.map((entry) => {
      const data = entry.data();
      return `${data.dietName}::${data.sectionName}::${data.itemName}`;
    })
  );

  for (const item of defaultSeedItems) {
    const key = `${item.dietName}::${item.sectionName}::${item.itemName}`;
    if (!existingSeedKeys.has(key)) {
      const itemRef = doc(catalogCollectionRef(user.uid));
      batch.set(itemRef, {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      shouldCommit = true;
    }
  }

  if (shouldCommit) {
    await batch.commit();
  }

  const [nextPrivateSnapshot, nextPublicSnapshot] = await Promise.all([
    getDoc(privateRef),
    getDoc(publicRef),
  ]);

  return {
    language: nextPrivateSnapshot.data()?.language ?? 'en',
    dietTypes: normalizeDietTypes(nextPrivateSnapshot.data()?.dietTypes),
    profile: mapProfileDoc(nextPublicSnapshot),
  };
}

async function loadCatalogRows(userId) {
  const snapshot = await getDocs(query(catalogCollectionRef(userId), orderBy('createdAt', 'desc')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

async function loadProfiles() {
  const snapshot = await getDocs(collection(db, 'profiles'));
  return sortProfiles(snapshot.docs.map(mapProfileDoc));
}

async function loadIncomingShares(userId) {
  const snapshot = await getDocs(query(collection(db, 'shares'), where('recipientId', '==', userId)));
  return snapshot.docs.map(mapShareDoc);
}

async function loadOutgoingShares(userId) {
  const snapshot = await getDocs(query(collection(db, 'shares'), where('ownerId', '==', userId)));
  return snapshot.docs.map(mapShareDoc);
}

function App() {
  const [catalog, setCatalog] = useState(createEmptyCatalog(defaultDietTypes));
  const [dietTypes, setDietTypes] = useState(defaultDietTypes);
  const [dietDrafts, setDietDrafts] = useState(defaultDietTypes);
  const [newDietName, setNewDietName] = useState('');
  const [activeDiet, setActiveDiet] = useState(defaultDietTypes[0].name);
  const [sharedActiveDiet, setSharedActiveDiet] = useState(defaultDietTypes[0].name);
  const [activeView, setActiveView] = useState('catalog');
  const [language, setLanguage] = useState(readStoredLanguage);
  const [filters, setFilters] = useState({ foods: 'All', drinks: 'All' });
  const [drafts, setDrafts] = useState({
    foods: { name: '', category: 'Fruits' },
    drinks: { name: '', category: 'Water' },
    vitamins: { name: '', category: 'Vitamin' },
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharedLoading, setSharedLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [authMode, setAuthMode] = useState('sign-in');
  const [authValues, setAuthValues] = useState({ email: '', password: '', confirmPassword: '' });
  const [profile, setProfile] = useState(null);
  const [profileDraft, setProfileDraft] = useState({
    name: '',
    username: '',
  });
  const [profiles, setProfiles] = useState([]);
  const [incomingShares, setIncomingShares] = useState([]);
  const [outgoingShares, setOutgoingShares] = useState([]);
  const [selectedSharedProfile, setSelectedSharedProfile] = useState(null);
  const [sharedCatalog, setSharedCatalog] = useState(createEmptyCatalog(defaultDietTypes));

  useEffect(() => {
    if (!hasFirebaseEnv) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setMessage('');
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const nextVisible = dietTypes.filter((dietType) => dietType.visible).map((dietType) => dietType.name);
    if (nextVisible.length === 0) {
      return;
    }

    if (!nextVisible.includes(activeDiet)) {
      setActiveDiet(nextVisible[0]);
    }
  }, [activeDiet, dietTypes]);

  useEffect(() => {
    if (!user) {
      setCatalog(createEmptyCatalog(defaultDietTypes));
      setDietTypes(defaultDietTypes);
      setDietDrafts(defaultDietTypes);
      setProfiles([]);
      setIncomingShares([]);
      setOutgoingShares([]);
      setSelectedSharedProfile(null);
      setSharedCatalog(createEmptyCatalog(defaultDietTypes));
      return;
    }

    let cancelled = false;

    async function run() {
      setLoading(true);

      try {
        const setup = await ensureUserSetup(user);
        const [ownRows, nextProfiles, nextIncomingShares, nextOutgoingShares] = await Promise.all([
          loadCatalogRows(user.uid),
          loadProfiles(),
          loadIncomingShares(user.uid),
          loadOutgoingShares(user.uid),
        ]);

        if (cancelled) {
          return;
        }

        const preferredLanguage = readStoredLanguage();
        setLanguage(preferredLanguage || setup.language);
        setDietTypes(setup.dietTypes);
        setDietDrafts(setup.dietTypes);
        setActiveDiet(setup.dietTypes.find((dietType) => dietType.visible)?.name ?? setup.dietTypes[0].name);
        setProfile(setup.profile);
        setProfileDraft({
          name: setup.profile.name,
          username: setup.profile.username,
        });
        setCatalog(buildCatalog(ownRows, setup.dietTypes));
        setProfiles(nextProfiles);
        setIncomingShares(nextIncomingShares);
        setOutgoingShares(nextOutgoingShares);
      } catch (error) {
        if (!cancelled) {
          setMessage(formatFirebaseError(error, translations.en));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const t = translations[language];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language]);

  const sharedProfiles = useMemo(() => {
    const ownerIds = new Set(incomingShares.map((entry) => entry.ownerId));
    return profiles.filter((profileEntry) => ownerIds.has(profileEntry.id));
  }, [incomingShares, profiles]);

  const outgoingRecipientIds = useMemo(() => {
    return new Set(outgoingShares.map((entry) => entry.recipientId));
  }, [outgoingShares]);

  async function refreshAppData(nextSelectedId = selectedSharedProfile?.id ?? null) {
    if (!user) {
      return;
    }

    const [ownRows, nextProfiles, nextIncomingShares, nextOutgoingShares, privateSnapshot] = await Promise.all([
      loadCatalogRows(user.uid),
      loadProfiles(),
      loadIncomingShares(user.uid),
      loadOutgoingShares(user.uid),
      getDoc(userDocRef(user.uid)),
    ]);

    const nextDietTypes = normalizeDietTypes(privateSnapshot.data()?.dietTypes);
    setDietTypes(nextDietTypes);
    setDietDrafts(nextDietTypes);
    setCatalog(buildCatalog(ownRows, nextDietTypes));
    setProfiles(nextProfiles);
    setIncomingShares(nextIncomingShares);
    setOutgoingShares(nextOutgoingShares);

    if (!nextSelectedId) {
      return;
    }

    const matched = nextProfiles.find((profileEntry) => profileEntry.id === nextSelectedId) ?? null;
    setSelectedSharedProfile(matched);
  }

  const changeLanguage = async (nextLanguage) => {
    setLanguage(nextLanguage);

    if (!user) {
      return;
    }

    try {
      await setDoc(
        userDocRef(user.uid),
        {
          language: nextLanguage,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      setMessage(formatFirebaseError(error, t));
    }
  };

  const handleDraftChange = (section, key, value) => {
    setDrafts((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value,
      },
    }));
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      if (authMode === 'sign-in') {
        await signInWithEmailAndPassword(auth, authValues.email, authValues.password);
      } else {
        if (authValues.password !== authValues.confirmPassword) {
          setMessage(textFor(t, 'passwordMismatch'));
          return;
        }

        await createUserWithEmailAndPassword(auth, authValues.email, authValues.password);
        setMessage(textFor(t, 'authSuccessSignUp'));
      }
    } catch (error) {
      setMessage(formatFirebaseError(error, t));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItem = async (section) => {
    const name = drafts[section].name.trim();
    const category = drafts[section].category;

    if (!name || !user) {
      return;
    }

    try {
      const itemRef = await addDoc(catalogCollectionRef(user.uid), {
        dietName: activeDiet,
        sectionName: section,
        itemName: name,
        category,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setCatalog((current) => ({
        ...current,
        [activeDiet]: {
          ...current[activeDiet],
          [section]: [{ id: itemRef.id, name, category }, ...current[activeDiet][section]],
        },
      }));

      setDrafts((current) => ({
        ...current,
        [section]: {
          ...current[section],
          name: '',
        },
      }));
    } catch (error) {
      setMessage(formatFirebaseError(error, t));
    }
  };

  const handleRemoveItem = async (section, id) => {
    if (!user) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'catalogItems', id));
      setCatalog((current) => ({
        ...current,
        [activeDiet]: {
          ...current[activeDiet],
          [section]: current[activeDiet][section].filter((item) => item.id !== id),
        },
      }));
    } catch (error) {
      setMessage(formatFirebaseError(error, t));
    }
  };

  const handleSaveProfile = async () => {
    if (!user) {
      return;
    }

    const name = profileDraft.name.trim();
    const username = profileDraft.username.trim();
    const normalizedUsername = normalizeUsername(username);

    if (!name) {
      setMessage(textFor(t, 'profileNameRequired'));
      return;
    }

    if (!username) {
      setMessage(textFor(t, 'profileUsernameRequired'));
      return;
    }

    if (!normalizedUsername || normalizedUsername !== username.toLowerCase()) {
      setMessage(textFor(t, 'profileUsernameFormat'));
      return;
    }

    setSavingProfile(true);

    try {
      const duplicateSnapshot = await getDocs(
        query(collection(db, 'profiles'), where('normalizedUsername', '==', normalizedUsername))
      );
      const duplicate = duplicateSnapshot.docs.find((entry) => entry.id !== user.uid);

      if (duplicate) {
        setMessage(textFor(t, 'profileUsernameTaken'));
        return;
      }

      const payload = {
        name,
        username,
        normalizedUsername,
        updatedAt: serverTimestamp(),
      };

      await setDoc(profileDocRef(user.uid), payload, { merge: true });
      setProfile({ id: user.uid, ...payload });
      await refreshAppData(selectedSharedProfile?.id ?? null);
      setMessage(textFor(t, 'profileSaved'));
    } catch (error) {
      setMessage(formatFirebaseError(error, t));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleToggleShare = async (recipientProfile) => {
    if (!user) {
      return;
    }

    const ref = shareDocRef(user.uid, recipientProfile.id);
    const alreadyShared = outgoingRecipientIds.has(recipientProfile.id);

    try {
      if (alreadyShared) {
        await deleteDoc(ref);
        setMessage(textFor(t, 'shareRemoved'));
      } else {
        await setDoc(ref, {
          ownerId: user.uid,
          recipientId: recipientProfile.id,
          createdAt: serverTimestamp(),
        });
        setMessage(textFor(t, 'shareCreated'));
      }

      await refreshAppData(selectedSharedProfile?.id ?? null);
    } catch (error) {
      setMessage(formatFirebaseError(error, t));
    }
  };

  const handleOpenShared = async (profileEntry) => {
    setActiveView('shared');
    setSelectedSharedProfile(profileEntry);
    setSharedActiveDiet(Object.keys(sharedCatalog)[0] ?? defaultDietTypes[0].name);
    setSharedLoading(true);

    try {
      const rows = await loadCatalogRows(profileEntry.id);
      const sharedDietTypes = dietTypes.map((dietType) => ({ ...dietType, visible: true }));
      setSharedCatalog(buildCatalog(rows, sharedDietTypes));
      setSharedActiveDiet(sharedDietTypes[0]?.name ?? defaultDietTypes[0].name);
    } catch (error) {
      setMessage(formatFirebaseError(error, t));
    } finally {
      setSharedLoading(false);
    }
  };

  const handleAddDietType = () => {
    const name = newDietName.trim();

    if (!name) {
      setMessage(textFor(t, 'settingsDietNameRequired'));
      return;
    }

    if (dietDrafts.some((dietType) => dietType.name.toLowerCase() === name.toLowerCase())) {
      setMessage(textFor(t, 'settingsDietNameTaken'));
      return;
    }

    setDietDrafts((current) => [
      ...current,
      {
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name,
        visible: true,
      },
    ]);
    setNewDietName('');
  };

  const handleToggleDietVisibility = (dietId) => {
    setDietDrafts((current) => {
      const next = current.map((dietType) =>
        dietType.id === dietId ? { ...dietType, visible: !dietType.visible } : dietType
      );

      return next.some((dietType) => dietType.visible) ? next : current;
    });
  };

  const handleDeleteDietType = (dietId) => {
    setDietDrafts((current) => {
      if (current.length === 1) {
        return current;
      }

      const next = current.filter((dietType) => dietType.id !== dietId);
      return next.some((dietType) => dietType.visible) ? next : current;
    });
  };

  const handleEditDietType = (dietId, value) => {
    setDietDrafts((current) =>
      current.map((dietType) =>
        dietType.id === dietId ? { ...dietType, name: value } : dietType
      )
    );
  };

  const handleSaveDietTypes = async () => {
    if (!user) {
      return;
    }

    if (!dietDrafts.some((dietType) => dietType.visible)) {
      setMessage(textFor(t, 'settingsNeedVisibleDiet'));
      return;
    }

    const cleanedDietDrafts = dietDrafts.map((dietType) => ({
      ...dietType,
      name: dietType.name.trim(),
    }));

    if (cleanedDietDrafts.some((dietType) => !dietType.name)) {
      setMessage(textFor(t, 'settingsDietNameRequired'));
      return;
    }

    if (
      new Set(cleanedDietDrafts.map((dietType) => dietType.name.toLowerCase())).size !==
      cleanedDietDrafts.length
    ) {
      setMessage(textFor(t, 'settingsDietNameTaken'));
      return;
    }

    const existingNames = new Set(dietTypes.map((dietType) => dietType.name));
    const nextNames = new Set(cleanedDietDrafts.map((dietType) => dietType.name));
    const deletedNames = [...existingNames].filter((name) => !nextNames.has(name));

    try {
      await setDoc(
        userDocRef(user.uid),
        {
          dietTypes: cleanedDietDrafts,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      if (deletedNames.length > 0) {
        const batch = writeBatch(db);
        const rows = await loadCatalogRows(user.uid);
        rows
          .filter((row) => deletedNames.includes(row.dietName))
          .forEach((row) => {
            batch.delete(doc(db, 'users', user.uid, 'catalogItems', row.id));
          });
        await batch.commit();
      }

      await refreshAppData(selectedSharedProfile?.id ?? null);
      setMessage(textFor(t, 'settingsSaved'));
    } catch (error) {
      setMessage(formatFirebaseError(error, t));
    }
  };

  if (!hasFirebaseEnv) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <p className="status-message">{textFor(translations.en, 'missingConfig')}</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <AuthScreen
        authMode={authMode}
        authValues={authValues}
        isSubmitting={isSubmitting}
        message={message}
        onSubmit={handleAuthSubmit}
        setAuthMode={setAuthMode}
        setAuthValues={setAuthValues}
        t={t}
      />
    );
  }

  if (loading) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <p className="status-message">{textFor(t, 'loading')}</p>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="sidebar-topbar">
            <div>
              <p className="eyebrow">{textFor(t, 'appTitle')}</p>
              <h1>{textFor(t, 'appTitle')}</h1>
            </div>
          </div>

          <nav className="menu-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={activeView === item.id ? 'menu-link active' : 'menu-link'}
                onClick={() => setActiveView(item.id)}
              >
                {textFor(t, item.textKey)}
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-profile">
            <div className="avatar-fallback sidebar-avatar">{avatarFallback(profile)}</div>
            <div>
              <strong>{profile?.name || textFor(t, 'anonymousUser')}</strong>
              <small>@{profile?.username || 'username'}</small>
            </div>
          </div>
          <button type="button" className="signout-button" onClick={() => signOut(auth)}>
            {textFor(t, 'signOut')}
          </button>
        </div>
      </aside>

      <main className="content">
        <div className="topbar">
          <label className="language-control topbar-language">
            <span>{textFor(t, 'language')}</span>
            <select value={language} onChange={(event) => changeLanguage(event.target.value)}>
              {languageOptions.map((option) => (
                <option key={option} value={option}>
                  {t.languages?.[option] ?? translations.en.languages[option]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {message ? <p className="status-message status-banner">{message}</p> : null}

        {activeView === 'profile' ? (
          <ProfileView
            onSave={handleSaveProfile}
            profileDraft={profileDraft}
            savingProfile={savingProfile}
            setProfileDraft={setProfileDraft}
            t={t}
          />
        ) : null}

        {activeView === 'catalog' ? (
          <CatalogView
            activeDiet={activeDiet}
            catalog={catalog}
            dietTypes={dietTypes}
            drafts={drafts}
            filters={filters}
            handleAddItem={handleAddItem}
            handleDraftChange={handleDraftChange}
            handleRemoveItem={handleRemoveItem}
            setActiveDiet={setActiveDiet}
            setFilters={setFilters}
            t={t}
          />
        ) : null}

        {activeView === 'users' ? (
          <UsersView
            currentUserId={user.uid}
            onToggleShare={handleToggleShare}
            profiles={profiles}
            sharedRecipientIds={outgoingRecipientIds}
            t={t}
          />
        ) : null}

        {activeView === 'shared' ? (
          <SharedListsView
            activeDiet={sharedActiveDiet}
            loading={sharedLoading}
            onSelectProfile={handleOpenShared}
            selectedProfile={selectedSharedProfile}
            setActiveDiet={setSharedActiveDiet}
            sharedCatalog={sharedCatalog}
            sharedProfiles={sharedProfiles}
            t={t}
          />
        ) : null}

        {activeView === 'settings' ? (
          <SettingsView
            dietDrafts={dietDrafts}
            newDietName={newDietName}
            onAddDietType={handleAddDietType}
            onDeleteDietType={handleDeleteDietType}
            onEditDietType={handleEditDietType}
            onSaveDietTypes={handleSaveDietTypes}
            onToggleDietVisibility={handleToggleDietVisibility}
            setNewDietName={setNewDietName}
            t={t}
          />
        ) : null}
      </main>
    </div>
  );
}

export default App;
