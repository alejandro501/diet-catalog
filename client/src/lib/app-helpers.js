import { canonicalDietName, defaultDietTypes, defaultFoodCategories, languageOptions } from '../catalog';
import { textFor, translations } from '../i18n';

export function readStoredLanguage(storageKey) {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const saved = window.localStorage.getItem(storageKey);
  return languageOptions.includes(saved) ? saved : 'en';
}

export function formatFirebaseError(error, t) {
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
      return 'Firebase denied this request. Reload once, then check Firestore rules, auth state, and sharing access.';
    case 'unavailable':
      return textFor(t, 'networkBlocked');
    default:
      return message || textFor(t, 'saveError');
  }
}

export function normalizeUsername(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
}

export function titleFromEmail(email) {
  const seed = email?.split('@')[0] ?? 'User';
  return seed.replace(/[._-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function avatarFallback(profile) {
  const name = profile?.name?.trim() || profile?.username?.trim() || 'U';
  return name.charAt(0).toUpperCase();
}

export function mapProfileDoc(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name ?? '',
    username: data.username ?? '',
    normalizedUsername: data.normalizedUsername ?? '',
    isPublic: data.isPublic === true,
  };
}

export function mapShareDoc(snapshot) {
  return {
    id: snapshot.id,
    ...snapshot.data(),
    recipientIds: Array.isArray(snapshot.data()?.recipientIds) ? snapshot.data().recipientIds : [],
    isGlobal: snapshot.data()?.isGlobal === true,
  };
}

export function sortProfiles(profiles) {
  return [...profiles].sort((left, right) => {
    const leftLabel = (left.name || left.username || '').toLowerCase();
    const rightLabel = (right.name || right.username || '').toLowerCase();
    return leftLabel.localeCompare(rightLabel);
  });
}

export function normalizeDietTypes(rawDietTypes) {
  const safe = Array.isArray(rawDietTypes) && rawDietTypes.length > 0 ? rawDietTypes : defaultDietTypes;
  const defaultById = new Map(defaultDietTypes.map((dietType) => [dietType.id, dietType]));
  const defaultByName = new Map(
    defaultDietTypes.map((dietType) => [canonicalDietName(dietType.name), dietType])
  );

  return safe.map((dietType, index) => ({
    ...(() => {
      const canonicalName = canonicalDietName(dietType.name || `Diet ${index + 1}`);
      const fallback =
        (dietType.id && defaultById.get(dietType.id)) ||
        defaultByName.get(canonicalName);
      const nextId =
        dietType.id ||
        fallback?.id ||
        `${canonicalName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'diet'}-${index}`;

      return {
        id: nextId,
        name: canonicalName,
        names: {
          en: dietType.names?.en ?? fallback?.names?.en ?? canonicalName,
          hu: dietType.names?.hu ?? fallback?.names?.hu ?? '',
          es: dietType.names?.es ?? fallback?.names?.es ?? '',
          it: dietType.names?.it ?? fallback?.names?.it ?? '',
        },
        visible: dietType.visible !== false,
        descriptions: {
          en: dietType.descriptions?.en ?? dietType.description ?? fallback?.descriptions?.en ?? '',
          hu: dietType.descriptions?.hu ?? fallback?.descriptions?.hu ?? '',
          es: dietType.descriptions?.es ?? fallback?.descriptions?.es ?? '',
          it: dietType.descriptions?.it ?? fallback?.descriptions?.it ?? '',
        },
      };
    })(),
  }));
}

export function normalizeFoodCategories(rawFoodCategories) {
  const safe =
    Array.isArray(rawFoodCategories) && rawFoodCategories.length > 0
      ? rawFoodCategories
      : defaultFoodCategories;

  return [...new Set(safe.map((category) => category.trim()).filter(Boolean))];
}

export function localizedDietName(dietType, language) {
  return (
    dietType?.names?.[language]?.trim() ||
    dietType?.names?.en?.trim() ||
    dietType?.name ||
    ''
  );
}

export function localizedDietDescription(dietType, language) {
  return (
    dietType?.descriptions?.[language]?.trim() ||
    dietType?.descriptions?.en?.trim() ||
    dietType?.description ||
    ''
  );
}

export { translations };
