# User-Facing Strings Extraction Guide

This document maps every user-facing string in the codebase to its source file and target translation namespace. Use this as a checklist during Phase 3 (English Translations).

---

## 1. COMMON STRINGS (header, footer, navigation)
**Target File:** `locales/en/common.json`
**Source Files:** site-header.tsx, site-footer.tsx, cookie-consent.tsx, header-tool-search.tsx, theme-toggle.tsx

### Header & Navigation
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "Image tools" | site-header.tsx | 37 | Header link | `header.imageTools` |
| "Document tools" | site-header.tsx | 38 | Header link | `header.documentTools` |
| "Open options menu" | site-header.tsx | 40 | aria-label when closed | `header.openMenu` |
| "Close options menu" | site-header.tsx | 40 | aria-label when open | `header.closeMenu` |
| "PixProMax home" | site-header.tsx | 31 | Logo link aria-label | `header.homeLogo` |
| "Home" | site-header.tsx | 45 | Menu item | `menu.home` |
| "Return to PixProMax" | site-header.tsx | 45 | Menu item subtitle | `menu.returnHome` |
| "Image tools" | site-header.tsx | 46 | Menu item (duplicate) | `menu.imageTools` |
| "Edit, resize, and convert" | site-header.tsx | 46 | Menu item subtitle | `menu.imageToolsDesc` |
| "Document tools" | site-header.tsx | 47 | Menu item (duplicate) | `menu.documentTools` |
| "Work with images and PDFs" | site-header.tsx | 47 | Menu item subtitle | `menu.documentToolsDesc` |
| "Privacy" | site-header.tsx | 48 | Menu item | `menu.privacy` |
| "How local processing works" | site-header.tsx | 48 | Menu item subtitle | `menu.privacyDesc` |
| "Search tools" | header-tool-search.tsx | 41 | Button text | `header.search` |
| "Ctrl K" | header-tool-search.tsx | 42 | Keyboard shortcut | `header.searchShortcut` |
| "Search PixProMax tools" | header-tool-search.tsx | 45 | Dialog aria-label | `header.searchDialog` |
| "Search image tools" | header-tool-search.tsx | 48 | Label sr-only | `header.searchLabel` |
| "Try "50 KB", "passport", or "PDF"" | header-tool-search.tsx | 49 | Input placeholder | `header.searchPlaceholder` |
| "No matching tool. Try a format, size, or task." | header-tool-search.tsx | 56 | Empty state message | `header.noToolsFound` |
| "Theme is {theme}. Switch to {next}." | theme-toggle.tsx | 52 | aria-label | `header.themeLabel` |

### Footer
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "PixProMax" | site-footer.tsx | 10 | Footer brand | `footer.brand` |
| "Thoughtful image tools that keep everyday editing fast, free, and on your device." | site-footer.tsx | 11 | Tagline | `footer.tagline` |
| "Popular tools" | site-footer.tsx | 13 | Section heading | `footer.popularTools` |
| "Company" | site-footer.tsx | 14 | Section heading | `footer.company` |
| "About" | site-footer.tsx | 14 | Link | `footer.about` |
| "Contact" | site-footer.tsx | 14 | Link | `footer.contact` |
| "FAQ" | site-footer.tsx | 14 | Link | `footer.faq` |
| "Privacy Policy" | site-footer.tsx | 14 | Link | `footer.privacyPolicy` |
| "Terms & Conditions" | site-footer.tsx | 14 | Link | `footer.terms` |
| "Disclaimer" | site-footer.tsx | 14 | Link | `footer.disclaimer` |
| "© {year} PixProMax. All rights reserved." | site-footer.tsx | 16 | Copyright | `footer.copyright` |
| "Made for images, respectful of privacy." | site-footer.tsx | 16 | Slogan | `footer.slogan` |

### Cookie Consent
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "Optional cookies and measurement" | cookie-consent.tsx | 24 | Section title | `cookie.title` |
| "PixProMax can use optional advertising or analytics only if you allow it. Core image tools work either way." | cookie-consent.tsx | 24 | Description | `cookie.description` |
| "Only essential" | cookie-consent.tsx | 24 | Button text | `cookie.essential` |
| "Allow optional services" | cookie-consent.tsx | 24 | Button text | `cookie.allow` |

---

## 2. HOMEPAGE STRINGS
**Target File:** `locales/en/home.json`
**Source File:** components/pixel-studio.tsx, components/workspace/workspace-entry.tsx

### Hero Section
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "FAST, FREE, ON YOUR DEVICE" | pixel-studio.tsx | 41 | Overline | `hero.overline` |
| "Files ready." | pixel-studio.tsx | 41 | Heading line 1 | `hero.heading1` |
| "In moments." | pixel-studio.tsx | 41 | Heading line 2 (italic) | `hero.heading2` |
| "Resize images, prepare applications, and manage PDFs without uploading a file." | pixel-studio.tsx | 41 | Subheading | `hero.description` |
| "No account." | pixel-studio.tsx | 41 | Stamp line 1 | `hero.stamp1` |
| "No watermark." | pixel-studio.tsx | 41 | Stamp line 2 | `hero.stamp2` |
| "100% Private" | pixel-studio.tsx | 41 | Badge title | `hero.badge` |
| "Files stay on your device" | pixel-studio.tsx | 41 | Badge subtitle | `hero.badgeDesc` |

### Quick Shortcuts
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "Quick image tasks" | pixel-studio.tsx | 42 | Section aria-label | `shortcuts.label` |
| "Less size. More room." | pixel-studio.tsx | 10 | Shortcut 1 title | `shortcuts.compress.title` |
| "Compress an image" | pixel-studio.tsx | 10 | Shortcut 1 text | `shortcuts.compress.text` |
| "JPG · PNG · WebP" | pixel-studio.tsx | 10 | Shortcut 1 detail | `shortcuts.compress.detail` |
| "Make it fit." | pixel-studio.tsx | 11 | Shortcut 2 title | `shortcuts.fit.title` |
| "Set a file-size limit" | pixel-studio.tsx | 11 | Shortcut 2 text | `shortcuts.fit.text` |
| "20 KB · 50 KB · Custom" | pixel-studio.tsx | 11 | Shortcut 2 detail | `shortcuts.fit.detail` |
| "Pages together." | pixel-studio.tsx | 12 | Shortcut 3 title | `shortcuts.merge.title` |
| "Merge PDF files" | pixel-studio.tsx | 12 | Shortcut 3 text | `shortcuts.merge.text` |
| "Local · private" | pixel-studio.tsx | 12 | Shortcut 3 detail | `shortcuts.merge.detail` |

### Tools Directory
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "Image tools" | pixel-studio.tsx | 35 | Section name | `directory.imageTools` |
| "Document tools" | pixel-studio.tsx | 36 | Section name | `directory.documentTools` |
| "tool" | pixel-studio.tsx | 53 | Singular count label | `directory.singular` |
| "tools" | pixel-studio.tsx | 53 | Plural count label | `directory.plural` |
| "Show fewer {sectionName}" | pixel-studio.tsx | 66 | Collapse button (when expanded) | `directory.showFewer` |
| "Show {count} more {sectionName}" | pixel-studio.tsx | 66 | Expand button text | `directory.showMore` |

### Promises Section
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "Processed on your device" | pixel-studio.tsx | 75 | Promise card | `promises.onDevice` |
| "No watermark" | pixel-studio.tsx | 79 | Promise card | `promises.noWatermark` |
| "No AI needed" | pixel-studio.tsx | 83 | Promise card | `promises.noAI` |

### Photo Section
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "PHOTO & APPLICATION TOOLS" | pixel-studio.tsx | 86 | Kicker | `photo.label` |
| "Right dimensions. One less worry." | pixel-studio.tsx | 86 | Heading | `photo.heading` |
| "Crop and position your photo with size presets. Always check your application's official requirements." | pixel-studio.tsx | 86 | Description | `photo.description` |
| "Prepare a photo" | pixel-studio.tsx | 86 | CTA text | `photo.cta` |

### Workspace Entry (Image Workspace Link)
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "Image workspace" | workspace-entry.tsx | N/A | aria-label | `workspace.label` |
| "Upload image to workspace" | workspace-entry.tsx | N/A | aria-label | `workspace.uploadLabel` |

---

## 3. ALL TOOLS (23 Total)
**Target File:** `locales/en/tools.json`
**Source File:** config/tools.ts

Each tool has 4 fields:
- `name` - Tool name
- `description` - Short 1-line description
- `longDescription` - Detailed description
- `category` - Category name

### Tool List & Strings

#### Optimization
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

**All 23 Tools to Extract from config/tools.ts (lines 21-336):**
1. Compress Image
2. Resize Image
3. Crop & Rotate Image
4. Convert Image
5. JPG to PNG
6. PNG to JPG
7. Add Text to Image
8. Blur Image
9. Bulk Image Compressor
10. Signature Resizer
11. PNG to WebP
12. WebP to PNG
13. WebP to JPG
14. JPG to WebP
15. Bulk Image Resizer
16. Pixelate Image
17. Watermark Image
18. ID Photo Resizer
19. Visa Photo Resizer
20. Passport Photo Resizer
21. JPG to PDF
22. PDF to JPG
23. Merge PDF
24. Split PDF
25. Organize PDF
26. Image to PDF
27. PDF to PNG
28. Compress PDF

**Categories to Extract:**
- Optimization
- Resize
- Edit
- Conversion
- Batch tools
- Applications
- PDF tools
- Documents

---

## 4. WORKSPACE STRINGS (Image Editing UI)
**Target File:** `locales/en/workspace.json`
**Source Files:** components/workspace/workspace.tsx, components/tools/upload-dropzone.tsx

### Upload & File Handling
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "Drop your {kind} here" | upload-dropzone.tsx | 32 | Single file prompt | `upload.dropSingle` |
| "Drop your {kinds} here" | upload-dropzone.tsx | 32 | Multiple files prompt | `upload.dropMultiple` |
| "or" | upload-dropzone.tsx | 33 | Alternative text | `upload.or` |
| "browse {fileType} from your device" | upload-dropzone.tsx | 33 | Browse text | `upload.browse` |
| "JPG, PNG or WebP · up to {size} MB" | upload-dropzone.tsx | 34 | File type/size hint (image) | `upload.imageHint` |
| "PDF · up to {count} files" | upload-dropzone.tsx | 34 | File type/size hint (PDF) | `upload.pdfHint` |
| "Could not read this image." | workspace.tsx | 1252 | Error message | `upload.error` |

### Workspace Toolbar
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "New image" | workspace.tsx | 1326 | Button text | `workspace.newImage` |
| "Image controls" | workspace.tsx | 1318 | aria-label | `workspace.controlsLabel` |
| "Image preview" | workspace.tsx | 1341 | aria-label | `workspace.previewLabel` |

### Compress Engine
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "Quality" | workspace.tsx | 220 | Mode button | `compress.quality` |
| "Target size" | workspace.tsx | 227 | Mode button | `compress.targetSize` |
| "Quality · {percent}%" | workspace.tsx | 236 | Label with value | `compress.qualityLabel` |
| "Smaller" | workspace.tsx | 246 | Range hint left | `compress.smaller` |
| "Sharper" | workspace.tsx | 247 | Range hint right | `compress.sharper` |
| "Target size" | workspace.tsx | 252 | Label | `compress.targetSizeLabel` |
| "{kb} KB" | workspace.tsx | 261 | Preset button | `compress.preset` |

### Resize Engine
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "Pixels" | workspace.tsx | 332 | Mode button | `resize.pixels` |
| "Percent" | workspace.tsx | 339 | Mode button | `resize.percent` |
| "W" | workspace.tsx | 348 | Width label | `resize.width` |
| "H" | workspace.tsx | 360 | Height label | `resize.height` |
| "×" | workspace.tsx | 358 | Dimension separator | `resize.separator` |
| "Lock aspect ratio" | workspace.tsx | 377 | Checkbox label | `resize.lockRatio` |
| "Scale · {percent}%" | workspace.tsx | 382 | Label with value | `resize.scaleLabel` |
| "1%" | workspace.tsx | 391 | Range hint left | `resize.minPercent` |
| "200%" | workspace.tsx | 392 | Range hint right | `resize.maxPercent` |
| "Social media presets" | workspace.tsx | 398 | Collapsible title | `resize.socialPresets` |
| "Document & ID presets" | workspace.tsx | 414 | Collapsible title | `resize.docPresets` |

#### Resize Presets (Social)
| String | Value | Namespace Key |
|--------|-------|----------------|
| "Instagram Post" | 1080×1080 | `resize.instagram.post` |
| "Instagram Story" | 1080×1920 | `resize.instagram.story` |
| "YouTube Thumbnail" | 1280×720 | `resize.youtube` |
| "LinkedIn Cover" | 1584×396 | `resize.linkedin` |
| "Facebook Cover" | 820×312 | `resize.facebook` |
| "Twitter/X Header" | 1500×500 | `resize.twitter` |

#### Resize Presets (Documents)
| String | Value | Namespace Key |
|--------|-------|----------------|
| "Passport (2×2 in)" | 600×600 | `resize.passport` |
| "Visa (35×45 mm)" | 413×531 | `resize.visa` |
| "ID Photo" | 413×531 | `resize.idPhoto` |
| "Signature (150×60)" | 150×60 | `resize.signature` |

### Edit Engine - Crop Section
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "Crop" | workspace.tsx | 494 | Subsection title | `edit.crop` |
| "Aspect ratio" | workspace.tsx | 496 | Label | `edit.aspectRatio` |
| "Free" | workspace.tsx | 435 | Aspect option | `edit.aspect.free` |
| "1:1" | workspace.tsx | 436 | Aspect option | `edit.aspect.11` |
| "4:3" | workspace.tsx | 437 | Aspect option | `edit.aspect.43` |
| "3:2" | workspace.tsx | 438 | Aspect option | `edit.aspect.32` |
| "16:9" | workspace.tsx | 439 | Aspect option | `edit.aspect.169` |
| "Custom" | workspace.tsx | 440 | Aspect option | `edit.aspect.custom` |
| "X offset · {percent}%" | workspace.tsx | 545 | Label with value | `edit.xOffset` |
| "Y offset · {percent}%" | workspace.tsx | 559 | Label with value | `edit.yOffset` |
| "Reset crop" | workspace.tsx | 579 | Button text | `edit.resetCrop` |

### Edit Engine - Rotate & Flip
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "Rotate & Flip" | workspace.tsx | 585 | Subsection title | `edit.rotateFlip` |
| "Rotate" | workspace.tsx | 587 | Label | `edit.rotate` |
| "{rotation}°" | workspace.tsx | 596 | Button text (0, 90, 180, 270) | `edit.degrees` |
| "Flip H" | workspace.tsx | 607 | Button text (with icon) | `edit.flipH` |
| "Flip V" | workspace.tsx | 614 | Button text (with icon) | `edit.flipV` |

### Edit Engine - Adjustments
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "Adjustments" | workspace.tsx | 620 | Subsection title | `edit.adjustments` |
| "Brightness" | workspace.tsx | 623 | Label | `edit.brightness` |
| "Contrast" | workspace.tsx | 624 | Label | `edit.contrast` |
| "Saturation" | workspace.tsx | 625 | Label | `edit.saturation` |
| "Grayscale" | workspace.tsx | 646 | Checkbox label | `edit.grayscale` |
| "Sepia" | workspace.tsx | 647 | Checkbox label | `edit.sepia` |
| "Invert" | workspace.tsx | 648 | Checkbox label | `edit.invert` |

### Edit Engine - Enhance
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "Enhance" | workspace.tsx | 660 | Subsection title | `edit.enhance` |
| "Blur" | workspace.tsx | 662 | Label | `edit.blur` |
| "off" | workspace.tsx | 663 | Blur off state | `edit.off` |
| "{blur}px" | workspace.tsx | 663 | Blur value | `edit.pixels` |
| "Off" | workspace.tsx | 673 | Range hint left | `edit.blurOff` |
| "20px" | workspace.tsx | 674 | Range hint right | `edit.blur20px` |
| "Pixelate / Censor" | workspace.tsx | 679 | Label | `edit.pixelate` |
| "Sharpen" | workspace.tsx | 700 | Checkbox label | `edit.sharpen` |
| "(disabled while blur/pixelate active)" | workspace.tsx | 702 | Hint text | `edit.sharphenDisabled` |

### Edit Engine - Canvas
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "Canvas" | workspace.tsx | 708 | Subsection title | `edit.canvas` |
| "Padding" | workspace.tsx | 710 | Label | `edit.padding` |
| "px" | workspace.tsx | 719 | Unit | `edit.pixelUnit` |
| "Border" | workspace.tsx | 729 | Label | `edit.border` |
| "Rounded corners" | workspace.tsx | 748 | Label | `edit.roundedCorners` |
| "off" | workspace.tsx | 749 | Rounded corners off | `edit.cornerOff` |
| "{borderRadius}px" | workspace.tsx | 749 | Rounded corners value | `edit.cornerPixels` |
| "Square" | workspace.tsx | 759 | Range hint left | `edit.cornerSquare` |
| "Pill" | workspace.tsx | 760 | Range hint right | `edit.cornerPill` |

### Edit Engine - Overlay
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "Overlay" | workspace.tsx | 766 | Subsection title | `edit.overlay` |
| "Text watermark" | workspace.tsx | 778 | Checkbox label | `edit.textWatermark` |
| "Size" | workspace.tsx | 793 | Label | `edit.fontSize` |
| "Color" | workspace.tsx | 807 | Label | `edit.color` |
| "Bold" | workspace.tsx | 819 | Checkbox label | `edit.bold` |
| "Opacity" | workspace.tsx | 826 | Label | `edit.textOpacity` |
| "Position" | workspace.tsx | 839 | Label | `edit.position` |
| "Logo / image watermark" | workspace.tsx | 872 | Checkbox label | `edit.logoWatermark` |
| "Upload logo image" | workspace.tsx | 882 | Button text (first time) | `edit.uploadLogo` |
| "Change logo image" | workspace.tsx | 882 | Button text (has image) | `edit.changeLogo` |
| "Size" | workspace.tsx | 896 | Label (for logo scale) | `edit.logoSize` |
| "Opacity" | workspace.tsx | 910 | Label (for logo opacity) | `edit.logoOpacity` |
| "Remove logo" | workspace.tsx | 946 | Button text | `edit.removeLogo` |

### Convert Engine
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "Output format" | workspace.tsx | 1002 | Label | `convert.format` |
| "JPEG" | workspace.tsx | 973 | Option | `convert.jpeg` |
| "PNG" | workspace.tsx | 979 | Option | `convert.png` |
| "WebP" | workspace.tsx | 985 | Option | `convert.webp` |
| "Best for photos. Smallest file size. No transparency." | workspace.tsx | 974 | Format hint | `convert.jpegHint` |
| "Lossless. Preserves transparency. Larger files." | workspace.tsx | 980 | Format hint | `convert.pngHint` |
| "Modern format. Great quality-to-size balance. Broad support." | workspace.tsx | 986 | Format hint | `convert.webpHint` |

### Workflow & Preview
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "Edit" | workspace.tsx | 1105 | Engine label | `engines.edit` |
| "Resize" | workspace.tsx | 1119 | Engine label | `engines.resize` |
| "Convert" | workspace.tsx | 1133 | Engine label | `engines.convert` |
| "Compress" | workspace.tsx | 1141 | Engine label | `engines.compress` |
| "Workflow:" | workspace.tsx | 1035 | Label | `preview.workflow` |
| "Original" | workspace.tsx | 1374 | Toggle button | `preview.original` |
| "Final" | workspace.tsx | 1382 | Toggle button | `preview.final` |
| "Preview will appear after processing" | workspace.tsx | 1357 | Placeholder text | `preview.placeholder` |
| "Original image" | workspace.tsx | 1348 | Image alt text | `preview.altOriginal` |
| "Processed preview" | workspace.tsx | 1350 | Image alt text | `preview.altFinal` |
| "Processing…" | workspace.tsx | 1363 | Status message | `status.processing` |

### Output & Download
| String | Source File | Line | Context | Namespace Key |
|--------|------------|------|---------|----------------|
| "Original" | workspace.tsx | 1066 | Output column label | `output.original` |
| "Final" | workspace.tsx | 1072 | Output column label | `output.final` |
| "Download Final Image" | workspace.tsx | 1413 | Button text | `download.button` |

---

## 5. FAQ STRINGS
**Target File:** `locales/en/faq.json`
**Source File:** app/page.tsx (lines 7-14)

| Question | Answer | Namespace Key |
|----------|--------|----------------|
| "Is PixProMax free?" | "Yes. The current browser-based image tools are free, require no account, and add no watermark." | `faq.free` |
| "Are my images uploaded?" | "For active compression, resizing, conversion, batch, target-size, and passport tools, processing happens locally in your browser." | `faq.uploaded` |
| "Can I use it on mobile?" | "Yes. The interface supports touch devices and includes a regular file picker for phones and tablets." | `faq.mobile` |
| "Which formats are supported?" | "Core tools support JPG, JPEG, PNG, and WebP. The converter also accepts AVIF, HEIC, and HEIF, with JPG, PNG, or WebP output." | `faq.formats` |
| "Can I resize an image to 20 KB or 50 KB?" | "Yes. The target-size tool iteratively adjusts quality and dimensions to get reasonably close to your chosen size." | `faq.targetSize` |
| "Does PixProMax add watermarks?" | "No. Downloads from the active tools do not include a PixProMax watermark." | `faq.watermarks` |

---

## 6. METADATA STRINGS (Page Titles & Descriptions)
**Target File:** `locales/en/metadata.json`
**Source Files:** All app/[tool]/page.tsx files

Extract for each of 23 tool pages:
- `title` - Page title (from metadata.title)
- `description` - Page description (from metadata.description)

Example structure:
```json
{
  "compress-image": {
    "title": "Compress Image Online – PixProMax",
    "description": "Reduce image file size without losing quality. Adjust quality manually or hit a target KB. Supports JPG, PNG, and WebP."
  },
  "resize-image": {
    "title": "Resize Image Online – PixProMax",
    "description": "Resize images with precise dimensions and aspect-ratio control. Perfect for social media, documents, and applications."
  }
}
```

**Tool Pages to Extract From:**
1. app/compress-image/page.tsx
2. app/resize-image/page.tsx
3. app/crop-image/page.tsx
4. app/convert-image/page.tsx
5. app/jpg-to-png/page.tsx
6. app/png-to-jpg/page.tsx
7. app/add-text-to-image/page.tsx
8. app/blur-image/page.tsx
9. app/bulk-image-compressor/page.tsx
10. app/signature-resizer/page.tsx
11. app/png-to-webp/page.tsx
12. app/webp-to-png/page.tsx
13. app/webp-to-jpg/page.tsx
14. app/jpg-to-webp/page.tsx
15. app/bulk-image-resizer/page.tsx
16. app/pixelate-image/page.tsx
17. app/watermark-image/page.tsx
18. app/id-photo-resizer/page.tsx
19. app/visa-photo-resizer/page.tsx
20. app/passport-photo-resizer/page.tsx
21. app/jpg-to-pdf/page.tsx
22. app/pdf-to-jpg/page.tsx
23. app/merge-pdf/page.tsx
24. app/split-pdf/page.tsx
25. app/organize-pdf/page.tsx
26. app/image-to-pdf/page.tsx
27. app/pdf-to-png/page.tsx
28. app/pdf-compress/page.tsx

---

## Extraction Checklist

### Phase 3 Tasks

**locales/en/common.json**
- [ ] Header navigation (6 items)
- [ ] Header menu (6 items)
- [ ] Header search (3 items)
- [ ] Theme toggle (1 item)
- [ ] Footer brand & links (12 items)
- [ ] Cookie consent (4 items)
- **Total: 32 strings**

**locales/en/home.json**
- [ ] Hero section (8 items)
- [ ] Shortcuts section (9 items)
- [ ] Tools directory (6 items)
- [ ] Promises section (3 items)
- [ ] Photo section (4 items)
- **Total: 30 strings**

**locales/en/tools.json**
- [ ] Extract 23 tools × 4 fields = 92 items
- [ ] Extract 8 unique categories = 8 items
- **Total: 100 strings**

**locales/en/workspace.json**
- [ ] Upload section (6 items)
- [ ] Workspace toolbar (3 items)
- [ ] Compress engine (5 items)
- [ ] Resize engine (17 items) + presets (10 items)
- [ ] Edit crop section (8 items)
- [ ] Edit rotate/flip section (6 items)
- [ ] Edit adjustments section (6 items)
- [ ] Edit enhance section (8 items)
- [ ] Edit canvas section (9 items)
- [ ] Edit overlay section (11 items)
- [ ] Convert engine (7 items)
- [ ] Workflow & preview (10 items)
- [ ] Output & download (3 items)
- **Total: 109 strings**

**locales/en/messages.json**
- [ ] Error messages (1 item)
- [ ] Validation messages (0 items for now)
- **Total: 1 string**

**locales/en/faq.json**
- [ ] 6 Q&A pairs (12 items total)
- **Total: 12 strings**

**locales/en/metadata.json**
- [ ] 23 tool pages × 2 fields = 46 items
- **Total: 46 strings**

---

## Grand Total

| File | Strings | Status |
|------|---------|--------|
| common.json | 32 | [ ] TODO |
| home.json | 30 | [ ] TODO |
| tools.json | 100 | [ ] TODO |
| workspace.json | 109 | [ ] TODO |
| messages.json | 1 | [ ] TODO |
| faq.json | 12 | [ ] TODO |
| metadata.json | 46 | [ ] TODO |
| **TOTAL** | **330** | **[ ] TODO** |

**Note:** This is English source strings. Multiply by 12 languages for full effort = 3,960 translation strings.

---

## Tips for Accurate Extraction

1. **Copy exact strings** - Don't paraphrase
2. **Preserve formatting** - Newlines, quotes, special characters
3. **Note placeholders** - `{variable}` patterns for string interpolation
4. **Keep context** - Tool descriptions differ from headings
5. **Mark duplicates** - Some strings appear in multiple places (can reuse)
6. **Test in browser** - Verify string looks right when inserted back

---

## Next Phase: Translation Strategy

Once English strings are extracted:

1. **Review for accuracy** - Native English speaker QA
2. **Identify patterns** - Recurring phrases that can be simplified
3. **Create translation guide** - Glossary for consistent terminology
4. **Allocate to translators** - Or use translation service
5. **Verify completeness** - No missing or duplicate keys
6. **Load test** - Ensure all JSON loads without errors

