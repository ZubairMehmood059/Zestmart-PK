// Dynamic SEO, Title, Meta Description & OpenGraph Management Service

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  type?: 'website' | 'product';
}

const DEFAULT_TITLE = "ZestMart PK — Pakistan's Ultimate Electronics Marketplace";
const DEFAULT_DESCRIPTION = "Pakistan's premier multi-vendor electronics marketplace. Official PTA approved flagships, laptops, PC gaming rigs, and computing hardware with nationwide COD.";
const DEFAULT_IMAGE = '/og-image.svg';

export const SEOService = {
  update({
    title,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_IMAGE,
    canonicalUrl = 'https://zestmart.pk/',
    type = 'website'
  }: SEOProps): void {
    if (typeof document === 'undefined') return;

    // 1. Page Title
    const formattedTitle = title ? `${title} | ZestMart PK` : DEFAULT_TITLE;
    document.title = formattedTitle;

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. OpenGraph Title & Description & Image
    this.setMetaProperty('og:title', formattedTitle);
    this.setMetaProperty('og:description', description);
    this.setMetaProperty('og:image', image);
    this.setMetaProperty('og:url', window.location.href);
    this.setMetaProperty('og:type', type);

    // 4. Twitter Cards
    this.setMetaName('twitter:title', formattedTitle);
    this.setMetaName('twitter:description', description);
    this.setMetaName('twitter:image', image);

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  },

  setMetaProperty(property: string, content: string): void {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  },

  setMetaName(name: string, content: string): void {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  }
};
