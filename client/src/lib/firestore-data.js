import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { buildCatalog, defaultDietTypes, defaultSeedItems } from '../catalog';
import { db } from './firebase';
import {
  mapProfileDoc,
  mapShareDoc,
  normalizeDietTypes,
  normalizeFoodCategories,
  normalizeUsername,
  sortProfiles,
  titleFromEmail,
} from './app-helpers';

export function userDocRef(userId) {
  return doc(db, 'users', userId);
}

export function profileDocRef(userId) {
  return doc(db, 'profiles', userId);
}

export function sharedDietDocRef(ownerId, dietId) {
  return doc(db, 'sharedDiets', `${ownerId}_${dietId}`);
}

export function sharedDietItemsCollectionRef(ownerId, dietId) {
  return collection(db, 'sharedDiets', `${ownerId}_${dietId}`, 'items');
}

export function sharedDietItemDocRef(ownerId, dietId, itemId) {
  return doc(db, 'sharedDiets', `${ownerId}_${dietId}`, 'items', itemId);
}

export function catalogCollectionRef(userId) {
  return collection(db, 'users', userId, 'catalogItems');
}

export async function ensureUserSetup(user) {
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
  const normalizedFoodCategories = normalizeFoodCategories(privateSnapshot.data()?.foodCategories);
  const batch = writeBatch(db);
  let shouldCommit = false;

  if (
    !privateSnapshot.exists() ||
    !privateSnapshot.data()?.catalogInitialized ||
    !privateSnapshot.data()?.dietTypes ||
    !privateSnapshot.data()?.foodCategories
  ) {
    batch.set(
      privateRef,
      {
        language: privateSnapshot.data()?.language ?? 'en',
        catalogInitialized: true,
        dietTypes: normalizedDietTypes,
        foodCategories: normalizedFoodCategories,
        createdAt: privateSnapshot.data()?.createdAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    shouldCommit = true;
  }

  if (!publicSnapshot.exists()) {
    batch.set(
      publicRef,
      {
        name: defaultName,
        username: defaultUsername,
        normalizedUsername: defaultUsername,
        isPublic: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    shouldCommit = true;
  }

  const existingSeedKeys = new Set();
  const duplicateDocIds = [];

  catalogSnapshot.docs.forEach((entry) => {
    const data = entry.data();
    const ingredients = Array.isArray(data.ingredients) ? data.ingredients.join('|') : '';
    const key = `${data.dietName}::${data.sectionName}::${data.itemName}::${data.category ?? ''}::${ingredients}`;

    if (existingSeedKeys.has(key)) {
      duplicateDocIds.push(entry.id);
      return;
    }

    existingSeedKeys.add(key);
  });

  for (const duplicateId of duplicateDocIds) {
    batch.delete(doc(db, 'users', user.uid, 'catalogItems', duplicateId));
    shouldCommit = true;
  }

  for (const item of defaultSeedItems) {
    const ingredients = Array.isArray(item.ingredients) ? item.ingredients.join('|') : '';
    const key = `${item.dietName}::${item.sectionName}::${item.itemName}::${item.category ?? ''}::${ingredients}`;

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
    foodCategories: normalizeFoodCategories(nextPrivateSnapshot.data()?.foodCategories),
    profile: mapProfileDoc(nextPublicSnapshot),
  };
}

export async function loadCatalogRows(userId) {
  const snapshot = await getDocs(query(catalogCollectionRef(userId), orderBy('createdAt', 'desc')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function loadProfiles() {
  const snapshot = await getDocs(collection(db, 'profiles'));
  return sortProfiles(snapshot.docs.map(mapProfileDoc));
}

export async function loadIncomingShares(userId) {
  const directSnapshot = await getDocs(
    query(collection(db, 'sharedDiets'), where('recipientIds', 'array-contains', userId))
  );
  const globalSnapshot = await getDocs(query(collection(db, 'sharedDiets'), where('isGlobal', '==', true)));
  const deduped = new Map();

  [...directSnapshot.docs, ...globalSnapshot.docs].forEach((entry) => {
    deduped.set(entry.id, mapShareDoc(entry));
  });

  return [...deduped.values()].filter((entry) => entry.ownerId !== userId);
}

export async function loadOutgoingShares(userId) {
  const snapshot = await getDocs(query(collection(db, 'sharedDiets'), where('ownerId', '==', userId)));
  return snapshot.docs.map(mapShareDoc);
}

export async function loadSharesSafely(userId) {
  const [incomingResult, outgoingResult] = await Promise.allSettled([
    loadIncomingShares(userId),
    loadOutgoingShares(userId),
  ]);

  return {
    incomingShares: incomingResult.status === 'fulfilled' ? incomingResult.value : [],
    outgoingShares: outgoingResult.status === 'fulfilled' ? outgoingResult.value : [],
  };
}

export async function loadSharedDietItems(ownerId, dietId) {
  const snapshot = await getDocs(query(sharedDietItemsCollectionRef(ownerId, dietId), orderBy('createdAt', 'desc')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export function buildSharedDietTypes(catalog) {
  return Object.keys(catalog).map((name, index) => ({
    id: `shared-${index}`,
    name,
    visible: true,
  }));
}

export function emptySharedCatalog() {
  return buildCatalog([], defaultDietTypes);
}
