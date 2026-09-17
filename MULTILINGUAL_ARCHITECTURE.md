# PixProMax Multilingual Architecture Plan

## Overview

This document outlines the complete architecture and implementation strategy for adding 12-language support to PixProMax while maintaining:
- No breaking changes to existing functionality
- Hydration-safe client-side rendering
- Local translation files (NO runtime API calls)
- RTL support for Arabic
- Single canonical URL (no multilingual SEO yet)
- Seamless auto-detection with user override capability

---

## Target Languages

1. English (en) - Default
2. Spanish (es)
3. Chinese Simplified (zh-CN)
4. Hindi (hi)
5. Portuguese (pt-BR)
6. French (fr)
7. Japanese (ja)
8. German (de)
9. Arabic (ar) - RTL
10. Bengali (bn)
11. Korean (ko)
12. Italian (it)

---

## Architecture Overview

### Language Detection Flow

```
Browser Visit
    ↓
1. Check localStorage (pixpromax-locale)
    ↓ (Not set) →
2. Read Accept-Language header (server-side)
    ↓ (No match) →
3. Use navigator.language (client-side)
    ↓ (No match) →
4. Fallback to English (en)
    ↓
Apply Language
    ↓
Show 8-12 second notification (if auto-detected)
    ↓
User can change in header language selector
```

### Hydration Safety

**Critical:** The language preference must be:
1. Set on the server using cookies/headers to avoid hydration mismatch
2. Applied in root layout before rendering content
3. Stored in context for component consumption
4. NOT read from `localStorage` on server (use only on client for fallback detection)

**Approach:** 
- Server reads locale from cookie or Accept-Language header
- Set `<html lang={locale}>` and pass to context
- Root script reads localStorage for client-side preference persistence
- Client-side context provider handles dynamic switches

---

## File Structure

### New Directories

```
locales/
├── en/
│   ├── common.json           (header, footer, navigation)
│   ├── tools.json            (all tool names, descriptions)
│   ├── workspace.json        (workspace UI labels)
│   ├── home.json             (homepage content)
│   ├── messages.json         (status messages, errors, validation)
│   ├── faq.json              (FAQ questions and answers)
│   └── metadata.json         (page titles, descriptions for SEO)
├── es/
├── zh-CN/
├── hi/
├── pt-BR/
├── fr/
├── ja/
├── de/
├── ar/
├── bn/
├── ko/
└── it/

utils/
├── locale.ts                 (locale detection & validation)
├── translations.ts           (translation loading & caching)
└── use-locale.ts             (client-side hook for locale)

lib/
├── i18n/
│   ├── index.ts              (main i18n utilities)
│   ├── namespaces.ts         (namespace type definitions)
│   └── server.ts             (server-side locale functions)

types/
├── locale.ts                 (locale types)
└── i18n.ts                   (translation type definitions)

config/
└── locales.ts                (language list, metadata)

components/
├── locale-provider.tsx       (context provider for locale)
├── language-selector.tsx     (header language dropdown)
└── locale-notification.tsx   (auto-detected language banner)
```

---

## Core Implementation Components

### 1. Type Definitions (`types/locale.ts`)

```typescript
export type Locale = 'en' | 'es' | 'zh-CN' | 'hi' | 'pt-BR' | 'fr' | 'ja' | 'de' | 'ar' | 'bn' | 'ko' | 'it';

export interface LocaleMetadata {
  code: Locale;
  name: string;           // e.g., "English"
  nativeName: string;     // e.g., "English" or "中文"
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
  region?: string;
  hrefLang: string;       // for SEO fallback (single URL)
}

export interface LocaleContext {
  locale: Locale;
  isRTL: boolean;
  t: (namespace: string, key: string, defaults?: Record<string, string>) => string;
  setLocale: (locale: Locale) => void;
  autoDetected: boolean;
}
```

### 2. Locale Configuration (`config/locales.ts`)

```typescript
import type { LocaleMetadata } from '@/types/locale';

export const SUPPORTED_LOCALES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    isRTL: false,
    dir: 'ltr',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    isRTL: false,
    dir: 'ltr',
  },
  'zh-CN': {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    isRTL: false,
    dir: 'ltr',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    isRTL: true,
    dir: 'rtl',
  },
  // ... rest of languages
} satisfies Record<Locale, LocaleMetadata>;

export const DEFAULT_LOCALE = 'en' as const;
export const LOCALES = Object.values(SUPPORTED_LOCALES);
```

### 3. Locale Detection (`utils/locale.ts`)

```typescript
export function isValidLocale(value: unknown): value is Locale {
  return typeof value === 'string' && value in SUPPORTED_LOCALES;
}

export function normalizeLocale(lang: string): Locale {
  // Handle full language tags: de-DE → de, zh-Hans → zh-CN
  if (lang === 'zh-Hans' || lang === 'zh-hans') return 'zh-CN';
  if (lang === 'zh') return 'zh-CN';
  if (lang === 'pt' || lang === 'pt-BR') return 'pt-BR';
  
  const base = lang.split('-')[0].toLowerCase();
  const localeCode = Object.keys(SUPPORTED_LOCALES).find(
    (l) => l.split('-')[0] === base
  );
  return localeCode as Locale || 'en';
}

export function getPreferredLocale(
  cookieLocale: Locale | null,
  acceptLanguage: string | null,
  browserLang: string | null
): { locale: Locale; autoDetected: boolean } {
  // Priority: cookie > Accept-Language header > browser language > default
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return { locale: cookieLocale, autoDetected: false };
  }
  
  if (acceptLanguage) {
    const preferred = acceptLanguage
      .split(',')[0]
      .trim();
    const normalized = normalizeLocale(preferred);
    if (normalized !== 'en') return { locale: normalized, autoDetected: true };
  }
  
  if (browserLang) {
    const normalized = normalizeLocale(browserLang);
    if (normalized !== 'en') return { locale: normalized, autoDetected: true };
  }
  
  return { locale: 'en', autoDetected: false };
}
```

### 4. Translation Loading (`utils/translations.ts`)

```typescript
import type { Locale } from '@/types/locale';

// In-memory cache
const translationCache = new Map<Locale, Map<string, Record<string, string>>>();

export async function loadTranslation(
  locale: Locale,
  namespace: string
): Promise<Record<string, string>> {
  const cacheKey = `${locale}/${namespace}`;
  
  if (!translationCache.has(locale)) {
    translationCache.set(locale, new Map());
  }
  
  const localeCache = translationCache.get(locale)!;
  if (localeCache.has(namespace)) {
    return localeCache.get(namespace)!;
  }
  
  try {
    const translations = await import(
      `../locales/${locale}/${namespace}.json`
    );
    localeCache.set(namespace, translations.default);
    return translations.default;
  } catch (error) {
    console.error(`Failed to load translations for ${locale}/${namespace}`);
    // Fallback to English
    if (locale !== 'en') {
      return loadTranslation('en', namespace);
    }
    return {};
  }
}

export async function translate(
  locale: Locale,
  namespace: string,
  key: string,
  defaultValue?: string
): Promise<string> {
  const translations = await loadTranslation(locale, namespace);
  return translations[key] ?? defaultValue ?? key;
}
```

### 5. Client-Side Hook (`utils/use-locale.ts`)

```typescript
'use client';

import { useContext } from 'react';
import { LocaleContext } from '@/components/locale-provider';

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}

// Hook for translating in client components
export function useTranslations(namespace: string) {
  const { locale } = useLocale();
  
  return async (key: string, defaults?: Record<string, string>) => {
    const { translate } = await import('@/utils/translations');
    return translate(locale, namespace, key, defaults?.[key]);
  };
}
```

### 6. Locale Context Provider (`components/locale-provider.tsx`)

```typescript
'use client';

import { createContext, useState, useEffect, useCallback } from 'react';
import type { Locale, LocaleContext as ILocaleContext } from '@/types/locale';
import { SUPPORTED_LOCALES } from '@/config/locales';

export const LocaleContext = createContext<ILocaleContext | null>(null);

export function LocaleProvider({
  children,
  initialLocale,
  initialAutoDetected,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
  initialAutoDetected: boolean;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [autoDetected, setAutoDetected] = useState(initialAutoDetected);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setAutoDetected(false);
    
    // Persist to localStorage
    try {
      localStorage.setItem('pixpromax-locale', newLocale);
    } catch {
      // Storage unavailable, preference stays in session only
    }
    
    // Update HTML lang and dir attributes
    const metadata = SUPPORTED_LOCALES[newLocale];
    document.documentElement.lang = newLocale;
    document.documentElement.dir = metadata.dir;
  }, []);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pixpromax-locale');
      if (saved && saved in SUPPORTED_LOCALES) {
        const savedLocale = saved as Locale;
        if (savedLocale !== locale) {
          setLocaleState(savedLocale);
          const metadata = SUPPORTED_LOCALES[savedLocale];
          document.documentElement.lang = savedLocale;
          document.documentElement.dir = metadata.dir;
        }
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const t = (namespace: string, key: string, defaults?: Record<string, string>): string => {
    // This is synchronous but returns placeholder; actual translation happens in components
    return defaults?.[key] ?? key;
  };

  const value: ILocaleContext = {
    locale,
    isRTL: SUPPORTED_LOCALES[locale].isRTL,
    t,
    setLocale,
    autoDetected,
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}
```

### 7. Language Selector (`components/language-selector.tsx`)

```typescript
'use client';

import { useLocale } from '@/utils/use-locale';
import { LOCALES } from '@/config/locales';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function LanguageSelector() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const currentLocale = LOCALES.find((l) => l.code === locale);

  return (
    <div className="language-selector" ref={menuRef}>
      <button
        className={`icon-button language-button ${open ? 'active' : ''}`}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Select language"
        title={`Language: ${currentLocale?.name}`}
      >
        <Globe aria-hidden="true" />
        <span className="language-code">{locale}</span>
      </button>
      {open && (
        <nav className="language-menu" role="menu">
          {LOCALES.map((lang) => (
            <button
              key={lang.code}
              role="menuitem"
              className={`language-option ${locale === lang.code ? 'active' : ''}`}
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
              }}
            >
              <span className="language-name">{lang.name}</span>
              <span className="language-native">{lang.nativeName}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
```

### 8. Auto-Detection Notification (`components/locale-notification.tsx`)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/utils/use-locale';
import { X } from 'lucide-react';

export function LocaleNotification() {
  const { autoDetected, locale } = useLocale();
  const [visible, setVisible] = useState(autoDetected);

  useEffect(() => {
    if (!autoDetected) return;
    
    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000); // Show for 10 seconds

    return () => clearTimeout(timer);
  }, [autoDetected]);

  if (!visible) return null;

  return (
    <div className="locale-notification" role="status" aria-live="polite">
      <span>Language auto-detected: <strong>{locale.toUpperCase()}</strong></span>
      <button
        type="button"
        className="close-button"
        onClick={() => setVisible(false)}
        aria-label="Dismiss"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
```

---

## Complete User-Facing Strings Audit

### By Component/Section

#### 1. **Header & Navigation** (`locales/*/common.json`)
- "Image tools"
- "Document tools"
- "Open options menu" / "Close options menu"
- "PixProMax home"
- "Home"
- "Return to PixProMax"
- "Image tools" (menu)
- "Edit, resize, and convert"
- "Document tools" (menu)
- "Work with images and PDFs"
- "Privacy"
- "How local processing works"
- "Search tools"
- "Try '50 KB', 'passport', or 'PDF'"
- "No matching tool. Try a format, size, or task."
- "Theme is {theme}. Switch to {next}."
- "Language: {language}"
- "Select language"

#### 2. **Homepage** (`locales/*/home.json`)
- "FAST, FREE, ON YOUR DEVICE"
- "Files ready."
- "In moments."
- "Resize images, prepare applications, and manage PDFs without uploading a file."
- "No account."
- "No watermark."
- "100% Private"
- "Files stay on your device"
- "Quick image tasks"
- "Less size. More room."
- "Compress an image"
- "JPG · PNG · WebP"
- "Make it fit."
- "Set a file-size limit"
- "20 KB · 50 KB · Custom"
- "Pages together."
- "Merge PDF files"
- "Local · private"
- "Image tools" (section)
- "Document tools" (section)
- "tool" / "tools" (plural)
- "Show fewer {tools}"
- "Show {count} more {tools}"
- "Processed on your device"
- "No watermark"
- "No AI needed"
- "PHOTO & APPLICATION TOOLS"
- "Right dimensions. One less worry."
- "Crop and position your photo with size presets. Always check your application's official requirements."
- "Prepare a photo"

#### 3. **Workspace** (`locales/*/workspace.json`)
- "Image workspace"
- "Image controls"
- "Image preview"
- "New image"
- "Quality"
- "Target size"
- "Quality · {percent}%"
- "Target size"
- "Smaller"
- "Sharper"
- "{kb} KB"
- "Pixels"
- "Percent"
- "W" / "H"
- "×"
- "Lock aspect ratio"
- "Scale · {percent}%"
- "Social media presets"
- "Document & ID presets"
- "Crop"
- "Free" / "1:1" / "4:3" / "3:2" / "16:9" / "Custom"
- "Aspect ratio"
- "X offset · {percent}%"
- "Y offset · {percent}%"
- "Reset crop"
- "Rotate & Flip"
- "Rotate"
- "0° / 90° / 180° / 270°"
- "Flip H" / "Flip V"
- "Adjustments"
- "Brightness" / "Contrast" / "Saturation"
- "Grayscale" / "Sepia" / "Invert"
- "Enhance"
- "Blur"
- "off" / "{px}px"
- "Off" / "20px" (hints)
- "Pixelate / Censor"
- "Sharpen"
- "(disabled while blur/pixelate active)"
- "Canvas"
- "Padding"
- "Border"
- "px"
- "Rounded corners"
- "Square" / "Pill"
- "Overlay"
- "Text watermark"
- "Size"
- "Color"
- "Bold"
- "Opacity"
- "Position"
- "Logo / image watermark"
- "Upload logo image"
- "Change logo image"
- "Remove logo"
- "Edit"
- "Resize"
- "Convert"
- "Compress"
- "Workflow:"
- "Original"
- "Final"
- "Processing…"
- "Preview will appear after processing"
- "Original image"
- "Processed preview"
- "Download Final Image"
- "Could not read this image."
- "Watermark text…"

#### 4. **Upload Dropzone** (`locales/*/common.json`)
- "Drop your {kind} here"
- "Drop your {kinds} here" (plural)
- "or"
- "browse {a file/files} from your device"
- "JPG, PNG or WebP · up to {size} MB"
- "PDF · up to {count} files"

#### 5. **Processing & Buttons** (`locales/*/common.json`)
- "Processing…"
- "Create PDF"
- "Download PDF"
- "Download {format} ZIP"
- "Start over"

#### 6. **Tool Definitions** (`locales/*/tools.json`)
Each tool entry with:
- `name`
- `description`
- `longDescription`
- `category`

Example structure:
```json
{
  "compress-image": {
    "name": "Compress Image",
    "description": "Shrink JPG, PNG, and WebP files without a watermark.",
    "longDescription": "Reduce image file size in your browser while keeping the visual quality you choose.",
    "category": "Optimization"
  }
}
```

Categories to translate:
- "Optimization"
- "Resize"
- "Edit"
- "Conversion"
- "Batch tools"
- "Applications"
- "PDF tools"
- "Documents"

#### 7. **Workspace Shortcuts** (`locales/*/home.json`)
Social media presets:
- "Instagram Post"
- "Instagram Story"
- "YouTube Thumbnail"
- "LinkedIn Cover"
- "Facebook Cover"
- "Twitter/X Header"

Document presets:
- "Passport (2×2 in)"
- "Visa (35×45 mm)"
- "ID Photo"
- "Signature (150×60)"

#### 8. **Footer** (`locales/*/common.json`)
- "PixProMax"
- "Thoughtful image tools that keep everyday editing fast, free, and on your device."
- "Popular tools"
- "Company"
- "About"
- "Contact"
- "FAQ"
- "Privacy Policy"
- "Terms & Conditions"
- "Disclaimer"
- "© {year} PixProMax. All rights reserved."
- "Made for images, respectful of privacy."

#### 9. **Cookie Consent** (`locales/*/common.json`)
- "Optional cookies and measurement"
- "PixProMax can use optional advertising or analytics only if you allow it. Core image tools work either way."
- "Only essential"
- "Allow optional services"

#### 10. **Tool Page Titles & Metadata** (`locales/*/metadata.json`)
Page titles and descriptions for:
- Compress Image
- Resize Image
- Crop & Rotate Image
- Convert Image
- JPG to PNG
- PNG to JPG
- Add Text to Image
- Blur Image
- Bulk Image Compressor
- ... (all 23 tools)

#### 11. **FAQ** (`locales/*/faq.json`)
- "Is PixProMax free?" → answer
- "Are my images uploaded?" → answer
- "Can I use it on mobile?" → answer
- "Which formats are supported?" → answer
- "Can I resize an image to 20 KB or 50 KB?" → answer
- "Does PixProMax add watermarks?" → answer

#### 12. **Error & Validation Messages** (`locales/*/messages.json`)
- "Processing failed."
- "Could not read this image."
- "No matching tool. Try a format, size, or task."
- Image validation errors
- PDF processing errors
- File size limit messages

---

## RTL (Right-to-Left) Support for Arabic

### CSS Modifications

1. **Create `styles/rtl.css`:**
```css
html[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

html[dir="rtl"] .shell {
  margin-left: auto;
  margin-right: auto;
}

html[dir="rtl"] .site-header {
  flex-direction: row-reverse;
}

html[dir="rtl"] .header-actions {
  flex-direction: row-reverse;
}

html[dir="rtl"] .studio-tool-arrow {
  transform: scaleX(-1);
}

html[dir="rtl"] .language-selector {
  /* adjust positioning */
}

html[dir="rtl"] button.language-button .language-code {
  order: -1;
  margin-left: 8px;
  margin-right: 0;
}

/* Ensure flex and grid handle RTL properly */
html[dir="rtl"] .footer-grid {
  direction: rtl;
}

html[dir="rtl"] .studio-tool-grid {
  direction: rtl;
}
```

2. **Import in `app/layout.tsx`:**
```tsx
import '../styles/rtl.css';
```

### Component Modifications

Components using margins/padding on directional sides need updates:
- Instead of `margin-left`, use `margin-inline-start`
- Instead of `padding-right`, use `padding-inline-end`
- Use CSS logical properties where possible

Example utilities to add to `globals.css`:
```css
.margin-inline-start { margin-inline-start: var(--spacing); }
.margin-inline-end { margin-inline-end: var(--spacing); }
.padding-inline-start { padding-inline-start: var(--spacing); }
.padding-inline-end { padding-inline-end: var(--spacing); }
```

---

## Cookie & Storage Strategy

### Cookie Structure

```typescript
// In Next.js middleware or API route
// Set cookie on first visit or language selection
Set-Cookie: pixpromax-locale=es; Max-Age=31536000; Path=/; SameSite=Lax
```

### Storage Pattern

1. **Server-side (middleware):**
   - Read `pixpromax-locale` cookie
   - Read `Accept-Language` header
   - Determine locale for SSR
   - Pass to root layout via context

2. **Client-side (hydration):**
   - Context provider receives `initialLocale`
   - On mount, check localStorage for overrides
   - Set `<html lang>` and `<html dir>`
   - Allow dynamic switching

3. **Persistence:**
   - When user changes language: update both localStorage and cookie
   - Cookie: handled by Next.js response (or via client fetch to `/api/set-locale`)
   - localStorage: handled by client-side code

### Hydration-Safe Implementation

**Critical Pattern:**
```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  const locale = getLocaleFromRequest();  // Server-side
  
  return (
    <html lang={locale} dir={SUPPORTED_LOCALES[locale].dir}>
      <body>
        {/* Suppress hydration warning for theme script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var l = localStorage.getItem('pixpromax-locale');
                  if (l && ${JSON.stringify(VALID_LOCALES)}.includes(l)) {
                    document.documentElement.lang = l;
                  }
                } catch(e) {}
              })()
            `,
          }}
        />
        <LocaleProvider 
          initialLocale={locale}
          initialAutoDetected={wasAutoDetected}
        >
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
```

---

## Implementation Order

### Phase 1: Infrastructure (Core Framework)
1. **Create type definitions** (`types/locale.ts`, `types/i18n.ts`)
2. **Create locale config** (`config/locales.ts`)
3. **Create utilities** (`utils/locale.ts`, `utils/translations.ts`, `utils/use-locale.ts`)
4. **Create context provider** (`components/locale-provider.tsx`)
5. **Create language selector** (`components/language-selector.tsx`)
6. **Create auto-detection notification** (`components/locale-notification.tsx`)

### Phase 2: Layout Integration (Make it Work)
1. **Modify `app/layout.tsx`:**
   - Add locale detection logic
   - Set html lang/dir attributes
   - Add hydration-safe script
   - Wrap with LocaleProvider
   - Add LanguageSelector to SiteHeader
   - Add LocaleNotification after main content

2. **Modify `components/site-header.tsx`:**
   - Add LanguageSelector component
   - Import language selector

3. **Update `config/site.ts`:**
   - Keep as-is for now (single URL approach)

### Phase 3: Core Translation Files (English → Templates)
1. **Create English translation structure:**
   - `locales/en/common.json` - header, footer, nav, menu
   - `locales/en/home.json` - homepage content
   - `locales/en/tools.json` - all 23 tools (name, description, category)
   - `locales/en/workspace.json` - workspace UI labels
   - `locales/en/messages.json` - errors, validation, status
   - `locales/en/faq.json` - FAQ content
   - `locales/en/metadata.json` - page titles and descriptions

2. **Extract strings systematically:**
   - From config/tools.ts → tools.json
   - From pixel-studio.tsx → home.json
   - From workspace.tsx → workspace.json
   - From site-header.tsx, site-footer.tsx → common.json
   - From page.tsx FAQs → faq.json
   - From tool pages → metadata.json

### Phase 4: Component Modifications (Hydration-Safe)
1. **Make components locale-aware:**
   - Modify `components/pixel-studio.tsx` to use translations
   - Modify `components/site-header.tsx` sections to use translations
   - Modify `components/site-footer.tsx` to use translations
   - Modify `components/tools/upload-dropzone.tsx` to use translations
   - Modify workspace components to use translations

2. **Create async translation wrapper:**
   - Ensure all string loads are async and don't break hydration
   - Use `Suspense` boundaries where needed

### Phase 5: RTL Support
1. **Create `styles/rtl.css`** with all RTL overrides
2. **Update logical properties** in existing CSS
3. **Test in Arabic locale**

### Phase 6: Translate to All 11 Languages
1. **Spanish (es)**
2. **Chinese Simplified (zh-CN)**
3. **Hindi (hi)**
4. **Portuguese (pt-BR)**
5. **French (fr)**
6. **Japanese (ja)**
7. **German (de)**
8. **Arabic (ar)**
9. **Bengali (bn)**
10. **Korean (ko)**
11. **Italian (it)**

Consider using translation service or manual translation per language needs.

### Phase 7: Testing & QA
1. **Hydration testing:** Verify no mismatches
2. **Cookie/localStorage testing:** Verify persistence
3. **RTL testing:** Test Arabic layout
4. **Auto-detection testing:** Verify Accept-Language detection
5. **Language switching:** Verify smooth transitions
6. **All tool pages:** Verify translations load
7. **Mobile testing:** Verify on touch devices

### Phase 8: Monitoring & Fixes
1. **Monitor console for errors**
2. **Check translation loading performance**
3. **Verify SEO metadata (hrefLang alternatives for future)**

---

## Files That Need Modification

### New Files (to create)
- `types/locale.ts`
- `types/i18n.ts`
- `config/locales.ts`
- `utils/locale.ts`
- `utils/translations.ts`
- `utils/use-locale.ts`
- `lib/i18n/index.ts`
- `lib/i18n/server.ts`
- `lib/i18n/namespaces.ts`
- `components/locale-provider.tsx`
- `components/language-selector.tsx`
- `components/locale-notification.tsx`
- `styles/rtl.css`
- All `locales/*/` JSON files (12 languages × 7 namespaces = 84 files)

### Existing Files to Modify
- `app/layout.tsx` - Add LocaleProvider, locale detection, language selector
- `components/site-header.tsx` - Add LanguageSelector component
- `components/site-footer.tsx` - Use translations for footer strings
- `components/pixel-studio.tsx` - Use translations for homepage
- `components/workspace/workspace.tsx` - Use translations for labels
- `components/tools/upload-dropzone.tsx` - Use translations for UI text
- `components/cookie-consent.tsx` - Use translations for cookie text
- `components/header-tool-search.tsx` - Use translations for search UI
- `components/processing-button.tsx` - Use translations for button text
- `app/page.tsx` - Load translated FAQs
- All tool page files (compress-image, resize-image, etc.) - Translate titles/descriptions
- `globals.css` - Ensure RTL-compatible styling

---

## Translation File Structure Example

### `locales/en/common.json`
```json
{
  "header": {
    "imageTools": "Image tools",
    "documentTools": "Document tools",
    "openMenu": "Open options menu",
    "closeMenu": "Close options menu",
    "home": "Home",
    "returnHome": "Return to PixProMax",
    "privacy": "Privacy",
    "privacyDesc": "How local processing works",
    "searchTools": "Search tools"
  },
  "footer": {
    "tagline": "Thoughtful image tools that keep everyday editing fast, free, and on your device.",
    "popularTools": "Popular tools",
    "company": "Company",
    "about": "About",
    "contact": "Contact",
    "faq": "FAQ",
    "privacyPolicy": "Privacy Policy",
    "terms": "Terms & Conditions",
    "disclaimer": "Disclaimer",
    "copyright": "© {year} PixProMax. All rights reserved.",
    "madeFor": "Made for images, respectful of privacy."
  },
  "cookie": {
    "title": "Optional cookies and measurement",
    "description": "PixProMax can use optional advertising or analytics only if you allow it. Core image tools work either way.",
    "essential": "Only essential",
    "allow": "Allow optional services"
  }
}
```

### `locales/en/tools.json`
```json
{
  "compress-image": {
    "name": "Compress Image",
    "description": "Shrink JPG, PNG, and WebP files without a watermark.",
    "longDescription": "Reduce image file size in your browser while keeping the visual quality you choose.",
    "category": "Optimization"
  },
  "resize-image": {
    "name": "Resize Image",
    "description": "Set exact dimensions or scale by percentage.",
    "longDescription": "Resize photos with precise dimensions, useful presets, and aspect-ratio control.",
    "category": "Resize"
  }
}
```

---

## Key Considerations

### Performance
- Translations are loaded lazily per namespace
- In-memory caching prevents re-fetching
- No runtime API calls; all files bundled
- Consider code-splitting per locale in Phase 6

### Maintainability
- Single source of truth: English translations
- Clear namespace structure
- Type-safe translation keys via TypeScript
- Easy to audit missing translations

### User Experience
- Instant language switching (client-side)
- Auto-detection without blocking
- 8-12 second notification (dismissible)
- Language preference persists across sessions

### SEO
- Single URL (no multilingual routing)
- `lang` attribute accurate
- `Accept-Language` header respected
- Potential for `hrefLang` in future phases

### Accessibility
- All aria-labels translated
- RTL layout properly implemented
- Language selector accessible
- Auto-notification dismissible

---

## Hydration Safety Checklist

- [ ] LocaleProvider uses `suppressHydrationWarning` if needed
- [ ] Language detection happens only on server + cookie
- [ ] Client-side localStorage is NOT read during SSR
- [ ] Root script runs BEFORE React hydration
- [ ] Context provides stable locale throughout render
- [ ] No useEffect reads language from URL/hash during SSR
- [ ] All async translation loads wrapped in Suspense
- [ ] Dynamic segments (if used) don't depend on locale client-side state

---

## Testing Strategy

### Unit Tests
- Locale normalization function (de-DE → de)
- Locale preference detection logic
- Translation loading and caching

### Integration Tests
- Locale provider hydration
- Language switching
- RTL mode activation
- Cookie persistence

### E2E Tests
- Auto-detect workflow
- User override workflow
- Navigation with language change
- All tool pages load in each language

### Manual QA
- Hydration mismatch detection (React DevTools warnings)
- Visual RTL review
- Mobile language selector UX
- Notification timing

---

## Deployment Checklist

- [ ] All 84 translation files created and reviewed
- [ ] No English strings hardcoded in new components
- [ ] Locale detection tested with different Accept-Language headers
- [ ] RTL styling verified for Arabic
- [ ] Cookie domain set correctly for production
- [ ] Translation cache strategy decided
- [ ] Monitoring for failed translation loads
- [ ] Fallback to English for missing keys tested
- [ ] SEO metadata updated (hrefLang alternatives in future)
- [ ] Analytics updated to track language selection events

