export type Locale =
  | 'en'
  | 'es'
  | 'zh-CN'
  | 'hi'
  | 'pt-BR'
  | 'fr'
  | 'ja'
  | 'de'
  | 'ar'
  | 'bn'
  | 'ko'
  | 'it';

export interface LocaleMetadata {
  code: Locale;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  flag?: string;
}

export interface LocaleContext {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  autoDetected: boolean;
  setLocale: (locale: Locale) => void;
}

export interface TranslationNamespace {
  [key: string]: string | TranslationNamespace;
}

export interface Translations {
  [namespace: string]: TranslationNamespace;
}
