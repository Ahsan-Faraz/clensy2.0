# Page Builder System Architecture & Flow

## 📁 File Structure

```
Clensy-3admin/
├── app/
│   ├── editor/
│   │   └── page.tsx                    # Main Page Builder Editor UI
│   ├── api/
│   │   └── page-builder/
│   │       ├── content/
│   │       │   └── [type]/
│   │       │       └── route.ts        # Fetch Strapi content with template relations
│   │       ├── sync/
│   │       │   └── route.ts            # Sync Page Builder changes back to Strapi
│   │       └── templates/
│   │           ├── route.ts            # List all templates
│   │           └── [id]/
│   │               └── route.ts        # Get specific template by ID
│   ├── [page-routes]/
│   │   └── page.tsx                    # Live site pages (uses <Render />)
│   └── components/
│       └── dynamic-*-page.tsx          # Page components that use Page Builder
│
├── lib/
│   └── page-builder-components.tsx      # Component definitions & config
│
└── strapi/                              # Strapi Backend
    └── src/
        └── api/
            └── [content-type]/
                └── content-types/
                    └── [content-type]/
                        └── schema.json  # Strapi schema with template relation
```

---

## 🔄 Complete Data Flow

### **1. Opening Page Builder (Editor)**

```
User clicks "Open in Page Builder" in Strapi Admin
    ↓
Strapi redirects to: http://localhost:3000/editor?_contentType=api::service.service&_templateId=abc123&_contentId=xyz789
    ↓
app/editor/page.tsx loads
    ↓
Parses URL params:
  - _contentType → "service"
  - _templateId → "abc123" (documentId)
  - _contentId → "xyz789" (for collection types)
    ↓
Fetches content from: /api/page-builder/content/service?contentId=xyz789
    ↓
API route fetches from Strapi: GET /api/services/xyz789?populate=*
    ↓
Extracts template relation: content.Service_Page
    ↓
Fetches template: GET /api/page-builder/templates/abc123
    ↓
Template contains: { json: { content: [...] } }
    ↓
Passes to PageEditor component:
  - config: pageBuilderConfig (component definitions)
  - data: { templateJson, content }
  - apiKey: PAGE_BUILDER_API_KEY
  - strapi: { url, authToken, imageUrl }
    ↓
PageEditor renders visual editor with drag-and-drop interface
```

### **2. Editing in Page Builder**

```
User drags component from sidebar → Canvas
    ↓
Component added to template.json.content array
    ↓
User edits component props in right sidebar
    ↓
Props updated in template.json.content[].props
    ↓
User clicks "Save" button in Page Builder
    ↓
Page Builder plugin saves template.json to Strapi:
  PUT /page-builder/editor/templates/abc123
    Body: { json: { content: [...] } }
    ↓
Template saved in Strapi (affects all entries using this template)
```

### **3. Syncing Content to Strapi**

```
User clicks "Sync to Site" button
    ↓
app/editor/page.tsx → handleSyncToSite()
    ↓
POST /api/page-builder/sync
  Body: {
    contentType: "service",
    templateId: "abc123",
    contentId: "xyz789"
  }
    ↓
app/api/page-builder/sync/route.ts:
  1. Fetches current content from Strapi
  2. Fetches template from Strapi
  3. Extracts component props from template.json.content[]
  4. Maps Page Builder field names → Strapi field names
  5. Filters out invalid fields
  6. Removes 'id' fields from components
  7. Deep merges with existing content
  8. PUT /api/services/xyz789 with updated data
    ↓
Strapi updates service entry
    ↓
Response: { success: true, fieldsUpdated: 5 }
    ↓
Frontend shows success toast
```

### **4. Rendering on Live Site**

```
User visits: /services/airbnb-cleaning
    ↓
app/services/[slug]/page.tsx loads
    ↓
Fetches service data: GET /api/cms/services/airbnb-cleaning
    ↓
Also fetches Page Builder template: GET /api/page-builder/content/service?slug=airbnb-cleaning
    ↓
If template exists:
  - Extracts template.json from Service_Page relation
  - Merges service content with template
  - Renders using <Render /> component
    ↓
<Render /> component:
  - Reads template.json.content[] array
  - For each component in array:
    - Looks up component config in pageBuilderConfig
    - Calls component.render() with props
    - Props can use Handlebars syntax: {{heroHeading}}
    - Handlebars replaced with actual content values
    ↓
Components render in order defined by template.json.content[]
    ↓
User sees page with Page Builder layout
```

---

## 🗂️ Key Files Explained

### **1. `app/editor/page.tsx`** - Page Builder Editor
**Purpose**: Visual drag-and-drop editor interface

**Key Functions**:
- `parseContentType()` - Converts Strapi format to our format
- `loadInitialData()` - Fetches content + template from Strapi
- `handleSyncToSite()` - Syncs changes back to Strapi content
- `fetchContent()` - Provides content to Page Builder for Handlebars

**Props to PageEditor**:
```typescript
<PageEditor
  config={pageBuilderConfig}        // Component definitions
  apiKey={PAGE_BUILDER_API_KEY}     // Authentication
  strapi={{ url, authToken }}       // Strapi connection
  data={{ templateJson, content }}   // Initial template + content
  fetch={fetchContent}               // Function to get content for Handlebars
  contentKey={templateId}            // Template documentId
/>
```

---

### **2. `lib/page-builder-components.tsx`** - Component Library
**Purpose**: Defines all available Page Builder components

**Structure**:
```typescript
export const pageBuilderConfig: Config<PageBuilderBlocks, {}, Categories> = {
  components: {
    Hero: {
      fields: {                    // Editable fields (shown in sidebar)
        heroHeading: { type: "text" },
        heroSubheading: { type: "textarea" },
      },
      defaultProps: {              // Default values when component added
        heroHeading: "Default heading",
      },
      render: (data) => {         // How component renders
        return <section>...</section>;
      },
    },
    // ... more components
  },
  categories: {                    // Sidebar categories
    hero: { title: "Hero Sections", components: ["Hero"] },
  },
};
```

**Component Types**:
- `Hero`, `HowItWorks`, `CTA` - Landing page
- `AboutHero`, `AboutOurStory` - About page
- `ServiceHero`, `ServiceFeatures` - Service pages

> **Note**: Location pages do NOT use Page Builder. They are managed via Strapi Content Manager only.

---

### **3. `app/api/page-builder/content/[type]/route.ts`** - Content Fetcher
**Purpose**: Fetches raw Strapi content with template relations populated

**Flow**:
```
GET /api/page-builder/content/service?slug=airbnb-cleaning
    ↓
1. Maps "service" → endpoint: "/api/services"
2. Fetches: GET /api/services?filters[slug][$eq]=airbnb-cleaning&populate=*
3. Extracts Service_Page relation (template)
4. Deep populates template.json
5. Returns: { success: true, data: {...service data...} }
```

**Returns**:
```json
{
  "success": true,
  "data": {
    "name": "Airbnb Cleaning",
    "heroTitle": "...",
    "Service_Page": {
      "id": 1,
      "documentId": "abc123",
      "json": {
        "content": [
          { "type": "ServiceHero", "props": {...} },
          { "type": "ServiceFeatures", "props": {...} }
        ]
      }
    }
  }
}
```

---

### **4. `app/api/page-builder/sync/route.ts`** - Sync Handler
**Purpose**: Syncs Page Builder template changes to Strapi content fields

**Flow**:
```
POST /api/page-builder/sync
Body: { contentType: "service", templateId: "abc123", contentId: "xyz789" }
    ↓
1. Fetches current content: GET /api/services/xyz789
2. Fetches template: GET /api/page-builder/templates/abc123
3. Extracts template.json.content[] array
4. For each component:
   - Extracts props (heroTitle, etc.)
   - Maps field names as configured
   - Filters invalid fields
5. Removes 'id' from component arrays
6. Deep merges with existing content
7. PUT /api/services/xyz789
   Body: { data: { heroTitle: "..." } }
```

**Field Mapping**:
```typescript
fieldMapping: {
  'heroTitle': 'heroTitle',            // Page Builder → Strapi
  'heroSubtitle': 'heroSubtitle',
}
```

---

### **5. `app/services/[slug]/page.tsx`** - Live Site Page
**Purpose**: Renders service page using Page Builder template

**Flow**:
```
User visits /services/airbnb-cleaning
    ↓
1. Fetches service data from CMS
2. Fetches Page Builder template
3. If template exists:
   - Merges content with template
   - Renders using <Render /> component
4. <Render /> reads template.json.content[]
5. Renders each component in order
6. Handlebars syntax replaced with actual values
```

**Render Component**:
```typescript
<Render
  config={pageBuilderConfig}
  data={{
    templateJson: template.json,    // Template structure
    content: serviceData             // Actual content values
  }}
  strapi={{ url, imageUrl }}
/>
```

---

## 🔑 Key Concepts

### **Template vs Content**

**Template** (`template.json`):
- Stored in Strapi `Template` content type
- Contains **layout** (component order) and **default content**
- Structure: `{ content: [{ type: "Hero", props: {...} }] }`
- Shared across entries if same template used

**Content** (Strapi content type):
- Stored in `Service`, etc. content types
- Contains **actual content values** (heroTitle, etc.)
- Synced FROM template props TO content fields

### **Single Types vs Collection Types**

**Single Types** (landing-page, about, contact):
- Only ONE entry exists
- Template relation: `Landing_Page`, `About_Page`
- URL: `/api/landing-page` (no ID needed)
- Example: `GET /api/page-builder/content/landing-page`

**Collection Types** (service):
- MULTIPLE entries exist
- Template relation: `Service_Page`
- URL: `/api/services/{id}` or `/api/services?slug=xxx`
- Example: `GET /api/page-builder/content/service?contentId=xyz789`
- **Each entry should have its own template** for content isolation

> **Note**: Location pages are NOT managed via Page Builder. They use Strapi Content Manager directly.

### **Component Props Flow**

```
1. Component defined in page-builder-components.tsx
   fields: { heroHeading: { type: "text" } }
    ↓
2. User adds component to canvas
   template.json.content.push({ type: "Hero", props: { heroHeading: "Default" } })
    ↓
3. User edits in sidebar
   props.heroHeading = "New Heading"
    ↓
4. Template saved to Strapi
   PUT /page-builder/editor/templates/abc123
    ↓
5. Sync extracts props
   contentUpdates.heroHeading = "New Heading"
    ↓
6. Maps to Strapi field
   service.heroTitle = "New Heading"
    ↓
7. Live site renders
   <Render /> reads template.json.content[]
   Replaces {{heroHeading}} with location.heroTitle
```

---

## 🎯 Template Sharing Issue

### **Problem**:
All locations share the same template instance → Content changes affect all locations

### **Why**:
- Template stores content in `template.json.content[].props`
- If multiple entries use same template, they share the same props
- Editing content in Page Builder edits the template, not the entry

### **Solution**:
**Each location entry needs its own template**:
1. Create separate template for each location
2. Assign template to location entry's `Location_Page` field
3. Now each location has isolated content

### **Alternative** (if you want shared layout):
- Keep shared template for layout
- Only edit content fields directly in Strapi (not via Page Builder)
- Use Page Builder only for layout changes

---

## 📊 Data Structure Examples

### **Template JSON Structure**:
```json
{
  "root": { "props": {} },
  "zones": {},
  "content": [
    {
      "type": "LocationHero",
      "props": {
        "id": "LocationHero-123",
        "heroTitle": "{{heroTitle}}",
        "heroSubtitle": "{{heroSubtitle}}",
        "ctaButton1Text": "Get a Quote"
      }
    },
    {
      "type": "LocationMainContent",
      "props": {
        "id": "LocationMainContent-456",
        "phoneNumber": "{{contactPhone}}",
        "emailAddress": "{{contactEmail}}",
        "aboutTitle": "{{aboutTitle}}"
      }
    }
  ]
}
```

### **Strapi Location Entry**:
```json
{
  "id": 1,
  "documentId": "xyz789",
  "name": "Morris County",
  "heroTitle": "Professional Cleaning Services",
  "contactPhone": "(551) 305-4627",
  "contactEmail": "info@clensy.com",
  "Location_Page": {
    "id": 1,
    "documentId": "abc123",
    "json": { /* template.json above */ }
  }
}
```

### **Merged Content for Render**:
```json
{
  "heroTitle": "Professional Cleaning Services",  // From Strapi
  "contactPhone": "(551) 305-4627",              // From Strapi
  "templateJson": {                               // From Template
    "content": [
      {
        "type": "LocationHero",
        "props": {
          "heroTitle": "{{heroTitle}}"  // Replaced with actual value
        }
      }
    ]
  }
}
```

---

## 🔧 Environment Variables

```env
# Strapi Connection
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_full_access_token

# Page Builder
STRAPI_PAGE_BUILDER_API_KEY=your_api_key
NEXT_PUBLIC_STRAPI_CLIENT_TOKEN=your_client_token
```

---

## 🚀 Summary

1. **Editor** (`app/editor/page.tsx`) - Visual drag-and-drop interface
2. **Components** (`lib/page-builder-components.tsx`) - Component definitions
3. **Content API** (`app/api/page-builder/content/[type]`) - Fetches Strapi data
4. **Sync API** (`app/api/page-builder/sync`) - Syncs changes back to Strapi
5. **Live Pages** (`app/[page]/page.tsx`) - Renders using `<Render />` component

**Key Flow**:
```
Strapi → Editor → Template → Sync → Strapi → Live Site
```

**Important**: Each collection type entry (service, location) should have its own template for content isolation!
