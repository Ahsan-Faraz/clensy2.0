# Page Builder Editor - Implementation Summary

## What Was Implemented

This document explains the complete frontend Page Builder editor implementation for your Strapi CMS.

## Files Created

### 1. `/app/editor/page.tsx`
The main editor page component that:
- Loads the Page Builder editor interface
- Fetches templates and page data from Strapi
- Handles URL parameters (template ID, page ID, content type)
- Provides loading and error states
- Integrates with the `@wecre8websites/strapi-page-builder-react` package

**Key Features:**
- Client-side only rendering (no SSR) to avoid hydration issues
- Suspense boundary for Next.js App Router compatibility
- Automatic template detection from Landing Page relation
- Error handling and user feedback

### 2. `/app/api/page-builder/save/route.ts`
Server-side API route that:
- Receives page builder data from the editor
- Updates the template's content in Strapi
- Maintains the relation between content entries and templates
- Handles both single types (landing-page) and collection types

### 3. `/lib/page-builder-api.ts`
Utility functions for:
- Fetching templates from Strapi
- Fetching landing pages with template relations
- Saving page builder data
- Getting Page Builder configuration

### 4. Documentation Files
- `PAGE_BUILDER_SETUP.md` - Complete setup and usage guide
- `PAGE_BUILDER_IMPLEMENTATION.md` - This file

## How It Works

### Editor Lifecycle

1. **Initialization**
   - User navigates to `/editor` (or Strapi redirects there)
   - Component reads URL parameters
   - Determines which template to load

2. **Data Loading**
   - If `template` parameter exists: Fetches that template directly
   - If `type=landing-page`: Fetches landing page and extracts attached template
   - Template data includes the page builder JSON structure

3. **Editor Display**
   - Page Builder Editor component renders with:
     - Component configuration (config)
     - API key for Page Builder service
     - Strapi API settings (URL, auth token, image URL)
     - Fetch function to load template content
   - User can visually edit the page layout

4. **Saving**
   - Page Builder plugin handles saving through its own API
   - Our `/api/page-builder/save` route can be used for custom save logic
   - Changes are persisted to the template's `content` field in Strapi

### Data Flow

```
┌─────────────┐
│ Strapi CMS │
│  (Backend) │
└──────┬──────┘
       │
       │ 1. Fetch Template
       │    GET /api/page-builder/templates/:id
       │
       ▼
┌─────────────────────┐
│  Editor Page        │
│  (/app/editor)      │
│                     │
│  - Loads template   │
│  - Renders editor   │
│  - Handles edits    │
└──────┬──────────────┘
       │
       │ 2. User Edits
       │
       ▼
┌─────────────────────┐
│  Page Builder       │
│  Editor Component   │
│  (React Package)    │
└──────┬──────────────┘
       │
       │ 3. Save Changes
       │    PUT /api/page-builder/templates/:id
       │
       ▼
┌─────────────┐
│ Strapi CMS │
│  (Backend) │
└────────────┘
```

## Component API

### PageEditor Component Props

```typescript
{
  config: Config;                    // Component configuration object
  apiKey: string;                    // Page Builder API key
  strapi: {
    url: string;                     // Strapi base URL
    authToken?: string;              // Strapi API token
    imageUrl: string;                // Base URL for images
    locale?: string;                 // Locale (default: 'en')
  };
  fetch?: (contentId: string) => Promise<any>;  // Custom fetch function
  contentKey?: string;               // Content identifier
  additionalContent?: object;        // Additional content data
}
```

## Environment Variables Required

Add these to your `.env.local`:

```env
# Strapi Configuration
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token_here

# Page Builder API Key (from pagebuilder.wc8.io)
STRAPI_PAGE_BUILDER_API_KEY=your_page_builder_api_key_here
```

## Usage Examples

### Accessing the Editor

1. **From Strapi Admin** (Automatic)
   - Click "Edit" on a page with a template attached
   - Strapi redirects to `/editor` with correct parameters

2. **Direct URL Access**
   ```bash
   # Landing Page (auto-detects template)
   http://localhost:3000/editor?type=landing-page
   
   # Specific Template
   http://localhost:3000/editor?template=1
   
   # With Page ID
   http://localhost:3000/editor?template=1&page=1&type=page
   ```

## Integration Points

### Strapi Backend
- Page Builder plugin installed and configured
- Template content type created
- Landing Page has `Landing_Page` relation field
- Template "Landing Page Layout" created and attached
- Frontend editor URL configured: `http://localhost:3000/editor`

### Next.js Frontend
- Page Builder React package installed
- Editor route created at `/app/editor/page.tsx`
- API route for saving at `/app/api/page-builder/save/route.ts`
- Environment variables configured
- CORS headers configured in `next.config.mjs`

## Customization

### Adding Custom Components

You can extend the Page Builder with custom components by modifying the `config` object:

```typescript
const editorConfig = {
  components: {
    // Add your custom components here
    CustomHero: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'text' },
      },
      render: ({ title, subtitle }) => (
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      ),
    },
  },
};
```

### Custom Save Handler

The Page Builder plugin handles saving automatically, but you can add custom logic:

```typescript
// In the editor component
const handleSave = async (pageData: any) => {
  // Custom save logic
  await fetch('/api/page-builder/save', {
    method: 'POST',
    body: JSON.stringify({ pageData }),
  });
};
```

## Troubleshooting

### Common Issues

1. **"Page Not Found"**
   - Ensure `/app/editor/page.tsx` exists
   - Check Next.js dev server is running
   - Verify route is accessible

2. **"No Template Found"**
   - Ensure template is attached to landing page
   - Check template is published in Strapi
   - Verify API token has read permissions

3. **Editor Not Loading**
   - Check browser console for errors
   - Verify environment variables are set
   - Ensure package is installed: `npm list @wecre8websites/strapi-page-builder-react`

4. **CORS Errors**
   - Check Strapi `config/middlewares.ts`
   - Ensure `http://localhost:3000` is allowed
   - Verify `NEXT_PUBLIC_STRAPI_URL` matches Strapi instance

## Next Steps

1. **Test the Editor**
   - Start Next.js dev server: `npm run dev`
   - Navigate to `http://localhost:3000/editor?type=landing-page`
   - Verify template loads correctly

2. **Customize Components**
   - Add your own Page Builder components
   - Customize the editor UI
   - Add preview functionality

3. **Production Deployment**
   - Update environment variables for production
   - Configure CORS for production domain
   - Test save functionality end-to-end

## Support Resources

- Page Builder Plugin: https://pagebuilder.wc8.io/docs
- Strapi Documentation: https://docs.strapi.io
- Next.js Documentation: https://nextjs.org/docs
