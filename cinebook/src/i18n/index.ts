import type { SupportedLanguage, TranslationSchema } from './types';
import { en } from './locales/en';
import { hi } from './locales/hi';
import { te } from './locales/te';
import { ta } from './locales/ta';
import { kn } from './locales/kn';
import { ml } from './locales/ml';
import { bn } from './locales/bn';
import { mr } from './locales/mr';
import { gu } from './locales/gu';
import { pa } from './locales/pa';
import { or } from './locales/or';
import { ur } from './locales/ur';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { zh } from './locales/zh';

export const TRANSLATIONS: Record<SupportedLanguage, TranslationSchema> = {
  en,
  hi,
  te,
  ta,
  kn,
  ml,
  bn,
  mr,
  gu,
  pa,
  or,
  ur,
  es,
  fr,
  de,
  ja,
  ko,
  zh
};

export * from './types';
