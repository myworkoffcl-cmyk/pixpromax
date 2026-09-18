# Graph Report - pixpromax-site  (2026-09-18)

## Corpus Check
- 303 files · ~169,785 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: .css 7, .example 1, (none) 1)

## Summary
- 804 nodes · 1520 edges · 186 communities (27 shown, 159 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.85)
- Token cost: 56,500 input · 10,900 output

## Community Hubs (Navigation)
- add-text-to-image/page.tsx / AddTextToImagePage()
- about-client.tsx / AboutPageClient()
- global-error.tsx / GlobalError()
- browser-image-compression / config/passport.ts
- workspace.tsx / Action
- compress/page.tsx / CompressCategoryPage()
- package.json / name
- bulk-image-tool.tsx / BulkImageTool()
- tsconfig.json / compilerOptions
- PdfCompressTool() / pdf-tool.tsx
- devDependencies / @cloudflare/vite-plugin
- image-to-pdf-tool.tsx / ImageToPdfTool()
- script.js / applyBtn
- download-link.tsx / DownloadLink()
- home.js / catBtns
- dependencies / browser-image-compression
- theme-toggle.tsx / applyTheme()
- resize.js / canvas
- manifest.json / action
- processing-button.tsx / ProcessingButton()
- canvas-engine.js / ImageEngine
- convertible-input.ts / extendedTypes
- scripts / build
- image-to-pdf/page.tsx / ImageToPdfCompatibilityPage()
- handleFile() / store.ts
- openai_hosting / @openai/sites-vite-plugin
- batch.js / processBatch()
- eslint.config.mjs / ref_eslint_config
- popup.js / open()
- next_dev_types_root_params_d / next_dev_types_routes_d
- application-presets.ts / ApplicationPreset
- ref_node_path / ref_vitest_config
- presets.js / presets
- postcss.config.mjs / config
- sw.js / SHELL
- State Management Architecture
- PixProMax
- PixProMax
- Upload File Loss Bug
- esbuild
- sharp
- unrs-resolver
- workerd
- Applications
- Batch tools
- Conversion
- Documents
- Edit
- Optimization
- PDF tools
- Resize
- ImagePreview Component
- LanguageSelector Component
- LocaleNotification Component
- LocaleProvider Component
- PixelStudio Component
- SiteFooter Component
- SiteHeader Component
- UniversalWorkspace Component
- UploadDropzone Component
- WorkspaceEntry Component
- Image Tools
- Privacy-First Architecture
- Right-to-Left (RTL) Support
- Build tools configuration
- Gradient Color Palette
- Brand Logo
- Star Symbol
- User-Facing Strings Extraction Guide
- Compress Engine
- Convert Engine
- Edit Engine
- Resize Engine
- PixProMax Quick Tools
- Fast
- Free
- Image Compression
- Image Conversion
- Image Editing
- Image Resizing
- Multilingual Support (12 Languages)
- PDF Tools
- Private
- IndexedDB State Persistence Fix
- Hydration Mismatch Prevention
- Batch processing module
- Image converter module
- Utility functions module
- ZIP file creation module
- Arabic (ar)
- Bengali (bn)
- Chinese Simplified (zh-CN)
- English (en)
- French (fr)
- German (de)
- Hindi (hi)
- Italian (it)
- Japanese (ja)
- Korean (ko)
- Portuguese - Brazil (pt-BR)
- Spanish (es)
- Manifest V3
- utils/locale.ts
- utils/translations.ts
- utils/use-locale.ts
- locales/en/common.json
- locales/en/faq.json
- locales/en/home.json
- locales/en/metadata.json
- locales/en/tools.json
- locales/en/workspace.json
- AdSense Script Deferral
- CSS Gradient Simplification
- Compress Image Tool Page
- Image Converter Tool Page
- JPG to PNG Converter Page
- Legacy Static Index
- Legacy Test Page
- PNG to WebP Converter Page
- Resize Image Tool Page
- Hydration-Safe Rendering Pattern
- Locale Detection Pattern
- Legacy Tool Decommissioning
- Phase 1 Tool Implementation
- PixProMax
- PixProMax Icon
- PixProMax OG Image
- Google AdSense
- Architecture Fixes Final Report
- Legacy Tool Decommissioning Report
- Performance Optimization Report
- /image-tools/compress Route
- /image-tools/convert Route
- /image-tools/edit Route
- /image-tools/resize Route
- /workspace Route
- HTTP Cookies
- IndexedDB Storage
- localStorage
- Specialized Tools System
- Universal Workspace System
- Free, fast, private image tools
- Images in. Better images out.
- Add Text to Image
- Blur Image
- Bulk Image Compressor
- Bulk Image Resizer
- Compress Image
- Convert Image
- Crop & Rotate Image
- ID Photo Resizer
- Image to PDF
- JPG to PDF
- JPG to PNG
- JPG to WebP
- Merge PDF
- Organize PDF
- Passport Photo Resizer
- Compress PDF
- PDF to JPG
- PDF to PNG
- Pixelate Image
- PNG to JPG
- PNG to WebP
- Resize Image
- Signature Resizer
- Split PDF
- Visa Photo Resizer
- Watermark Image
- WebP to JPG
- WebP to PNG
- Aspect Ratio Selector
- Footer
- Format Selector
- Header
- Quality Slider
- Tools Section
- Landscape Example Image

## God Nodes (most connected - your core abstractions)
1. `getToolSchemas()` - 53 edges
2. `next` - 45 edges
3. `JsonLd()` - 31 edges
4. `useTranslation()` - 31 edges
5. `UniversalWorkspace()` - 30 edges
6. `ToolPageHeader()` - 29 edges
7. `getTool()` - 29 edges
8. `toolMetadata()` - 27 edges
9. `react` - 26 edges
10. `lucide-react` - 23 edges

## Surprising Connections (you probably didn't know these)
- `ToolPageShell()` --indirect_call--> `getTool()`  [INFERRED]
  components/tools/tool-page-shell.tsx → config/tools.ts
- `BulkImageTool()` --indirect_call--> `validateImageFile()`  [INFERRED]
  components/tools/bulk-image-tool.tsx → lib/image/validate.ts
- `AddTextToImagePage()` --calls--> `getToolSchemas()`  [EXTRACTED]
  app/add-text-to-image/page.tsx → lib/seo.ts
- `BlurImagePage()` --calls--> `getToolSchemas()`  [EXTRACTED]
  app/blur-image/page.tsx → lib/seo.ts
- `BulkImageCompressorPage()` --calls--> `getToolSchemas()`  [EXTRACTED]
  app/bulk-image-compressor/page.tsx → lib/seo.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **** — system:universal-workspace, engine:compress-engine, engine:resize-engine, engine:edit-engine, engine:convert-engine [INFERRED]
- **** — component:locale-provider, component:language-selector, component:locale-notification, module:locale-utils, module:translations-utils [INFERRED]
- **** — storage:indexeddb, storage:localstorage, storage:cookies [INFERRED]
- **** — components_workspace_workspace, component:workspace-entry, storage:indexeddb [INFERRED]
- **** — feature:free, feature:fast, feature:private [INFERRED]

## Communities (186 total, 159 thin omitted)

### Community 0 - "add-text-to-image/page.tsx / AddTextToImagePage()"
Cohesion: 0.08
Nodes (64): AddTextToImagePage(), metadata, BlurImagePage(), metadata, BulkImageCompressorPage(), metadata, BulkImageResizerPage(), metadata (+56 more)

### Community 1 - "about-client.tsx / AboutPageClient()"
Cohesion: 0.06
Nodes (36): AboutPageClient(), metadata, ContactPageClient(), metadata, DisclaimerPageClient(), metadata, FaqPageClient(), metadata (+28 more)

### Community 2 - "global-error.tsx / GlobalError()"
Cohesion: 0.06
Nodes (42): app_globals, metadata, RootLayout(), AdSlot(), adSlots, Analytics(), CookieConsent(), getOptionalServicesConsent() (+34 more)

### Community 3 - "browser-image-compression / config/passport.ts"
Cohesion: 0.09
Nodes (44): PassportPreset, passportPresets, canvasToBlob(), createCanvas(), getContext(), compressImage(), calculateCropRect(), cropImage() (+36 more)

### Community 4 - "workspace.tsx / Action"
Cohesion: 0.07
Nodes (30): Action, ASPECT_OPTIONS, computeCropRect(), EditControls(), selectAspect(), OVERLAY_POSITIONS, reducer(), ResizeControls() (+22 more)

### Community 5 - "compress/page.tsx / CompressCategoryPage()"
Cohesion: 0.10
Nodes (10): metadata, metadata, metadata, metadata, faqs, structuredData, metadata, SITE_DESCRIPTION (+2 more)

### Community 6 - "package.json / name"
Cohesion: 0.09
Nodes (22): name, private, type, version, browser-image-compression, @cloudflare/vite-plugin, @cloudflare/workers-types, eslint (+14 more)

### Community 7 - "bulk-image-tool.tsx / BulkImageTool()"
Cohesion: 0.18
Nodes (15): BulkImageTool(), BulkImageToolProps, BulkMode, copy, uniqueZipName(), ACCEPTED_IMAGE_TYPES, MAX_BATCH_FILES, MAX_BATCH_TOTAL_SIZE (+7 more)

### Community 8 - "tsconfig.json / compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "PdfCompressTool() / pdf-tool.tsx"
Cohesion: 0.16
Nodes (13): PdfCompressTool(), bytesBlob(), fileStem(), labels, PdfMode, PdfTool(), PdfToolProps, MAX_PDF_SIZE (+5 more)

### Community 10 - "devDependencies / @cloudflare/vite-plugin"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, eslint, eslint-config-next, @openai/sites-vite-plugin, tailwindcss, @tailwindcss/postcss (+10 more)

### Community 11 - "image-to-pdf-tool.tsx / ImageToPdfTool()"
Cohesion: 0.20
Nodes (13): ImageToPdfTool(), PdfItem, isImageMime(), validateImageFile(), concat(), createImagePdf(), encoder, pageDimensions() (+5 more)

### Community 12 - "script.js / applyBtn"
Cohesion: 0.15
Nodes (13): applyBtn, canvas, compressSlider, compressValue, crop, cropBox, cropToggle, ctx (+5 more)

### Community 13 - "download-link.tsx / DownloadLink()"
Cohesion: 0.26
Nodes (8): DownloadLink(), ImagePreview(), ImagePreviewProps, useObjectUrl(), OutputInfo(), formatFileSize(), formatPercentSaved(), ref_next_image

### Community 14 - "home.js / catBtns"
Cohesion: 0.15
Nodes (6): catBtns, menuBtn, mobileMenu, panels, tabs, toolsData

### Community 15 - "dependencies / browser-image-compression"
Cohesion: 0.17
Nodes (12): dependencies, browser-image-compression, heic-to, jszip, lucide-react, next, pdf-lib, pdfjs-dist (+4 more)

### Community 16 - "theme-toggle.tsx / applyTheme()"
Cohesion: 0.40
Nodes (7): applyTheme(), storedTheme(), ThemeToggle(), isThemePreference(), nextThemePreference(), themeOrder, ThemePreference

### Community 17 - "resize.js / canvas"
Cohesion: 0.20
Nodes (9): canvas, ctx, downloadBtn, fileInput, heightInput, image, previewImg, resizeBtn (+1 more)

### Community 18 - "manifest.json / action"
Cohesion: 0.22
Nodes (8): action, default_popup, default_title, description, host_permissions, manifest_version, name, version

### Community 19 - "processing-button.tsx / ProcessingButton()"
Cohesion: 0.32
Nodes (4): ProcessingButton(), Button(), ButtonProps, ButtonVariant

### Community 21 - "convertible-input.ts / extendedTypes"
Cohesion: 0.32
Nodes (5): extendedTypes, isHeicFile(), normalizeConvertibleImage(), sourceFormatLabel(), ref_heic_to_next

### Community 22 - "scripts / build"
Cohesion: 0.25
Nodes (8): scripts, build, build:sites, dev, lint, start, test, typecheck

### Community 24 - "handleFile() / store.ts"
Cohesion: 0.43
Nodes (6): handleFile(), clearPendingImage(), getDB(), loadPendingImage(), PendingImage, savePendingImage()

### Community 25 - "openai_hosting / @openai/sites-vite-plugin"
Cohesion: 0.29
Nodes (5): openai_hosting, @openai/sites-vite-plugin, @tailwindcss/postcss, vinext, vite

### Community 26 - "batch.js / processBatch()"
Cohesion: 0.70
Nodes (3): processBatch(), worker(), processImage()

### Community 27 - "eslint.config.mjs / ref_eslint_config"
Cohesion: 0.50
Nodes (3): ref_eslint_config, ref_eslint_config_next_core_web_vitals, ref_eslint_config_next_typescript

### Community 29 - "next_dev_types_root_params_d / next_dev_types_routes_d"
Cohesion: 0.50
Nodes (3): next_dev_types_root_params_d, next_dev_types_routes_d, NOTE: This file should not be edited

## Knowledge Gaps
- **348 isolated node(s):** `metadata`, `metadata`, `metadata`, `metadata`, `metadata` (+343 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 443 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **159 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `about-client.tsx / AboutPageClient()` to `global-error.tsx / GlobalError()`, `workspace.tsx / Action`, `package.json / name`, `bulk-image-tool.tsx / BulkImageTool()`, `PdfCompressTool() / pdf-tool.tsx`, `image-to-pdf-tool.tsx / ImageToPdfTool()`, `download-link.tsx / DownloadLink()`, `theme-toggle.tsx / applyTheme()`, `processing-button.tsx / ProcessingButton()`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `next` connect `add-text-to-image/page.tsx / AddTextToImagePage()` to `about-client.tsx / AboutPageClient()`, `global-error.tsx / GlobalError()`, `compress/page.tsx / CompressCategoryPage()`, `package.json / name`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `about-client.tsx / AboutPageClient()` to `add-text-to-image/page.tsx / AddTextToImagePage()`, `global-error.tsx / GlobalError()`, `workspace.tsx / Action`, `package.json / name`, `bulk-image-tool.tsx / BulkImageTool()`, `PdfCompressTool() / pdf-tool.tsx`, `image-to-pdf-tool.tsx / ImageToPdfTool()`, `download-link.tsx / DownloadLink()`, `theme-toggle.tsx / applyTheme()`, `processing-button.tsx / ProcessingButton()`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **What connects `metadata`, `metadata`, `metadata` to the rest of the system?**
  _348 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `add-text-to-image/page.tsx / AddTextToImagePage()` be split into smaller, more focused modules?**
  _Cohesion score 0.07616161616161617 - nodes in this community are weakly interconnected._
- **Should `about-client.tsx / AboutPageClient()` be split into smaller, more focused modules?**
  _Cohesion score 0.06164383561643835 - nodes in this community are weakly interconnected._
- **Should `global-error.tsx / GlobalError()` be split into smaller, more focused modules?**
  _Cohesion score 0.06093189964157706 - nodes in this community are weakly interconnected._