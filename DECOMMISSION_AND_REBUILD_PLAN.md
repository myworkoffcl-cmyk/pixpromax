# PixProMax Image Tools — Decommissioning & Rebuild Plan

**Status:** Planning Phase  
**Date:** 2026-09-17  
**Decision:** Decommission legacy image tools, keep stable new system, build 60+ specialized tools

---

## CURRENT STATE ANALYSIS

### STABLE NEW IMAGE SYSTEM ✅ (DO NOT TOUCH)

Routes that form the foundation:
- `/image-tools/compress` — Compress Images (4 engines available)
- `/image-tools/resize` — Resize Images (4 engines available)
- `/image-tools/edit` — Edit Images (4 engines available)
- `/image-tools/convert` — Convert Images (4 engines available)
- `/workspace` — Universal Image Workspace (entry point)

Components:
- `UniversalWorkspace` — Main workspace component
- `workspace-category-header` — Simple header (title + description only)
- `ImagePreview` — Preview component
- 4 Engine implementations (Compress, Resize, Edit, Convert)

Layout Rules (MANDATORY FOR ALL NEW TOOLS):
- Desktop: 2-column (controls left, preview right)
- Mobile: stacked vertical
- Original | Final toggle inside preview
- Download Final Image button below preview
- Same `workspace-page` class
- Same `workspace-category-header` for titles
- No hero sections, centered forms, or legacy UI

---

## LEGACY IMAGE TOOLS — TO DECOMMISSION

### Old Routes (Will be removed or redirected)

```
ROUTE                          CURRENT TOOL              ACTION
─────────────────────────────────────────────────────────────────
/compress-image                CompressTool              REMOVE
/resize-image                  ResizeTool                REMOVE
/crop-image                    CropTool                  REMOVE
/convert-image                 ConvertTool               REMOVE
/resize-image-to-kb            TargetSizeTool            REMOVE
/batch-converter               BatchConverterTool        REMOVE
/passport-photo-maker          PassportTool              REDIRECT to /passport-photo-resizer (new)
/signature-resizer             SignatureTool             REDIRECT to /signature-resizer (new)
/image-to-pdf                  ImageToPdfTool            REDIRECT to /jpg-to-pdf
/jpg-to-pdf                    PdfTool                   KEEP (not image-only, but useful)
/pdf-to-jpg                    PdfTool                   KEEP (not image-only, but useful)
/merge-pdf                      PdfTool                   KEEP (not image-only, but useful)
/split-pdf                      PdfTool                   KEEP (not image-only, but useful)
/organize-pdf                   PdfTool                   KEEP (not image-only, but useful)
```

### Old Components (Legacy tool implementations to remove)

These should be deleted ONLY after confirming no new system depends on them:
- `components/tools/compress-tool.tsx`
- `components/tools/resize-tool.tsx`
- `components/tools/crop-tool.tsx`
- `components/tools/convert-tool.tsx`
- `components/tools/target-size-tool.tsx`
- `components/tools/batch-converter-tool.tsx`
- `components/tools/passport-tool.tsx`
- `components/tools/signature-tool.tsx`
- `components/tools/image-to-pdf-tool.tsx`
- `components/tools/tool-page-shell.tsx` (newly created migration wrapper, no longer needed)
- `components/tools/tool-page.tsx` (old wrapper, no longer needed)

---

## NEW SPECIALIZED TOOLS — BUILD FROM SCRATCH

### Engine Reuse Pattern

Every new tool is mostly configuration + preset.

Example templates:

**Compression Tool:**
```tsx
// /compress-jpg/page.tsx
<main className="workspace-page">
  <div className="workspace-category-header shell">
    <h1>Compress JPG</h1>
    <p>Reduce JPG file size while keeping quality.</p>
  </div>
  <UniversalWorkspace
    init={{
      initialEngine: "compress",
      compress: { enabled: true, presetFormat: "jpg" },
    }}
  />
</main>
```

**Resize Tool:**
```tsx
// /passport-photo-resizer/page.tsx
<main className="workspace-page">
  <div className="workspace-category-header shell">
    <h1>Passport Photo Resizer</h1>
    <p>Resize and prepare photos for passport applications.</p>
  </div>
  <UniversalWorkspace
    init={{
      initialEngine: "resize",
      resize: { enabled: true, presets: "passport" },
      crop: { enabled: true },
      compress: { enabled: true },
    }}
  />
</main>
```

**Conversion Tool:**
```tsx
// /jpg-to-png/page.tsx
<main className="workspace-page">
  <div className="workspace-category-header shell">
    <h1>JPG to PNG</h1>
    <p>Convert JPG images to PNG format.</p>
  </div>
  <UniversalWorkspace
    init={{
      initialEngine: "convert",
      convert: { enabled: true, output: "png" },
    }}
  />
</main>
```

### Phase 1 Tools (High Priority) — 18 tools

```
TOOL                             ENGINE(S)              ESTIMATED COMPLEXITY
─────────────────────────────────────────────────────────────────────────────
1. Compress Image to Target Size  Compress + Resize      MEDIUM
2. Bulk Image Compressor          Compress (batch)       MEDIUM
3. Bulk Image Resizer             Resize (batch)         MEDIUM
4. Passport Photo Resizer         Resize + Crop + Compress  MEDIUM
5. Visa Photo Resizer             Resize + Crop + Compress  MEDIUM
6. ID Photo Resizer               Resize + Crop + Compress  MEDIUM
7. Signature Resizer              Resize + Crop + Compress  MEDIUM
8. Crop Image                     Edit (crop)            SIMPLE
9. Blur Image                     Edit (blur)            SIMPLE
10. Pixelate / Censor Image       Edit (pixelate)        SIMPLE
11. Watermark Image               Edit (watermark)       MEDIUM
12. Add Text to Image             Edit (text)            MEDIUM
13. JPG to PNG                    Convert (output=PNG)   SIMPLE
14. PNG to JPG                    Convert (output=JPG)   SIMPLE
15. JPG to WebP                   Convert (output=WebP)  SIMPLE
16. PNG to WebP                   Convert (output=WebP)  SIMPLE
17. WebP to JPG                   Convert (output=JPG)   SIMPLE
18. WebP to PNG                   Convert (output=PNG)   SIMPLE
```

---

## EXECUTION CHECKLIST

### STEP 1: Prepare Decommissioning

- [ ] Verify no shared components used by stable new system depend on legacy tools
- [ ] Create redirects for routes with valuable SEO history
- [ ] Remove legacy tool routes from homepage navigation
- [ ] Remove legacy tool routes from tool listings/sitemap
- [ ] Verify no internal links to legacy routes remain

### STEP 2: Remove Legacy Routes

- [ ] Delete `/compress-image/page.tsx`
- [ ] Delete `/resize-image/page.tsx`
- [ ] Delete `/crop-image/page.tsx`
- [ ] Delete `/convert-image/page.tsx`
- [ ] Delete `/resize-image-to-kb/page.tsx`
- [ ] Delete `/batch-converter/page.tsx`
- [ ] Add redirects for `/image-to-pdf` → `/jpg-to-pdf`
- [ ] Remove passport-photo-maker route (will rebuild as new tool)
- [ ] Remove signature-resizer route (will rebuild as new tool)

### STEP 3: Remove Legacy Components

- [ ] Delete legacy tool component files (after confirming no shared use)
- [ ] Delete ToolPageShell component (migration wrapper, no longer needed)
- [ ] Delete ToolPage component (old wrapper, no longer needed)

### STEP 4: Build Phase 1 Tools

For each tool in Phase 1:
- [ ] Create `/new-route/page.tsx`
- [ ] Configure UniversalWorkspace with appropriate engines
- [ ] Add SEO metadata (title, description, canonical)
- [ ] Test on desktop and mobile
- [ ] Verify engine behavior
- [ ] Verify download works
- [ ] Verify responsive layout

### STEP 5: Verify Stable System

After each tool is added:
- [ ] Run production build
- [ ] Run typecheck
- [ ] Run linting
- [ ] Verify existing tools still work
- [ ] Verify no regressions in workspace

---

## ROUTE STRUCTURE

### Compression Routes
```
/compress-jpg
/compress-png
/compress-webp
/compress-image-to-50kb
/compress-image-to-100kb
/bulk-image-compressor
```

### Resize Routes
```
/resize-jpg
/resize-png
/resize-webp
/resize-image-by-percentage
/resize-image-to-file-size
/bulk-image-resizer
/passport-photo-resizer
/visa-photo-resizer
/id-photo-resizer
/signature-resizer
/social-media-image-resizer
```

### Edit Routes
```
/crop-image
/rotate-image
/flip-image
/blur-image
/pixelate-image
/sharpen-image
/adjust-image
/add-text-to-image
/watermark-image
/add-border-to-image
/add-padding-to-image
/change-image-background
```

### Conversion Routes
```
/jpg-to-png
/png-to-jpg
/jpg-to-webp
/png-to-webp
/webp-to-jpg
/webp-to-png
/jpg-to-avif
/png-to-avif
/heic-to-jpg
/heic-to-png
/batch-image-converter
```

---

## DO NOT

- ❌ Modify UniversalWorkspace component
- ❌ Change workspace-category-header styling
- ❌ Add legacy hero sections to new tools
- ❌ Create custom one-off layouts
- ❌ Fork engines for specific tools
- ❌ Leave dead legacy routes publicly accessible
- ❌ Create duplicate old + new versions
- ❌ Change the Original | Final toggle behavior
- ❌ Move the download button
- ❌ Change the 2-column desktop layout

---

## DO

- ✅ Reuse 4 engines with different configurations
- ✅ Use workspace-category-header for all titles
- ✅ Use UniversalWorkspace for all new tools
- ✅ Test each new tool before moving to next
- ✅ Keep responsive behavior consistent
- ✅ Add proper SEO metadata
- ✅ Run full build after each tool
- ✅ Verify no regressions

---

## DECOMMISSION REPORT (To be filled during execution)

### Removed Routes
- [ ] /compress-image
- [ ] /resize-image
- [ ] /crop-image
- [ ] /convert-image
- [ ] /resize-image-to-kb
- [ ] /batch-converter

### Redirected Routes
- [ ] /image-to-pdf → /jpg-to-pdf
- [ ] /passport-photo-maker → /passport-photo-resizer
- [ ] /signature-resizer → /signature-resizer (renamed)

### Removed Components
- [ ] CompressTool
- [ ] ResizeTool
- [ ] CropTool
- [ ] ConvertTool
- [ ] TargetSizeTool
- [ ] BatchConverterTool
- [ ] PassportTool
- [ ] SignatureTool
- [ ] ImageToPdfTool
- [ ] ToolPageShell
- [ ] ToolPage

### Built Phase 1 Tools
(To be filled as tools are built)

---

## NEXT STEPS

1. Review this plan
2. Execute STEP 1: Prepare Decommissioning
3. Execute STEP 2: Remove Legacy Routes
4. Execute STEP 3: Remove Legacy Components
5. Build Phase 1 tools one by one
6. Test extensively
7. Build Phase 2 tools
8. Build Phase 3 tools
9. Generate final report
