# Page Builder Editor Setup Guide

This guide explains how the Page Builder editor integration works and how to use it.

## Overview

The Page Builder editor allows you to visually edit page layouts created in Strapi. The editor is accessible at `http://localhost:3000/editor` and connects to your Strapi backend to fetch templates and save changes.

## Architecture

### Components

1. **Frontend Editor Route** (`/app/editor/page.tsx`)
   - Client-side React component that loads the Page Builder editor
   - Handles fetching templates and page data from Strapi
   - Manages the editor lifecycle (load, edit, save)

2. **API Utilities** (`/lib/page-builder-api.ts`)
   - Helper functions for communicating with Strapi Page Builder API
   - Functions to fetch templates, pages, and save data

3. **Save API Route** (`/app/api/page-builder/save/route.ts`)
   - Server-side API endpoint that handles saving page builder data
   - Updates both the template and the content relation in Strapi

### Data Flow

```
Strapi Admin → Creates Template → Attaches to Landing Page
     ↓
Frontend Editor → Fetches Template → Loads in Page Builder
     ↓
User Edits Layout → Saves Changes → API Route → Updates Strapi
```

## Environment Variables

Add these to your `.env.local` file:

```env
# Strapi Configuration
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token_here

# Page Builder API Key (get from pagebuilder.wc8.io)
STRAPI_PAGE_BUILDER_API_KEY=your_page_builder_api_key_here
```

### Getting Your API Key

1. Sign up for a free account at https://pagebuilder.wc8.io
2. Generate an API key from your dashboard
3. Add it to your `.env.local` file

### Getting Your Strapi API Token

1. Go to Strapi Admin → Settings → API Tokens
2. Create a new API token with "Full access" permissions
3. Copy the token and add it to your `.env.local` file

## Usage

### Opening the Editor

The editor can be accessed in several ways:

1. **From Strapi Admin** (Recommended)
   - When you click "Edit" on a page with a template attached
   - Strapi will automatically redirect to `/editor` with the correct parameters

2. **Direct URL Access**
   - For Landing Page: `http://localhost:3000/editor?type=landing-page`
   - With Template ID: `http://localhost:3000/editor?template=1`
   - With Page ID: `http://localhost:3000/editor?template=1&page=1&type=page`

### URL Parameters

- `template` (optional): Template ID to load directly
- `page` (optional): Content entry ID
- `type` (optional): Content type (default: `landing-page`)

### Editor Workflow

1. **Load**: Editor fetches the template and page data from Strapi
2. **Edit**: User makes visual changes using the Page Builder interface
3. **Save**: Changes are saved back to Strapi via the API route
4. **Publish**: Changes are saved to the template and content relation is maintained

## How It Works

### 1. Template Fetching

When the editor loads:
- If `template` parameter is provided, it fetches that template directly
- If `type=landing-page`, it fetches the landing page and extracts the attached template
- The template's `content` field contains the page builder data

### 2. Saving Changes

When you save in the editor:
1. The `handleSave` function is called with the page builder data
2. Data is sent to `/api/page-builder/save`
3. The API route:
   - Updates the template's `content` field with the new data
   - Updates the content entry's relation to the template
   - Returns success/error response

### 3. Authentication

- The editor uses `STRAPI_API_TOKEN` for authenticating with Strapi
- The `PAGE_BUILDER_API_KEY` is used by the Page Builder plugin for its own authentication
- Both are required for the editor to work properly

## Troubleshooting

### "Page Not Found" Error

- Ensure the `/editor` route exists (it should be at `/app/editor/page.tsx`)
- Check that your Next.js dev server is running on port 3000
- Verify the route is accessible: `http://localhost:3000/editor`

### "No Template Found" Error

- Ensure a template is attached to your landing page in Strapi
- Check that the template is published
- Verify the API token has read permissions
- Try accessing with explicit template ID: `/editor?template=1`

### "Failed to Save" Error

- Check that `STRAPI_API_TOKEN` is set correctly
- Verify the API token has write permissions in Strapi
- Check browser console for detailed error messages
- Ensure the template ID is valid

### Editor Not Loading

- Check browser console for errors
- Verify all environment variables are set
- Ensure `@wecre8websites/strapi-page-builder-react` is installed
- Try clearing browser cache and reloading

### CORS Issues

- Ensure Strapi CORS is configured to allow `http://localhost:3000`
- Check Strapi `config/middlewares.ts` for CORS settings
- Verify the `NEXT_PUBLIC_STRAPI_URL` matches your Strapi instance

## API Endpoints

### Page Builder Plugin Endpoints (Strapi)

- `GET /api/page-builder/templates` - List all templates
- `GET /api/page-builder/templates/:id` - Get specific template
- `PUT /api/page-builder/templates/:id` - Update template

### Custom API Routes (Next.js)

- `POST /api/page-builder/save` - Save page builder data

## Next Steps

1. **Customize Components**: Add your own custom components to the Page Builder
2. **Styling**: Customize the editor UI to match your brand
3. **Preview**: Implement a preview mode to see changes before publishing
4. **Versioning**: Consider adding version history for templates

## Support

For issues with:
- **Page Builder Plugin**: Check https://pagebuilder.wc8.io/docs
- **Strapi**: Check https://docs.strapi.io
- **Next.js**: Check https://nextjs.org/docs
