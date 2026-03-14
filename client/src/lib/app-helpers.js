import { defaultDietTypes, defaultFoodCategories, languageOptions } from '../catalog';
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
  };
}

export function mapShareDoc(snapshot) {
  return snapshot.data();
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
  return safe.map((dietType, index) => ({
    id: dietType.id || `${dietType.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'diet'}-${index}`,
    name: dietType.name || `Diet ${index + 1}`,
    visible: dietType.visible !== false,
    description: dietType.description ?? '',
  }));
}

export function normalizeFoodCategories(rawFoodCategories) {
  const safe =
    Array.isArray(rawFoodCategories) && rawFoodCategories.length > 0
      ? rawFoodCategories
      : defaultFoodCategories;

  return [...new Set(safe.map((category) => category.trim()).filter(Boolean))];
}

export { translations };
