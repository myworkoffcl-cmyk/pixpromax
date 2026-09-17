# PIXPROMAX — PHASE 2A: SEO EXPANSION ARCHITECTURE DESIGN

**Date**: 2026-09-17  
**Status**: DESIGN ONLY — No Code Changes  
**Review Required**: YES

---

## EXECUTIVE SUMMARY

PixProMax Phase 1 is complete with 27 active tool pages achieving 100/100 SEO scores. Phase 2A proposes a scalable landing-page architecture supporting hundreds of high-intent SEO pages without duplication, while preserving the stable image/PDF processing engines.

**Key Constraints**:
- ✅ Existing UniversalWorkspace engine must remain untouched
- ✅ Image/PDF processing unchanged
- ✅ Tool database (tools.ts) unchanged
- ✅ No duplicate implementations
- ✅ Scalable metadata generation
- ✅ Controlled route expansion

---

## SECTION 1: CURRENT ARCHITECTURE FINDINGS

### 1.1 Existing Route Structure (37 routes)

**Core Components**:
- `app/` root directory (40 subdirectories)
- 27 active tools (from tools.ts)
- 4 category shortcuts (`/image-tools/{compress,resize,convert,edit}`)
- 1 workspace `/workspace` (internal tool selector)
- 5 legal/info pages (`/about`, `/contact`, `/faq`, `/privacy-policy`, `/terms`, `/disclaimer`)
- 2 redirects (`/privacy` → `/privacy-policy`, `/image-to-pdf` → `/jpg-to-pdf`)

**Tool Configuration**:
```typescript
// types/tool.ts
interface ToolConfig {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  status: ToolStatus;
  icon: LucideIcon;
  accent: string;
  related: string[];
}
```

Minimal schema, highly reusable. Can extend without breaking.

### 1.2 Reusable Components

**Workspace Engine**:
- `components/workspace/workspace.tsx` (46KB, core processing)
- `components/workspace/workspace-entry.tsx` (tool selector)
- **Status**: Stable, untouchable. Supports all image/PDF operations.

**Metadata System** (Phase 1):
- `lib/seo.ts` contains:
  - `toolMetadata()` — generates title, canonical, OG, Twitter
  - `getToolSchemas()` — generates BreadcrumbList + SoftwareApplication
  - `getOrganizationSchema()` — generates homepage Organization schema
- **Key Achievement**: Child pages include social metadata without override risk
- **Reusable Pattern**: Can extend for new page types

**Sitemap Generation** (Dynamic):
- `app/sitemap.ts` filters tools by status, excludes redirects
- Can extend to include new page types with same pattern

### 1.3 Metadata Pattern (Current)

Every tool page follows this pattern:
```typescript
// page.tsx
const tool = getTool("slug");
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  const schemas = getToolSchemas(tool);
  return (
    <main className="workspace-page">
      {schemas.map((schema, i) => <JsonLd key={i} data={schema} />)}
      <div className="workspace-category-header shell">
        <h1>{tool.name}</h1>
        <p>{tool.longDescription}</p>
      </div>
      <UniversalWorkspace init={{...}} />
    </main>
  );
}
```

**Observation**: 27 nearly-identical pages. Perfect candidate for abstraction.

### 1.4 Internal Link Architecture

**Header**: `/`, `/#anchors`, `/privacy-policy`  
**Footer**: `/`, `/about`, `/contact`, `/faq`, `/privacy-policy`, `/terms`, `/disclaimer`  
**Homepage**: Tool grid links all 27 active tools  
**Tool Pages**: Related tools via `tool.related` array  

**Pattern**: Consistent breadcrumb pattern:
```
Home → [Category] → [Tool]
```

### 1.5 Canonical & Sitemap Strategy

**Current**:
- Canonicals: Self-referential (e.g., `/compress-image` → `/compress-image`)
- Sitemap: Only active tools, 34 URLs total
- Redirects: Excluded from sitemap (correct)
- Internal pages: `/workspace` excluded (correct)

**Extensible**: Can add new page types by filtering on type + status.

---

## SECTION 2: RECOMMENDED SEO PAGE TAXONOMY

### 2.1 Page Type System

**Propose 5 Core Types** (not 8, to avoid feature creep):

| Type | Purpose | Example | URL Pattern | Engine |
|------|---------|---------|-------------|--------|
| `tool` | Direct tool page | Compress Image | `/compress-image` | UniversalWorkspace |
| `format` | Format-specific guide | JPG to PNG | `/jpg-to-png` | UniversalWorkspace |
| `application` | Use-case page | Passport Photo Resizer | `/passport-photo-resizer` | UniversalWorkspace |
| `specification` | Technical requirement | Visa Photo Specifications | `/visa-photo-size` | Static + related tool |
| `exam` | Exam preparation | SAT Photo Requirements | `/sat-photo-requirements` | Static + related tool |

**Rationale for 5 Types**:
- `tool` + `format` + `application`: Already exist, high volume
- `specification`: Growing demand (size requirements for photos)
- `exam`: High-intent keywords, unique data model

### 2.2 Type Definitions & Strategies

#### Type: `tool` ✅ (Existing)
- **URL Pattern**: `/{slug}`
- **Engine**: UniversalWorkspace (full functionality)
- **Example**: `/compress-image`
- **Data**: From tools.ts
- **Canonical**: Self-referential
- **Indexable**: Yes
- **Related**: Via tool.related array
- **LD Schema**: BreadcrumbList + SoftwareApplication

#### Type: `format` (Implicit, separate routes)
- **URL Pattern**: `/{source}-to-{target}`
- **Engine**: UniversalWorkspace (conversion engine)
- **Example**: `/jpg-to-png`, `/png-to-jpg`
- **Data**: Inferred from slug (parse source/target)
- **Canonical**: Self-referential
- **Indexable**: Yes
- **Related**: Related formats + base tool
- **LD Schema**: BreadcrumbList + SoftwareApplication

**Note**: These already exist as separate tools. No new routes needed; treat as tool type.

#### Type: `application` (Specialization)
- **URL Pattern**: `/{use-case}-{tool}` e.g., `/passport-photo-resizer`
- **Engine**: UniversalWorkspace + Optional intro
- **Example**: `/passport-photo-resizer`, `/visa-photo-resizer`
- **Data**: Custom app config + related tool
- **Canonical**: Self-referential (own URL)
- **Indexable**: Yes
- **Related**: Base tool + similar applications
- **LD Schema**: BreadcrumbList + SoftwareApplication + specific specs

**Note**: Some already exist (passport-photo-resizer, visa-photo-resizer, id-photo-resizer, signature-resizer). These are specializations of resize-image + related tools.

#### Type: `specification` (New, Static + Link)
- **URL Pattern**: `/{format}-photo-{requirement}` e.g., `/passport-photo-size`
- **Engine**: Static content only + link to related tool
- **Example**: `/passport-photo-size`, `/visa-photo-dimensions`
- **Data**: Specifications YAML + related tool slug
- **Canonical**: Self-referential
- **Indexable**: Yes
- **Related**: Related photos (different countries) + tool
- **LD Schema**: BreadcrumbList + FAQPage (for specs)

#### Type: `exam` (New, Static + Link)
- **URL Pattern**: `/{exam-name}-{requirement}` e.g., `/sat-photo-requirements`
- **Engine**: Static content only + link to related tool
- **Example**: `/sat-photo-requirements`, `/act-photo-specifications`
- **Data**: Exam specs YAML + related tool slug
- **Canonical**: Self-referential
- **Indexable**: Yes
- **Related**: Related exams + related tools
- **LD Schema**: BreadcrumbList + FAQPage (for requirements)

### 2.3 Duplication Avoidance Strategy

**Same Specs, Different Countries?**
- `/passport-photo-size` (generic)
- `/indian-passport-photo-size` (country-specific)

**Approach**: 
- Canonical: `/passport-photo-size` (generic)
- Country-specific: Redirect OR separate page with hreflang
- **Decision**: Separate pages (no redirect) if content differs. Use hreflang for alternates.

**Same Tool, Different Angles?**
- `/compress-image` (tool)
- `/compress-png-online` (same tool, keyword angle)

**Approach**:
- Canonical: `/compress-image`
- Keyword angles: Redirects to `/compress-image` (301)
- **Decision**: Avoid creating N pages for 1 tool. Use canonical+redirect pattern.

---

## SECTION 3: TYPED DATA MODEL

### 3.1 SEO Page Data Model (TypeScript)

```typescript
// types/seo-page.ts

export type SeoPageType = "tool" | "format" | "application" | "specification" | "exam";

export interface SeoPageBase {
  // Identity
  id: string;                    // unique ID (e.g., "passport-photo-size")
  slug: string;                  // URL path (e.g., "passport-photo-size")
  type: SeoPageType;
  
  // Required Metadata
  title: string;                 // SEO title (e.g., "Passport Photo Size Requirements")
  description: string;           // Meta description (160 chars)
  h1: string;                    // Page heading
  
  // Content
  intro: string;                 // Lead paragraph (why this page matters)
  sections: ContentSection[];    // H2+ structured content
  faqs?: Faq[];                  // FAQs if applicable
  
  // Relationships
  relatedPages: string[];        // Slugs of related SEO pages
  relatedTools: string[];        // Slugs of related tools
  toolEngine?: string;           // Tool slug if page embeds UniversalWorkspace
  
  // Technical
  canonical: string;             // Canonical URL (full)
  indexable: boolean;            // Include in sitemap
  priority: number;              // Sitemap priority (0.0-1.0)
  changeFrequency: "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  
  // SEO Signals
  keywords?: string[];           // Primary keywords
  intent: "information" | "comparison" | "navigation" | "conversion";
  
  // Metadata (auto-generated)
  createdAt: string;             // ISO date
  updatedAt: string;             // ISO date
  authoritative: boolean;        // Is this the definitive source?
}

export interface ContentSection {
  heading: string;
  content: string;               // Markdown allowed
  subsections?: ContentSection[];
}

export interface Faq {
  question: string;
  answer: string;                // Markdown allowed
  schema?: boolean;              // Include in schema.org FAQPage
}

// Type-Specific Extensions

export interface SpecificationPage extends SeoPageBase {
  type: "specification";
  specification: {
    format?: string;             // "JPG", "PNG", etc.
    width?: number;              // pixels
    height?: number;             // pixels
    dpi?: number;
    fileSize?: {
      min?: number;              // KB
      max?: number;              // KB
    };
    colorMode?: string;          // "RGB", "CMYK", etc.
    background?: string;         // "white", "none", etc.
    aspectRatio?: string;        // "4:3", "1:1", etc.
  };
  sourceUrl?: string;            // Link to official requirement
  lastVerified: string;          // ISO date
}

export interface ExamPage extends SeoPageBase {
  type: "exam";
  exam: {
    name: string;                // "SAT", "ACT", "GRE", etc.
    organization: string;        // "College Board", etc.
    testType: string;            // "Standardized", "State", etc.
    authority: number;           // 1-5 confidence in accuracy
  };
  specifications: {
    format?: string;
    width?: number;
    height?: number;
    dpi?: number;
    fileSize?: {
      min?: number;
      max?: number;
    };
    background?: string;
    expression?: string;         // Specific expression requirements
    glasses?: boolean;           // Allowed or not
  };
  sourceUrl?: string;
  lastVerified: string;
  year?: number;                 // If requirements change by year
}
```

### 3.2 Data Storage Approach

**Option A**: YAML files + TypeScript config (simple)
- `data/seo-pages/specifications/` (YAML files per page)
- `data/seo-pages/exams/` (YAML files per page)
- Load at build time via `getStaticProps` equivalent

**Option B**: Database (scalable)
- Requires migration (out of Phase 2A scope)

**Recommendation**: Start with YAML (Option A) for simplicity. Migrate to DB later if needed.

---

## SECTION 4: URL CONVENTIONS

### 4.1 URL Pattern Rules

```
Tool Pages:
/{tool-slug}                 (e.g., /compress-image)
/{format-a}-to-{format-b}    (e.g., /jpg-to-png)
/{application}-{tool}        (e.g., /passport-photo-resizer)

Specification Pages:
/{format}-photo-{spec}       (e.g., /passport-photo-size)
/{country}-{format}-photo    (e.g., /indian-passport-photo)
/{exam}-requirements         (e.g., /sat-photo-requirements)

Legal/Info Pages:
/{info-slug}                 (e.g., /about, /privacy-policy)
```

### 4.2 Slug Generation Rules

- Lowercase only
- Hyphens for word separation
- No underscores
- No trailing slashes
- Max 50 characters
- Descriptive (users understand URL)
- NO keyword stuffing (e.g., `/compress-image-online-free-tool` ❌)

---

## SECTION 5: REUSABLE TEMPLATE DESIGN

### 5.1 Generic Landing Page Component

```typescript
// components/seo-page-shell.tsx
// Replaces manual page creation

export interface SeoPageShellProps {
  page: SeoPageBase;
  children?: React.ReactNode;  // Custom content (tool embed, etc.)
}

export function SeoPageShell({ page, children }: SeoPageShellProps) {
  return (
    <main className="seo-page">
      {/* Breadcrumb: Home → [Category] → [Page Title] */}
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Page Header */}
      <section className="seo-page-header">
        <h1>{page.h1}</h1>
        <p className="intro">{page.intro}</p>
      </section>
      
      {/* Content Sections */}
      <section className="seo-page-content">
        {page.sections.map((section, i) => (
          <ContentSection key={i} section={section} />
        ))}
      </section>
      
      {/* Embedded Tool (if applicable) */}
      {children && (
        <section className="seo-page-tool">
          {children}
        </section>
      )}
      
      {/* Related Pages/Tools */}
      <section className="seo-page-related">
        <h2>Related Pages</h2>
        <RelatedPagesList pages={page.relatedPages} />
        
        <h2>Related Tools</h2>
        <RelatedToolsList tools={page.relatedTools} />
      </section>
      
      {/* FAQs (if provided) */}
      {page.faqs && page.faqs.length > 0 && (
        <section className="seo-page-faqs">
          <h2>Frequently Asked Questions</h2>
          <FaqAccordion faqs={page.faqs} />
        </section>
      )}
      
      {/* Call to Action */}
      <section className="seo-page-cta">
        <h2>Ready to {page.title}?</h2>
        <ToolCta tool={getToolBySlug(page.toolEngine!)} />
      </section>
    </main>
  );
}
```

### 5.2 Template Structure

**1. Breadcrumb** (Schema + visual)
- Home → Category → Current Page
- Schema: BreadcrumbList

**2. H1 + Intro** (Above fold)
- Clear page purpose
- Keyword relevance
- User intent satisfied immediately

**3. Content Sections** (H2-H4 hierarchy)
- How it works
- Requirements/Specifications
- Tips & best practices
- Common issues & solutions

**4. Tool Embed** (If applicable)
- UniversalWorkspace for tools
- Static content for specs/exams

**5. Related Pages** (Internal linking)
- Related specifications
- Related exams
- Related tools (from tool.related)

**6. FAQs** (Schema + UX)
- Only if genuinely useful
- Schema.org FAQPage

**7. CTA** (Conversion)
- "Try this tool" for specification pages
- "Start your test prep" for exam pages

### 5.3 Implementation Pattern

```typescript
// Example: Passport Photo Size Page (Specification Type)
// pages/passport-photo-size.tsx

import { SeoPageShell } from "@/components/seo-page-shell";
import { getPage } from "@/lib/seo-pages";

const page = getPage("passport-photo-size");
export const metadata: Metadata = generatePageMetadata(page);

export default function PassportPhotoSizePage() {
  return (
    <SeoPageShell page={page}>
      {/* Link to passport-photo-resizer tool if needed */}
      <ToolLinkCard slug="passport-photo-resizer" />
    </SeoPageShell>
  );
}
```

**One component template handles ALL page types.**

---

## SECTION 6: METADATA ARCHITECTURE

### 6.1 Metadata Generation (Extensible)

```typescript
// lib/seo-metadata.ts

export function generatePageMetadata(page: SeoPageBase): Metadata {
  const canonicalUrl = page.canonical;
  
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: canonicalUrl },
    
    openGraph: {
      type: "website",
      title: page.title,
      description: page.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{
        url: "/og.png",  // Shared image (Phase 1 pattern)
        width: 1731,
        height: 909,
        alt: "PixProMax — Images in. Better images out.",
      }],
    },
    
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: ["/og.png"],  // Shared image
    },
  };
}
```

### 6.2 Structured Data Generation (Extensible)

```typescript
// lib/seo-schemas.ts

export function generatePageSchemas(page: SeoPageBase): object[] {
  const schemas = [];
  
  // Always include breadcrumb
  schemas.push(generateBreadcrumbSchema(page));
  
  // Type-specific schemas
  if (page.type === "specification" || page.type === "exam") {
    if (page.faqs?.length) {
      schemas.push(generateFaqSchema(page.faqs));
    }
  }
  
  // Tool-related pages get SoftwareApplication
  if (page.toolEngine) {
    const tool = getTool(page.toolEngine);
    schemas.push(generateSoftwareApplicationSchema(tool));
  }
  
  return schemas;
}

function generateBreadcrumbSchema(page: SeoPageBase) {
  // Home → Category → Page (breadcrumbs based on page type)
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Specifications", item: `${SITE_URL}/specifications` },
      { "@type": "ListItem", position: 3, name: page.h1, item: page.canonical },
    ],
  };
}
```

### 6.3 Prevention of Metadata Override (From Phase 1)

**Rule**: Each page type's metadata generator MUST include:
1. Shared OG image (never omit)
2. Shared Twitter image (never omit)
3. og:site_name (always present)
4. Canonical (self-referential)

**Validation**: Build-time check that all pages meet minimum requirements.

---

## SECTION 7: STRUCTURED DATA ARCHITECTURE

### 7.1 Schema Strategy (Only when justified)

**Always Include**:
- BreadcrumbList (hierarchical navigation)

**Conditionally Include**:
- SoftwareApplication (tool pages, applications)
- FAQPage (specification pages, exam pages with FAQs)
- Article (if content warrants it)

**Never Include**:
- How-To (Phase 1 decision: rejected)
- Review/Rating (fake reviews problematic)
- Event (not applicable)

### 7.2 Exam Page Schemas (Special Case)

```typescript
// For exam pages with requirements
generateBreadcrumbSchema(page),
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: page.faqs?.map(faq => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
}
```

### 7.3 Specification Page Schemas

```typescript
// For photo specification pages
generateBreadcrumbSchema(page),
{
  "@context": "https://schema.org",
  "@type": "Thing",  // Generic structured data
  name: page.title,
  description: page.description,
  // Include specification object details
}
```

---

## SECTION 8: INTERNAL LINK ARCHITECTURE

### 8.1 Link Hierarchy Model

```
Homepage
├── Image Tools Category
│   ├── Compress (tool)
│   ├── Resize (tool)
│   ├── Crop (tool)
│   ├── Convert (tool)
│   │   ├── JPG to PNG (format page)
│   │   ├── PNG to JPG (format page)
│   │   └── ...more format pages
│   ├── Passport Photo Resizer (application)
│   │   └── Passport Photo Size (specification)
│   ├── Visa Photo Resizer (application)
│   │   └── Visa Photo Dimensions (specification)
│   └── ...more specialized tools
│
└── PDF Tools Category
    ├── Merge (tool)
    ├── Split (tool)
    └── ...more PDF tools
    
Information Pages
├── About
├── FAQ
├── Contact
└── Legal (/privacy, /terms, /disclaimer)

Exam Pages (New)
├── SAT Photo Requirements
├── ACT Photo Requirements
└── ...more exams
```

### 8.2 Link Rules

**Footer**: Always link to:
- Key categories
- Legal pages
- FAQ

**Category Pages** (if created): Link to:
- All tools in category
- Representative spec pages

**Tool Pages**: Link to:
- Related tools (via tool.related)
- Spec pages (if exist)
- Application pages (if exist)

**Specification Pages**: Link to:
- Related specifications (photo types)
- Associated tool (e.g., passport-photo-resizer)
- Related exams (if applicable)

**Exam Pages**: Link to:
- Related exams
- Associated tool (photo resizer)
- Spec pages (if different from other countries)

### 8.3 Breadcrumb Rules

**Pattern**: Home → [Category] → [Specific Page]

**Examples**:
- Home → Image Tools → Compress Image
- Home → Specifications → Passport Photo Size
- Home → Exams → SAT Photo Requirements

---

## SECTION 9: SITEMAP INTEGRATION DESIGN

### 9.1 Sitemap Rules (Filtering Logic)

```typescript
// app/sitemap.ts (extended)

export default function sitemap(): MetadataRoute.Sitemap {
  // Existing: tool pages
  const toolUrls = tools
    .filter(tool => tool.status === "active")
    .map(tool => ({
      url: `${SITE_URL}/${tool.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  
  // NEW: SEO pages (if implemented)
  const seoPageUrls = getAllSeoPages()
    .filter(page => page.indexable && page.status === "active")
    .map(page => ({
      url: page.canonical,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }));
  
  // Existing: info pages
  const infoUrls = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.5 },
    // ...more
  ];
  
  return [...toolUrls, ...seoPageUrls, ...infoUrls];
}
```

### 9.2 Exclusion Rules

**DO NOT include in sitemap**:
- Redirects (e.g., `/privacy`)
- Internal pages (e.g., `/workspace`)
- Draft pages (`indexable: false`)
- Beta/Coming-soon pages

**DO include**:
- Active tool pages
- Active SEO pages (specifications, exams)
- Active info pages

### 9.3 Sitemap Index (Future)

When sitemap grows beyond ~50,000 URLs (years away), split into:
- `sitemap-tools.xml`
- `sitemap-specifications.xml`
- `sitemap-exams.xml`
- `sitemap-info.xml`
- `sitemap-index.xml` (points to above)

**Not needed now.** Keep as single sitemap.xml until growth requires it.

---

## SECTION 10: EXAM DATA ARCHITECTURE

### 10.1 Exam-Specific Data Fields

```typescript
export interface ExamSpecifications {
  // Core Requirements
  format: "JPG" | "PNG" | "PDF";  // Required format
  
  // Dimensions
  width: number;                   // pixels
  height: number;                  // pixels
  aspectRatio: string;             // e.g., "4:3"
  
  // Quality
  dpi?: number;                    // dots per inch
  colorMode?: "RGB" | "CMYK" | "Grayscale";
  minimumResolution?: number;      // pixels
  
  // File Size
  fileSize?: {
    min?: number;                  // KB
    max?: number;                  // KB
  };
  
  // Appearance
  background?: "White" | "Blue" | "None";
  expression?: "Neutral" | "Smile" | "Any";
  headPosition?: string;
  
  // Restrictions
  glasses?: boolean;               // Allowed
  contacts?: boolean;              // Allowed
  headCovering?: boolean;          // Allowed (religious)
  
  // Timeline
  validFrom?: string;              // ISO date (when requirements changed)
  validUntil?: string;             // ISO date (when they change again)
  
  // Authority
  sourceUrl: string;               // Official source (required)
  lastVerified: string;            // ISO date (when we verified)
  officialAuthority: string;       // "College Board", "SAT Board", etc.
  confidence: 1 | 2 | 3 | 4 | 5;  // How sure are we? (1=low, 5=official)
}
```

### 10.2 Exam Data Storage

**YAML Structure** (if using files):
```yaml
# data/exams/sat.yaml
name: "SAT"
organization: "College Board"
testType: "Standardized"
authority: 5

specifications:
  format: "JPG"
  width: 600
  height: 750
  dpi: 150
  background: "White"
  expression: "Neutral"
  glasses: false
  fileSize:
    max: 10  # KB
  
sourceUrl: "https://satsuite.collegeboard.org/digital/what-to-bring"
lastVerified: "2026-09-17"
```

### 10.3 What NOT to Invent

**Do NOT create**:
- Fake exam data
- Assumed specifications
- "Best practice" requirements we made up

**DO only**:
- Link to official sources
- Cite recent verifications
- Mark confidence levels honestly

**Rule**: If we can't verify with official source, don't create the page.

---

## SECTION 11: FIRST BATCH — RECOMMENDED 10–20 PAGES

### 11.1 Recommended First 10 Pages (Priority)

#### Batch 1 (Specifications) — High Intent, Existing Tools

1. **Passport Photo Size** (`/passport-photo-size`)
   - Related tool: `passport-photo-resizer`
   - Type: Specification
   - Content: Standard passport photo dimensions, formats, requirements
   - Tool link: Yes
   - Rationale: Existing tool, high search volume

2. **Visa Photo Requirements** (`/visa-photo-requirements`)
   - Related tool: `visa-photo-resizer`
   - Type: Specification
   - Content: Typical visa photo specs (varies by country)
   - Tool link: Yes
   - Country variants: Indian, UK, US, Canadian visas (4 more pages)

3. **ID Photo Dimensions** (`/id-photo-dimensions`)
   - Related tool: `id-photo-resizer`
   - Type: Specification
   - Content: Driver's license, state ID specs
   - Tool link: Yes

4. **Signature Requirements for Forms** (`/signature-requirements-forms`)
   - Related tool: `signature-resizer`
   - Type: Specification
   - Content: Digital signature dimensions, formats
   - Tool link: Yes

#### Batch 2 (Exams) — High-Intent, Growing Market

5. **SAT Photo Requirements** (`/sat-photo-requirements`)
   - Type: Exam
   - Content: College Board specifications
   - Tool link: `passport-photo-resizer` (applicable for many exams)
   - Rationale: High search volume, annual cycle

6. **ACT Photo Specifications** (`/act-photo-specifications`)
   - Type: Exam
   - Content: ACT exam photo requirements
   - Tool link: `passport-photo-resizer`

7. **GRE Photo Requirements** (`/gre-photo-requirements`)
   - Type: Exam
   - Content: Graduate Record Exam photo specs
   - Tool link: `passport-photo-resizer`

#### Batch 3 (Applications) — Leverage Existing Tools

8. **LinkedIn Profile Photo Size** (`/linkedin-profile-photo-size`)
   - Type: Specification (social media variant)
   - Related tool: `resize-image`, `crop-image`
   - Content: LinkedIn's recommended photo dimensions
   - Tool link: Yes

9. **Twitter Header Image Size** (`/twitter-header-image-dimensions`)
   - Type: Specification (social media variant)
   - Related tool: `resize-image`
   - Content: Twitter/X banner dimensions
   - Tool link: Yes

10. **Email Signature Image Optimization** (`/email-signature-image-size`)
    - Type: Specification
    - Related tool: `resize-image`, `compress-image`
    - Content: Email-safe image sizes
    - Tool link: Yes

### 11.2 Recommended Next 10 Pages (Secondary)

11-20 (Second Wave):
- Visa photo variants: Indian, UK, Canadian, Australian (4 pages)
- LinkedIn banner size (1 page)
- Facebook cover photo (1 page)
- Instagram post dimensions (1 page)
- YouTube thumbnail requirements (1 page)
- Zoom background dimensions (1 page)

### 11.3 Prioritization Rationale

✅ **High Priority** (Batch 1-2):
- Existing tool alignment
- High search volume
- Verifiable requirements
- Clear user intent
- Tool directly applicable

❌ **Not Recommended Initially**:
- Too many variants of same spec (paralysis)
- Unverifiable requirements (social media algorithm changes)
- No direct tool alignment
- Very low search volume

---

## SECTION 12: RISKS & DUPLICATION CONCERNS

### 12.1 Duplication Risks

**Risk 1**: Same spec page created multiple times
- **Example**: Both `/passport-photo-size` and `/passport-photo-requirements`
- **Mitigation**: Central registry of page slugs, PR review process

**Risk 2**: Specification page vs. Tool page (same content)
- **Example**: `/compress-image` vs. `/compress-png-online`
- **Mitigation**: One canonical per intent; redirect keyword variations

**Risk 3**: SEO content overtaking tool functionality
- **Example**: 50 pages for one tool variant
- **Mitigation**: Cap pages-per-tool ratio (e.g., max 5 related pages)

**Risk 4**: Outdated exam requirements
- **Example**: SAT photos specs changed but we never updated
- **Mitigation**: Quarterly verification, expiration dates on pages

**Risk 5**: Thin content (keyword stuffing)
- **Example**: `/compress-image-online-free-tool` with 200 words
- **Mitigation**: Minimum 400 words per page, meaningful content requirement

### 12.2 Mitigation Strategies

**Before Publishing Any New Page**:
1. ✅ Check registry (avoid duplicates)
2. ✅ Verify source (link to official requirement)
3. ✅ Minimum 400 words content
4. ✅ At least 2 related internal links
5. ✅ Tool integration (if applicable)
6. ✅ Code review (metadata, canonical, structure)

**Ongoing**:
- Quarterly audit of exam requirements
- Monitor for canonicalization issues
- Track rankings to catch duplication penalties
- Remove pages with <50 organic monthly searches (after 6 months)

---

## SECTION 13: IMPLEMENTATION FILES REQUIRED

### 13.1 New Files (Phase 2A → Phase 2B)

**Data Layer**:
```
data/
  seo-pages/
    specifications/
      passport-photo-size.yaml
      visa-photo-requirements.yaml
      ...
    exams/
      sat-photo-requirements.yaml
      act-photo-specifications.yaml
      ...
```

**Type Definitions**:
```
types/
  seo-page.ts              (new — page data model)
  seo-page-specification.ts (new — extends seo-page)
  seo-page-exam.ts         (new — extends seo-page)
```

**Library Functions**:
```
lib/
  seo-pages.ts             (new — load/filter pages)
  seo-page-metadata.ts     (new — generate metadata)
  seo-page-schemas.ts      (new — generate JSON-LD)
```

**Components**:
```
components/
  seo-page-shell.tsx       (new — reusable template)
  related-pages.tsx        (new — link grid)
  faq-accordion.tsx        (new — FAQ display)
  tool-link-card.tsx       (new — CTA to tool)
```

**Routes**:
```
app/
  [seo-page-slug]/
    page.tsx               (new — dynamic catch-all)
    layout.tsx             (optional)
```

### 13.2 Files to MODIFY (Minimal)

```
app/sitemap.ts             (extend filtering logic)
lib/seo.ts                 (add type exports)
```

### 13.3 Files to NOT TOUCH

```
components/workspace/       (frozen)
types/tool.ts              (frozen)
config/tools.ts            (frozen)
app/[tool-slug]/           (frozen)
app/layout.tsx             (frozen)
lib/                       (mostly frozen, only add new files)
```

---

## SECTION 14: WHAT MUST REMAIN UNTOUCHED

### 14.1 Core Processing (FROZEN)

✅ **Must NOT Modify**:
- `components/workspace/workspace.tsx` (46KB, core engine)
- `components/workspace/workspace-entry.tsx` (tool selector)
- All `app/[tool-slug]/` individual tool pages
- `types/tool.ts` (tool configuration)
- `config/tools.ts` (tool data)
- `app/layout.tsx` (root layout)
- All existing metadata systems

**Why**: These are stable, production-critical paths. Changes risk breaking existing functionality.

### 14.2 What CAN Be Extended

✅ **Can Add**:
- New files in `lib/`
- New files in `types/`
- New components
- New routes (via dynamic catch-all)
- Data files (YAML)
- Metadata generators for new page types

---

## FINAL RECOMMENDATIONS

### Summary of Proposed Architecture

| Component | Strategy | Status |
|-----------|----------|--------|
| **Page Types** | 5 types (tool, format, application, specification, exam) | Design ✅ |
| **Data Model** | Typed interfaces + YAML storage | Design ✅ |
| **URL Convention** | Semantic slugs, no keyword stuffing | Design ✅ |
| **Template** | Reusable SeoPageShell component | Design ✅ |
| **Metadata** | Generalized generators (Phase 1 pattern) | Design ✅ |
| **Schemas** | BreadcrumbList + conditional extensions | Design ✅ |
| **Internal Links** | Hierarchical model (Home → Category → Page) | Design ✅ |
| **Sitemap** | Dynamic filtering on page status | Design ✅ |
| **Exam Data** | Typed specs + source verification | Design ✅ |
| **First Batch** | 10 recommended pages (specifications + exams) | Recommended ✅ |
| **Risk Mitigation** | Registry + QA checklist | Process ✅ |

### Next Steps (Phase 2B — Implementation)

1. Create type definitions (`types/seo-page.ts` and extensions)
2. Create data layer (`data/seo-pages/` and loaders)
3. Create SeoPageShell component
4. Create metadata/schema generators
5. Implement dynamic catch-all route
6. Implement 10 pages from first batch
7. Test: metadata, schemas, internal links, sitemap
8. Deploy and monitor

---

**Architecture Design Complete**  
**Status**: Ready for Phase 2B Implementation Review  
**No Code Changes Made**  
**Date**: 2026-09-17
