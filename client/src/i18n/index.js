import en from './en';
import es from './es';
import hu from './hu';
import it from './it';

export const translations = { en, hu, es, it };

export function textFor(t, key) {
  return t[key] ?? translations.en[key] ?? key;
}
