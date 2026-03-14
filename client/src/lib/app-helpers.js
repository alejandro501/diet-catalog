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

function categoryIdFromName(name, index = 0) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return base || `category-${index}`;
}

export function normalizeFoodCategories(rawFoodCategories) {
  const safe =
    Array.isArray(rawFoodCategories) && rawFoodCategories.length > 0
      ? rawFoodCategories
      : defaultFoodCategories;

  const seen = new Set();

  return safe
    .map((category, index) => {
      if (typeof category === 'string') {
        const trimmed = category.trim();

        if (!trimmed) {
          return null;
        }

        const fallback = defaultFoodCategories.find((entry) => entry.name === trimmed);
        return {
          id: fallback?.id ?? categoryIdFromName(trimmed, index),
          name: trimmed,
          names: {
            en: fallback?.names?.en ?? trimmed,
            hu: fallback?.names?.hu ?? '',
            es: fallback?.names?.es ?? '',
            it: fallback?.names?.it ?? '',
          },
        };
      }

      const canonicalName = category?.name?.trim() || category?.names?.en?.trim() || '';

      if (!canonicalName) {
        return null;
      }

      const fallback = defaultFoodCategories.find((entry) => entry.name === canonicalName);

      return {
        id: category.id ?? fallback?.id ?? categoryIdFromName(canonicalName, index),
        name: canonicalName,
        names: {
          en: category.names?.en?.trim() ?? fallback?.names?.en ?? canonicalName,
          hu: category.names?.hu?.trim() ?? fallback?.names?.hu ?? '',
          es: category.names?.es?.trim() ?? fallback?.names?.es ?? '',
          it: category.names?.it?.trim() ?? fallback?.names?.it ?? '',
        },
      };
    })
    .filter(Boolean)
    .filter((category) => {
      const key = category.name.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
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

export function localizedFoodCategoryName(category, language) {
  if (typeof category === 'string') {
    return category;
  }

  return (
    category?.names?.[language]?.trim() ||
    category?.names?.en?.trim() ||
    category?.name ||
    ''
  );
}

export { translations };
