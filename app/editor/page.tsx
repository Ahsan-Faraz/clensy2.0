import EditorClient from './editor-client';

// This is a SERVER component - it can securely read env vars without NEXT_PUBLIC_ prefix
export default function EditorPage() {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const pageBuilderApiKey = process.env.STRAPI_PAGE_BUILDER_API_KEY || '';
  const strapiClientToken = process.env.NEXT_STRAPI_CLIENT_TOKEN || '';

  return (
    <EditorClient
      strapiUrl={strapiUrl}
      pageBuilderApiKey={pageBuilderApiKey}
      strapiClientToken={strapiClientToken}
    />
  );
}
