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
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  buildCatalog,
  createEmptyCatalog,
  defaultSeedItems,
  dietNames,
  filterOptions,
  languageOptions,
  sectionNames,
} from './catalog';
import { auth, db, hasFirebaseEnv } from './lib/firebase';

const translations = {
  en: {
    appTitle: 'Diet Catalog',
    appHeading: 'Meal reference for two diet styles',
    appCopy: 'Manage foods and drinks for each diet with account-based server storage across browsers.',
    dietNavigation: 'Diet navigation',
    currentDiet: 'Current Diet',
    heroCopy: 'Browse foods and drinks, filter by category, and update the list with shared account persistence.',
    foods: 'Foods',
    drinks: 'Drinks',
    section: 'Section',
    filter: 'Filter',
    add: 'Add',
    remove: 'Remove',
    items: 'items',
    language: 'Language',
    noItems: 'No items match this filter.',
    loading: 'Loading your catalog...',
    saveError: 'Something went wrong while talking to the server.',
    missingConfig:
      'Firebase environment variables are missing. Add the VITE_FIREBASE_* values from your Firebase web app.',
    authTitle: 'Sign in to your catalog',
    authCopy: 'Use email and password to load the same catalog from any browser.',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    signUp: 'Create Account',
    signOut: 'Sign Out',
    authSuccessSignUp: 'Account created. You can now sign in.',
    signedInAs: 'Signed in as',
    addPlaceholder: {
      foods: 'Add a food',
      drinks: 'Add a drink',
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
    },
    languages: {
      en: 'English',
      hu: 'Hungarian',
      es: 'Spanish',
    },
  },
  hu: {
    appTitle: 'Dieta Katalogus',
    appHeading: 'Etelajanlo ketfele dieta stilushoz',
    appCopy: 'Kezeld az eteleket es italokat fiokhoz kotott, szerveroldali tarolassal, tobb bongeszoben is.',
    dietNavigation: 'Dieta navigacio',
    currentDiet: 'Aktiv dieta',
    heroCopy: 'Bongeszd az eteleket es italokat, szurj kategoriak szerint, es mentsd a valtozasokat megosztott fioktarolasba.',
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
    saveError: 'Hiba tortent a szerver elerese kozben.',
    missingConfig:
      'Hianyzik a Firebase konfiguracio. Add meg a Firebase web app VITE_FIREBASE_* valtozoit.',
    authTitle: 'Jelentkezz be a katalogushoz',
    authCopy: 'Emaillel es jelszoval ugyanazt a katalogust tobb bongeszobol is elerheted.',
    email: 'Email',
    password: 'Jelszo',
    signIn: 'Belepes',
    signUp: 'Fiok Letrehozasa',
    signOut: 'Kijelentkezes',
    authSuccessSignUp: 'A fiok letrejott. Most mar bejelentkezhetsz.',
    signedInAs: 'Bejelentkezve mint',
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
    },
  },
  es: {
    appTitle: 'Catalogo de Dietas',
    appHeading: 'Referencia de comidas para dos estilos de dieta',
    appCopy: 'Administra alimentos y bebidas con almacenamiento del servidor asociado a tu cuenta.',
    dietNavigation: 'Navegacion de dietas',
    currentDiet: 'Dieta Actual',
    heroCopy: 'Explora alimentos y bebidas, filtra por categoria y guarda cambios con persistencia compartida.',
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
    saveError: 'Ocurrio un error al comunicarse con el servidor.',
    missingConfig:
      'Faltan variables de entorno de Firebase. Agrega los valores VITE_FIREBASE_* de tu app web.',
    authTitle: 'Inicia sesion en tu catalogo',
    authCopy: 'Usa correo y contrasena para cargar el mismo catalogo desde cualquier navegador.',
    email: 'Correo',
    password: 'Contrasena',
    signIn: 'Iniciar Sesion',
    signUp: 'Crear Cuenta',
    signOut: 'Cerrar Sesion',
    authSuccessSignUp: 'Cuenta creada. Ahora puedes iniciar sesion.',
    signedInAs: 'Sesion iniciada como',
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
    },
  },
};

function AuthScreen({
  authMode,
  authValues,
  isSubmitting,
  message,
  setAuthMode,
  setAuthValues,
  onSubmit,
  t,
}) {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">{t.appTitle}</p>
        <h1>{t.authTitle}</h1>
        <p className="auth-copy">{t.authCopy}</p>

        <div className="auth-toggle-row">
          <button
            type="button"
            className={authMode === 'sign-in' ? 'auth-toggle active' : 'auth-toggle'}
            onClick={() => setAuthMode('sign-in')}
          >
            {t.signIn}
          </button>
          <button
            type="button"
            className={authMode === 'sign-up' ? 'auth-toggle active' : 'auth-toggle'}
            onClick={() => setAuthMode('sign-up')}
          >
            {t.signUp}
          </button>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            <span>{t.email}</span>
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
            <span>{t.password}</span>
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

          <button type="submit" disabled={isSubmitting}>
            {authMode === 'sign-in' ? t.signIn : t.signUp}
          </button>
        </form>

        {message ? <p className="status-message">{message}</p> : null}
      </section>
    </main>
  );
}

function userDocRef(userId) {
  return doc(db, 'users', userId);
}

function catalogCollectionRef(userId) {
  return collection(db, 'users', userId, 'catalogItems');
}

async function ensureUserCatalog(user) {
  const userRef = userDocRef(user.uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists() && snapshot.data().catalogInitialized) {
    return snapshot.data();
  }

  const existingData = snapshot.exists() ? snapshot.data() : null;
  const batch = writeBatch(db);

  batch.set(
    userRef,
    {
      email: user.email ?? '',
      language: existingData?.language ?? 'en',
      catalogInitialized: true,
      createdAt: existingData?.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  for (const item of defaultSeedItems) {
    const itemRef = doc(catalogCollectionRef(user.uid));
    batch.set(itemRef, {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();

  return {
    ...existingData,
    language: existingData?.language ?? 'en',
    catalogInitialized: true,
  };
}

async function loadCatalogData(user) {
  const preferences = await ensureUserCatalog(user);
  const itemsQuery = query(catalogCollectionRef(user.uid), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(itemsQuery);

  return {
    catalog: buildCatalog(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    language: preferences.language ?? 'en',
  };
}

function App() {
  const [catalog, setCatalog] = useState(createEmptyCatalog);
  const [activeDiet, setActiveDiet] = useState('Lyme');
  const [language, setLanguage] = useState('en');
  const [filters, setFilters] = useState({ foods: 'All', drinks: 'All' });
  const [drafts, setDrafts] = useState({
    foods: { name: '', category: 'Fruits' },
    drinks: { name: '', category: 'Water' },
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [authMode, setAuthMode] = useState('sign-in');
  const [authValues, setAuthValues] = useState({ email: '', password: '' });

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
    if (!user) {
      setCatalog(createEmptyCatalog());
      return;
    }

    let cancelled = false;

    async function run() {
      setLoading(true);

      try {
        const data = await loadCatalogData(user);
        if (!cancelled) {
          setCatalog(data.catalog);
          setLanguage(data.language);
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error.message ?? translations.en.saveError);
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
  const activeCatalog = catalog[activeDiet];

  const filteredSections = useMemo(() => {
    return sectionNames.reduce((acc, section) => {
      const selectedFilter = filters[section];
      acc[section] = activeCatalog[section].filter((item) => {
        return selectedFilter === 'All' || item.category === selectedFilter;
      });
      return acc;
    }, {});
  }, [activeCatalog, filters]);

  const changeLanguage = async (nextLanguage) => {
    setLanguage(nextLanguage);

    if (!user) {
      return;
    }

    try {
      await setDoc(
        userDocRef(user.uid),
        {
          email: user.email ?? '',
          language: nextLanguage,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      setMessage(error.message ?? t.saveError);
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
        await createUserWithEmailAndPassword(auth, authValues.email, authValues.password);
        setMessage(t.authSuccessSignUp);
      }
    } catch (error) {
      setMessage(error.message ?? t.saveError);
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
      setMessage(error.message ?? t.saveError);
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
      setMessage(error.message ?? t.saveError);
    }
  };

  if (!hasFirebaseEnv) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <p className="status-message">{t.missingConfig}</p>
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
        setAuthMode={setAuthMode}
        setAuthValues={setAuthValues}
        onSubmit={handleAuthSubmit}
        t={t}
      />
    );
  }

  if (loading) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <p className="status-message">{t.loading}</p>
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
              <p className="eyebrow">{t.appTitle}</p>
              <h1>{t.appHeading}</h1>
            </div>
            <label className="language-control">
              <span>{t.language}</span>
              <select value={language} onChange={(event) => changeLanguage(event.target.value)}>
                {languageOptions.map((option) => (
                  <option key={option} value={option}>
                    {t.languages[option]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="sidebar-copy">{t.appCopy}</p>
          <p className="sidebar-copy sidebar-session">
            {t.signedInAs}: {user.email}
          </p>
          <button type="button" className="signout-button" onClick={() => signOut(auth)}>
            {t.signOut}
          </button>
        </div>

        <nav className="diet-nav" aria-label={t.dietNavigation}>
          {dietNames.map((diet) => (
            <button
              key={diet}
              type="button"
              className={diet === activeDiet ? 'diet-link active' : 'diet-link'}
              onClick={() => setActiveDiet(diet)}
            >
              <span>{diet}</span>
              <small>{catalog[diet].foods.length + catalog[diet].drinks.length} {t.items}</small>
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        {message ? <p className="status-message status-banner">{message}</p> : null}
        <section className="hero-card">
          <p className="eyebrow">{t.currentDiet}</p>
          <div className="hero-row">
            <div>
              <h2>{activeDiet}</h2>
              <p>{t.heroCopy}</p>
            </div>
            <div className="hero-stats">
              <div>
                <strong>{activeCatalog.foods.length}</strong>
                <span>{t.foods}</span>
              </div>
              <div>
                <strong>{activeCatalog.drinks.length}</strong>
                <span>{t.drinks}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section-grid">
          {sectionNames.map((section) => (
            <article key={section} className="catalog-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">{t.section}</p>
                  <h3>{t[section]}</h3>
                </div>
                <label className="filter-control">
                  <span>{t.filter}</span>
                  <select
                    value={filters[section]}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        [section]: event.target.value,
                      }))
                    }
                  >
                    {filterOptions[section].map((option) => (
                      <option key={option} value={option}>
                        {t.filters[option]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="add-form">
                <input
                  type="text"
                  value={drafts[section].name}
                  placeholder={t.addPlaceholder[section]}
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
                      {t.filters[option]}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => handleAddItem(section)}>
                  {t.add}
                </button>
              </div>

              <ul className="item-list">
                {filteredSections[section].length === 0 ? (
                  <li className="empty-state">{t.noItems}</li>
                ) : (
                  filteredSections[section].map((item) => (
                    <li key={item.id} className="item-row">
                      <div>
                        <strong>{item.name}</strong>
                        <span>{t.filters[item.category] ?? item.category}</span>
                      </div>
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => handleRemoveItem(section, item.id)}
                      >
                        {t.remove}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
