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
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  buildCatalog,
  createEmptyCatalog,
  defaultDietTypes,
  defaultFoodCategories,
  languageOptions,
} from './catalog';
import AuthScreen from './components/AuthScreen';
import CatalogView from './components/CatalogView';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import SharedListsView from './components/SharedListsView';
import UsersView from './components/UsersView';
import { auth, db, hasFirebaseEnv } from './lib/firebase';
import {
  catalogCollectionRef,
  ensureUserSetup,
  loadCatalogRows,
  loadProfiles,
  loadSharedDietItems,
  loadSharesSafely,
  profileDocRef,
  sharedDietDocRef,
  sharedDietItemDocRef,
  userDocRef,
} from './lib/firestore-data';
import {
  avatarFallback,
  formatFirebaseError,
  normalizeDietTypes,
  normalizeFoodCategories,
  normalizeUsername,
  readStoredLanguage,
  translations,
} from './lib/app-helpers';
import { textFor } from './i18n';

const LANGUAGE_STORAGE_KEY = 'diet-catalog-language';

const menuItems = [
  { id: 'profile', textKey: 'menuProfile' },
  { id: 'catalog', textKey: 'menuCatalog' },
  { id: 'users', textKey: 'menuUsers' },
  { id: 'shared', textKey: 'menuShared' },
  { id: 'settings', textKey: 'menuSettings' },
];

const sidebarTitleKeys = {
  profile: 'profileTitle',
  catalog: 'menuCatalog',
  users: 'usersTitle',
  shared: 'sharedTitle',
  settings: 'settingsTitle',
};

function createItemDrafts() {
  return {
    foods: { name: '', category: defaultFoodCategories[0] },
    drinks: { name: '', category: 'Water' },
    vitamins: { name: '', category: 'Vitamin' },
    spices: { name: '', category: 'Herb' },
  };
}

function createCategoryDrafts(categories = defaultFoodCategories) {
  return categories.map((category) => ({
    id: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: category,
  }));
}

function createDietNameDraft() {
  return { en: '', hu: '', es: '', it: '' };
}

function App() {
  const [catalog, setCatalog] = useState(createEmptyCatalog(defaultDietTypes));
  const [dietTypes, setDietTypes] = useState(defaultDietTypes);
  const [dietDrafts, setDietDrafts] = useState(defaultDietTypes);
  const [newDietName, setNewDietName] = useState(createDietNameDraft);
  const [foodCategories, setFoodCategories] = useState(defaultFoodCategories);
  const [foodCategoryDrafts, setFoodCategoryDrafts] = useState(createCategoryDrafts(defaultFoodCategories));
  const [newFoodCategory, setNewFoodCategory] = useState('');
  const [activeDiet, setActiveDiet] = useState(defaultDietTypes[0].name);
  const [sharedActiveDiet, setSharedActiveDiet] = useState(defaultDietTypes[0].name);
  const [activeView, setActiveView] = useState('catalog');
  const [language, setLanguage] = useState(() => readStoredLanguage(LANGUAGE_STORAGE_KEY));
  const [filters, setFilters] = useState({ foods: 'All', drinks: 'All', vitamins: 'All', spices: 'All' });
  const [drafts, setDrafts] = useState(createItemDrafts);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharedLoading, setSharedLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [authMode, setAuthMode] = useState('sign-in');
  const [authValues, setAuthValues] = useState({ email: '', password: '', confirmPassword: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileDraft, setProfileDraft] = useState({ name: '', username: '', isPublic: false });
  const [profiles, setProfiles] = useState([]);
  const [incomingShares, setIncomingShares] = useState([]);
  const [outgoingShares, setOutgoingShares] = useState([]);
  const [selectedSharedEntry, setSelectedSharedEntry] = useState(null);
  const [sharedCatalog, setSharedCatalog] = useState(createEmptyCatalog(defaultDietTypes));
  const [sharedDietTypes, setSharedDietTypes] = useState(defaultDietTypes);

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
    if (nextVisible.length > 0 && !nextVisible.includes(activeDiet)) {
      setActiveDiet(nextVisible[0]);
    }
  }, [activeDiet, dietTypes]);

  useEffect(() => {
    if (foodCategories.length === 0) {
      return;
    }

    setDrafts((current) => ({
      ...current,
      foods: {
        ...current.foods,
        category: foodCategories.includes(current.foods.category) ? current.foods.category : foodCategories[0],
      },
    }));
  }, [foodCategories]);

  useEffect(() => {
    if (!user) {
      setCatalog(createEmptyCatalog(defaultDietTypes));
      setDietTypes(defaultDietTypes);
      setDietDrafts(defaultDietTypes);
      setFoodCategories(defaultFoodCategories);
      setFoodCategoryDrafts(createCategoryDrafts(defaultFoodCategories));
      setDrafts(createItemDrafts());
      setProfiles([]);
      setIncomingShares([]);
      setOutgoingShares([]);
      setSelectedSharedEntry(null);
      setSharedCatalog(createEmptyCatalog(defaultDietTypes));
      setSharedDietTypes(defaultDietTypes);
      return;
    }

    let cancelled = false;

    async function run() {
      setLoading(true);

      try {
        const setup = await ensureUserSetup(user);
        const [ownRows, nextProfiles, shareData] = await Promise.all([
          loadCatalogRows(user.uid),
          loadProfiles(),
          loadSharesSafely(user.uid),
        ]);

        if (cancelled) {
          return;
        }

        const preferredLanguage = readStoredLanguage(LANGUAGE_STORAGE_KEY);
        setLanguage(preferredLanguage || setup.language);
        setDietTypes(setup.dietTypes);
        setDietDrafts(setup.dietTypes);
        setFoodCategories(setup.foodCategories);
        setFoodCategoryDrafts(createCategoryDrafts(setup.foodCategories));
        setActiveDiet(setup.dietTypes.find((dietType) => dietType.visible)?.name ?? setup.dietTypes[0].name);
        setProfile(setup.profile);
        setProfileDraft({
          name: setup.profile.name,
          username: setup.profile.username,
          isPublic: setup.profile.isPublic === true,
        });
        setCatalog(buildCatalog(ownRows, setup.dietTypes));
        setProfiles(nextProfiles);
        setIncomingShares(shareData.incomingShares);
        setOutgoingShares(shareData.outgoingShares);
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeView]);

  const t = translations[language];
  const sidebarTitle = textFor(t, sidebarTitleKeys[activeView] ?? 'appTitle');

  const publicProfiles = useMemo(() => {
    return profiles.filter((profileEntry) => profileEntry.isPublic || profileEntry.id === user?.uid);
  }, [profiles, user?.uid]);

  const shareableProfiles = useMemo(() => {
    return profiles.filter((profileEntry) => profileEntry.isPublic && profileEntry.id !== user?.uid);
  }, [profiles, user?.uid]);

  const profileMap = useMemo(() => {
    return new Map(profiles.map((profileEntry) => [profileEntry.id, profileEntry]));
  }, [profiles]);

  const sharedEntries = useMemo(() => {
    return incomingShares.map((entry) => {
      const ownerProfile = profileMap.get(entry.ownerId);
      const dietMatch = defaultDietTypes.find((dietType) => dietType.id === entry.dietId);

      return {
        ...entry,
        ownerName: ownerProfile?.name ?? '',
        ownerUsername: ownerProfile?.username ?? '',
        dietLabel:
          entry.dietNames?.[language]?.trim() ||
          entry.dietNames?.en?.trim() ||
          dietMatch?.names?.[language] ||
          entry.dietName,
      };
    });
  }, [incomingShares, language, profileMap]);

  const activeDietMeta = useMemo(() => {
    return dietTypes.find((dietType) => dietType.name === activeDiet) ?? dietTypes[0];
  }, [activeDiet, dietTypes]);

  const activeDietShare = useMemo(() => {
    if (!activeDietMeta) {
      return null;
    }

    return outgoingShares.find((entry) => entry.dietId === activeDietMeta.id) ?? null;
  }, [activeDietMeta, outgoingShares]);

  const activeDietRecipients = useMemo(() => {
    if (!activeDietShare) {
      return [];
    }

    return activeDietShare.recipientIds
      .map((recipientId) => profileMap.get(recipientId))
      .filter(Boolean);
  }, [activeDietShare, profileMap]);

  async function refreshAppData(nextSelectedId = selectedSharedEntry?.id ?? null) {
    if (!user) {
      return;
    }

    const [ownRows, nextProfiles, shareData, privateSnapshot] = await Promise.all([
      loadCatalogRows(user.uid),
      loadProfiles(),
      loadSharesSafely(user.uid),
      getDoc(userDocRef(user.uid)),
    ]);

    const nextDietTypes = normalizeDietTypes(privateSnapshot.data()?.dietTypes);
    const nextFoodCategories = normalizeFoodCategories(privateSnapshot.data()?.foodCategories);
    setDietTypes(nextDietTypes);
    setDietDrafts(nextDietTypes);
    setFoodCategories(nextFoodCategories);
    setFoodCategoryDrafts(createCategoryDrafts(nextFoodCategories));
    setCatalog(buildCatalog(ownRows, nextDietTypes));
    setProfiles(nextProfiles);
    setIncomingShares(shareData.incomingShares);
    setOutgoingShares(shareData.outgoingShares);

    if (!nextSelectedId) {
      return;
    }

    const matched = shareData.incomingShares.find((entry) => entry.id === nextSelectedId) ?? null;
    setSelectedSharedEntry(matched);
  }

  async function changeLanguage(nextLanguage) {
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
  }

  function handleDraftChange(section, key, value) {
    setDrafts((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value,
      },
    }));
  }

  async function syncSharedDietDocument(dietMeta, nextShareState) {
    if (!user || !dietMeta) {
      return;
    }

    const shareRef = sharedDietDocRef(user.uid, dietMeta.id);
    const shouldExist = nextShareState.isGlobal || nextShareState.recipientIds.length > 0;

    if (!shouldExist) {
      const snapshot = await getDocs(collection(db, 'sharedDiets', `${user.uid}_${dietMeta.id}`, 'items'));
      const batch = writeBatch(db);
      snapshot.docs.forEach((entry) => batch.delete(entry.ref));
      batch.delete(shareRef);
      await batch.commit();
      return;
    }

    const itemsForDiet = Object.entries(catalog[dietMeta.name] ?? {}).flatMap(([sectionName, items]) =>
      items.map((item) => ({
        id: item.id,
        dietName: dietMeta.name,
        sectionName,
        itemName: item.name,
        category: item.category,
        ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
      }))
    );

    const batch = writeBatch(db);
    batch.set(
      shareRef,
      {
        ownerId: user.uid,
        dietId: dietMeta.id,
        dietName: dietMeta.name,
        dietNames: dietMeta.names ?? { en: dietMeta.name, hu: '', es: '', it: '' },
        dietDescriptions: dietMeta.descriptions ?? { en: '', hu: '', es: '', it: '' },
        isGlobal: nextShareState.isGlobal,
        recipientIds: nextShareState.recipientIds,
        updatedAt: serverTimestamp(),
        createdAt: nextShareState.createdAt ?? serverTimestamp(),
      },
      { merge: true }
    );

    const existingSharedItems = await getDocs(collection(db, 'sharedDiets', `${user.uid}_${dietMeta.id}`, 'items'));
    const itemIds = new Set(itemsForDiet.map((item) => item.id));
    existingSharedItems.docs.forEach((entry) => {
      if (!itemIds.has(entry.id)) {
        batch.delete(entry.ref);
      }
    });

    itemsForDiet.forEach((item) => {
      batch.set(sharedDietItemDocRef(user.uid, dietMeta.id, item.id), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
  }

  async function handleAuthSubmit(event) {
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
  }

  async function handleAddItem(section) {
    const name = drafts[section].name.trim();
    const category = drafts[section].category;

    if (!name || !user || !activeDietMeta) {
      return;
    }

    try {
      const itemRef = await addDoc(catalogCollectionRef(user.uid), {
        dietName: activeDiet,
        dietId: activeDietMeta.id,
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

      if (activeDietShare) {
        await setDoc(
          sharedDietItemDocRef(user.uid, activeDietMeta.id, itemRef.id),
          {
            dietName: activeDiet,
            dietId: activeDietMeta.id,
            sectionName: section,
            itemName: name,
            category,
            ingredients: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (error) {
      setMessage(formatFirebaseError(error, t));
    }
  }

  async function handleRemoveItem(section, id) {
    if (!user) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'catalogItems', id));
      if (activeDietMeta && activeDietShare) {
        await deleteDoc(sharedDietItemDocRef(user.uid, activeDietMeta.id, id));
      }
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
  }

  async function handleAddSmoothie({ name, ingredients }) {
    if (!user || !name || !activeDietMeta) {
      return;
    }

    try {
      const cleanedIngredients = [...new Set(ingredients.map((ingredient) => ingredient.trim()).filter(Boolean))];
      const itemRef = await addDoc(catalogCollectionRef(user.uid), {
        dietName: activeDiet,
        dietId: activeDietMeta.id,
        sectionName: 'smoothies',
        itemName: name,
        category: 'Smoothie',
        ingredients: cleanedIngredients,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setCatalog((current) => ({
        ...current,
        [activeDiet]: {
          ...current[activeDiet],
          smoothies: [
            { id: itemRef.id, name, category: 'Smoothie', ingredients: cleanedIngredients },
            ...current[activeDiet].smoothies,
          ],
        },
      }));

      if (activeDietShare) {
        await setDoc(
          sharedDietItemDocRef(user.uid, activeDietMeta.id, itemRef.id),
          {
            dietName: activeDiet,
            dietId: activeDietMeta.id,
            sectionName: 'smoothies',
            itemName: name,
            category: 'Smoothie',
            ingredients: cleanedIngredients,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (error) {
      setMessage(formatFirebaseError(error, t));
    }
  }

  async function handleAddSmoothieIngredient(smoothieId, ingredient) {
    if (!user) {
      return;
    }

    const nextIngredient = ingredient.trim();
    if (!nextIngredient) {
      return;
    }

    const smoothie = catalog[activeDiet]?.smoothies.find((entry) => entry.id === smoothieId);
    if (!smoothie) {
      return;
    }

    const nextIngredients = [...new Set([...smoothie.ingredients, nextIngredient])];

    try {
      await updateDoc(doc(db, 'users', user.uid, 'catalogItems', smoothieId), {
        ingredients: nextIngredients,
        updatedAt: serverTimestamp(),
      });

      if (activeDietMeta && activeDietShare) {
        await setDoc(
          sharedDietItemDocRef(user.uid, activeDietMeta.id, smoothieId),
          {
            dietName: activeDiet,
            dietId: activeDietMeta.id,
            sectionName: 'smoothies',
            itemName: smoothie.name,
            category: smoothie.category,
            ingredients: nextIngredients,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      setCatalog((current) => ({
        ...current,
        [activeDiet]: {
          ...current[activeDiet],
          smoothies: current[activeDiet].smoothies.map((entry) =>
            entry.id === smoothieId ? { ...entry, ingredients: nextIngredients } : entry
          ),
        },
      }));
    } catch (error) {
      setMessage(formatFirebaseError(error, t));
    }
  }

  async function handleRemoveSmoothieIngredient(smoothieId, ingredientIndex) {
    if (!user) {
      return;
    }

    const smoothie = catalog[activeDiet]?.smoothies.find((entry) => entry.id === smoothieId);
    if (!smoothie) {
      return;
    }

    const nextIngredients = smoothie.ingredients.filter((_, index) => index !== ingredientIndex);

    try {
      await updateDoc(doc(db, 'users', user.uid, 'catalogItems', smoothieId), {
        ingredients: nextIngredients,
        updatedAt: serverTimestamp(),
      });

      if (activeDietMeta && activeDietShare) {
        await setDoc(
          sharedDietItemDocRef(user.uid, activeDietMeta.id, smoothieId),
          {
            dietName: activeDiet,
            dietId: activeDietMeta.id,
            sectionName: 'smoothies',
            itemName: smoothie.name,
            category: smoothie.category,
            ingredients: nextIngredients,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      setCatalog((current) => ({
        ...current,
        [activeDiet]: {
          ...current[activeDiet],
          smoothies: current[activeDiet].smoothies.map((entry) =>
            entry.id === smoothieId ? { ...entry, ingredients: nextIngredients } : entry
          ),
        },
      }));
    } catch (error) {
      setMessage(formatFirebaseError(error, t));
    }
  }

  async function handleRemoveSmoothie(smoothieId) {
    await handleRemoveItem('smoothies', smoothieId);
  }

  async function handleSaveProfile() {
    if (!user) {
      return;
    }

    const name = profileDraft.name.trim();
    const username = profileDraft.username.trim();
    const normalizedUsername = normalizeUsername(username);
    const isPublic = profileDraft.isPublic === true;

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
        isPublic,
        updatedAt: serverTimestamp(),
      };

      await setDoc(profileDocRef(user.uid), payload, { merge: true });
      setProfile({ id: user.uid, ...payload });
      await refreshAppData(selectedSharedEntry?.id ?? null);
      setMessage(textFor(t, 'profileSaved'));
    } catch (error) {
      console.error('Profile save failed', error);
      setMessage(formatFirebaseError(error, t));
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleToggleDietGlobalShare(nextIsGlobal) {
    if (!user || !activeDietMeta) {
      return;
    }

    try {
      const nextShareState = {
        ...(activeDietShare ?? {}),
        ownerId: user.uid,
        dietId: activeDietMeta.id,
        dietName: activeDietMeta.name,
        recipientIds: activeDietShare?.recipientIds ?? [],
        isGlobal: nextIsGlobal,
      };

      await syncSharedDietDocument(activeDietMeta, nextShareState);
      await refreshAppData(selectedSharedEntry?.id ?? null);
      setMessage(nextIsGlobal ? textFor(t, 'dietShareGlobalEnabled') : textFor(t, 'dietShareGlobalDisabled'));
    } catch (error) {
      setMessage(formatFirebaseError(error, t));
    }
  }

  async function handleAddDietShareRecipient(recipientProfile) {
    if (!user || !activeDietMeta) {
      return;
    }

    const nextRecipientIds = [...new Set([...(activeDietShare?.recipientIds ?? []), recipientProfile.id])];

    try {
      await syncSharedDietDocument(activeDietMeta, {
        ...(activeDietShare ?? {}),
        ownerId: user.uid,
        dietId: activeDietMeta.id,
        dietName: activeDietMeta.name,
        recipientIds: nextRecipientIds,
        isGlobal: activeDietShare?.isGlobal === true,
      });
      await refreshAppData(selectedSharedEntry?.id ?? null);
      setMessage(textFor(t, 'dietShareRecipientAdded'));
    } catch (error) {
      setMessage(formatFirebaseError(error, t));
    }
  }

  async function handleRemoveDietShareRecipient(recipientId) {
    if (!user || !activeDietMeta || !activeDietShare) {
      return;
    }

    const nextRecipientIds = activeDietShare.recipientIds.filter((entry) => entry !== recipientId);

    try {
      await syncSharedDietDocument(activeDietMeta, {
        ...activeDietShare,
        recipientIds: nextRecipientIds,
      });
      await refreshAppData(selectedSharedEntry?.id ?? null);
      setMessage(textFor(t, 'dietShareRecipientRemoved'));
    } catch (error) {
      setMessage(formatFirebaseError(error, t));
    }
  }

  async function handleOpenShared(sharedEntry) {
    setActiveView('shared');
    setSelectedSharedEntry(sharedEntry);
    setSharedLoading(true);

    try {
      const rows = await loadSharedDietItems(sharedEntry.ownerId, sharedEntry.dietId);
      const nextSharedDietTypes = [
        {
          id: sharedEntry.dietId,
          name: sharedEntry.dietName,
          names: sharedEntry.dietNames ?? { en: sharedEntry.dietName, hu: '', es: '', it: '' },
          descriptions: sharedEntry.dietDescriptions ?? { en: '', hu: '', es: '', it: '' },
          visible: true,
        },
      ];
      setSharedDietTypes(nextSharedDietTypes);
      setSharedCatalog(buildCatalog(rows, nextSharedDietTypes));
      setSharedActiveDiet(nextSharedDietTypes[0]?.name ?? defaultDietTypes[0].name);
    } catch (error) {
      setMessage(formatFirebaseError(error, t));
    } finally {
      setSharedLoading(false);
    }
  }

  function handleAddDietType() {
    const englishName = newDietName.en.trim();

    if (!englishName) {
      setMessage(textFor(t, 'settingsDietNameRequired'));
      return;
    }

    if (dietDrafts.some((dietType) => dietType.name.toLowerCase() === englishName.toLowerCase())) {
      setMessage(textFor(t, 'settingsDietNameTaken'));
      return;
    }

    setDietDrafts((current) => [
      ...current,
      {
        id: englishName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: englishName,
        names: {
          en: englishName,
          hu: newDietName.hu.trim(),
          es: newDietName.es.trim(),
          it: newDietName.it.trim(),
        },
        descriptions: {
          en: '',
          hu: '',
          es: '',
          it: '',
        },
        visible: true,
      },
    ]);
    setNewDietName(createDietNameDraft());
  }

  function handleAddFoodCategory() {
    const name = newFoodCategory.trim();

    if (!name) {
      setMessage(textFor(t, 'settingsCategoryNameRequired'));
      return;
    }

    if (foodCategoryDrafts.some((category) => category.name.toLowerCase() === name.toLowerCase())) {
      setMessage(textFor(t, 'settingsCategoryNameTaken'));
      return;
    }

    setFoodCategoryDrafts((current) => [
      ...current,
      {
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name,
      },
    ]);
    setNewFoodCategory('');
  }

  function handleEditFoodCategory(categoryId, value) {
    setFoodCategoryDrafts((current) =>
      current.map((category) => (category.id === categoryId ? { ...category, name: value } : category))
    );
  }

  function handleDeleteFoodCategory(categoryId) {
    setFoodCategoryDrafts((current) => current.filter((category) => category.id !== categoryId));
  }

  function handleToggleDietVisibility(dietId) {
    setDietDrafts((current) => {
      const next = current.map((dietType) =>
        dietType.id === dietId ? { ...dietType, visible: !dietType.visible } : dietType
      );

      return next.some((dietType) => dietType.visible) ? next : current;
    });
  }

  function handleDeleteDietType(dietId) {
    setDietDrafts((current) => {
      if (current.length === 1) {
        return current;
      }

      const next = current.filter((dietType) => dietType.id !== dietId);
      return next.some((dietType) => dietType.visible) ? next : current;
    });
  }

  function handleEditDietType(dietId, languageCode, value) {
    setDietDrafts((current) =>
      current.map((dietType) =>
        dietType.id === dietId
          ? {
              ...dietType,
              name: languageCode === 'en' ? value : dietType.name,
              names: {
                en: dietType.names?.en ?? dietType.name,
                hu: dietType.names?.hu ?? '',
                es: dietType.names?.es ?? '',
                it: dietType.names?.it ?? '',
                [languageCode]: value,
              },
            }
          : dietType
      )
    );
  }

  async function handleSaveDietTypes() {
    if (!user) {
      return;
    }

    if (!dietDrafts.some((dietType) => dietType.visible)) {
      setMessage(textFor(t, 'settingsNeedVisibleDiet'));
      return;
    }

    const cleanedDietDrafts = dietDrafts.map((dietType) => ({
      ...dietType,
      name: (dietType.names?.en ?? dietType.name).trim(),
      names: {
        en: (dietType.names?.en ?? dietType.name).trim(),
        hu: dietType.names?.hu?.trim() ?? '',
        es: dietType.names?.es?.trim() ?? '',
        it: dietType.names?.it?.trim() ?? '',
      },
    }));
    const cleanedFoodCategories = normalizeFoodCategories(foodCategoryDrafts.map((category) => category.name));

    if (cleanedDietDrafts.some((dietType) => !dietType.name)) {
      setMessage(textFor(t, 'settingsDietNameRequired'));
      return;
    }
    if (cleanedFoodCategories.length === 0) {
      setMessage(textFor(t, 'settingsCategoryNameRequired'));
      return;
    }

    if (
      new Set(cleanedDietDrafts.map((dietType) => dietType.name.toLowerCase())).size !==
      cleanedDietDrafts.length
    ) {
      setMessage(textFor(t, 'settingsDietNameTaken'));
      return;
    }
    if (cleanedFoodCategories.length !== foodCategoryDrafts.length) {
      setMessage(textFor(t, 'settingsCategoryNameTaken'));
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
          foodCategories: cleanedFoodCategories,
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

      await refreshAppData(selectedSharedEntry?.id ?? null);
      setMessage(textFor(t, 'settingsSaved'));
    } catch (error) {
      setMessage(formatFirebaseError(error, t));
    }
  }

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
        language={language}
        languageOptions={languageOptions}
        message={message}
        onChangeLanguage={changeLanguage}
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
      <aside className={mobileMenuOpen ? 'sidebar mobile-open' : 'sidebar'}>
        <div>
          <div className="sidebar-topbar">
            <div>
              <p className="eyebrow">{textFor(t, 'appTitle')}</p>
              <h1>{sidebarTitle}</h1>
            </div>
          </div>

          <nav className="menu-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={activeView === item.id ? 'menu-link active' : 'menu-link'}
                onClick={() => {
                  setActiveView(item.id);
                  setMobileMenuOpen(false);
                }}
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
          <label className="language-control sidebar-language">
            <span>{textFor(t, 'language')}</span>
            <select value={language} onChange={(event) => changeLanguage(event.target.value)}>
              {languageOptions.map((option) => (
                <option key={option} value={option}>
                  {t.languages?.[option] ?? translations.en.languages[option]}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="signout-button" onClick={() => signOut(auth)}>
            {textFor(t, 'signOut')}
          </button>
        </div>
      </aside>

      {mobileMenuOpen ? <button type="button" className="mobile-backdrop" onClick={() => setMobileMenuOpen(false)} /> : null}

      <main className="content">
        <div className="topbar">
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            <span className="mobile-menu-icon" aria-hidden="true">
              |||
            </span>
            <span>{textFor(t, 'mobileMenu')}</span>
          </button>
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
            foodCategories={foodCategories}
            handleAddItem={handleAddItem}
            handleAddDietShareRecipient={handleAddDietShareRecipient}
            handleAddSmoothie={handleAddSmoothie}
            handleAddSmoothieIngredient={handleAddSmoothieIngredient}
            handleDraftChange={handleDraftChange}
            handleRemoveDietShareRecipient={handleRemoveDietShareRecipient}
            handleRemoveItem={handleRemoveItem}
            handleRemoveSmoothie={handleRemoveSmoothie}
            handleRemoveSmoothieIngredient={handleRemoveSmoothieIngredient}
            handleToggleDietGlobalShare={handleToggleDietGlobalShare}
            language={language}
            shareCandidates={shareableProfiles.filter(
              (profileEntry) => !activeDietShare?.recipientIds?.includes(profileEntry.id)
            )}
            sharedGlobally={activeDietShare?.isGlobal === true}
            sharedRecipients={activeDietRecipients}
            setActiveDiet={setActiveDiet}
            setFilters={setFilters}
            t={t}
          />
        ) : null}

        {activeView === 'users' ? (
          <UsersView
            currentUserId={user.uid}
            profiles={publicProfiles}
            t={t}
          />
        ) : null}

        {activeView === 'shared' ? (
          <SharedListsView
            activeDiet={sharedActiveDiet}
            dietTypes={sharedDietTypes}
            language={language}
            loading={sharedLoading}
            onSelectShare={handleOpenShared}
            selectedShare={selectedSharedEntry}
            setActiveDiet={setSharedActiveDiet}
            sharedCatalog={sharedCatalog}
            sharedEntries={sharedEntries}
            t={t}
          />
        ) : null}

        {activeView === 'settings' ? (
          <SettingsView
            dietDrafts={dietDrafts}
            foodCategoryDrafts={foodCategoryDrafts}
            newDietName={newDietName}
            newFoodCategory={newFoodCategory}
            onAddDietType={handleAddDietType}
            onAddFoodCategory={handleAddFoodCategory}
            onDeleteFoodCategory={handleDeleteFoodCategory}
            onDeleteDietType={handleDeleteDietType}
            onEditDietType={handleEditDietType}
            onEditFoodCategory={handleEditFoodCategory}
            onSaveDietTypes={handleSaveDietTypes}
            onToggleDietVisibility={handleToggleDietVisibility}
            setNewDietName={setNewDietName}
            setNewFoodCategory={setNewFoodCategory}
            t={t}
          />
        ) : null}
      </main>
    </div>
  );
}

export default App;
