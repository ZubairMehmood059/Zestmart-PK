import { Product } from '../types';

/**
 * Universal search matcher for ZestMart PK electronics marketplace.
 * Matches:
 * - Product title
 * - Brand
 * - Category / Subcategory
 * - Model (from title, slug, or specifications)
 * - SKU (supports ZPK-{ID}, raw ID, and custom SKU)
 * - Vendor / Merchant name
 * - Tags and technical specifications
 *
 * Supports case-insensitivity, partial matching, normal whitespace/hyphen differences,
 * and multi-token queries.
 */
export function matchProductSearch(product: Product, rawQuery: string): boolean {
  if (!rawQuery || !rawQuery.trim()) return true;

  const q = rawQuery.toLowerCase().trim();
  const normalizedQ = q.replace(/[\s\-_]+/g, '');

  const rawId = product.id.toLowerCase();
  const sku = (product as any).sku ? String((product as any).sku).toLowerCase() : `zpk-${rawId}`;
  const title = product.title.toLowerCase();
  const brand = product.brand.toLowerCase();
  const category = product.category.toLowerCase().replace(/-/g, ' ');
  const subcategory = (product.subcategory || '').toLowerCase();
  const vendor = (product.vendor?.name || '').toLowerCase();
  const slug = (product.slug || '').toLowerCase();
  const tags = (product.tags || []).map((t) => t.toLowerCase());

  // Extract model hints
  const modelSpec = (
    product.specifications?.['Model'] ||
    product.specifications?.['Model Number'] ||
    product.specifications?.['Processor'] ||
    ''
  ).toLowerCase();

  // 1. Direct exact or substring matches
  if (
    title.includes(q) ||
    brand.includes(q) ||
    category.includes(q) ||
    subcategory.includes(q) ||
    vendor.includes(q) ||
    slug.includes(q) ||
    sku.includes(q) ||
    rawId.includes(q) ||
    modelSpec.includes(q) ||
    tags.some((t) => t.includes(q))
  ) {
    return true;
  }

  // 2. Normalized whitespace & hyphen matching (e.g. "iphone 16" matches "iphone16", "wi-fi" matches "wifi")
  const normTitle = title.replace(/[\s\-_]+/g, '');
  const normBrand = brand.replace(/[\s\-_]+/g, '');
  const normModel = modelSpec.replace(/[\s\-_]+/g, '');
  const normSku = sku.replace(/[\s\-_]+/g, '');
  const normCategory = category.replace(/[\s\-_]+/g, '');

  if (
    normTitle.includes(normalizedQ) ||
    normBrand.includes(normalizedQ) ||
    normModel.includes(normalizedQ) ||
    normSku.includes(normalizedQ) ||
    normCategory.includes(normalizedQ)
  ) {
    return true;
  }

  // 3. Multi-word token matching: every query word must appear in the combined product text
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    const combined = `${title} ${brand} ${category} ${subcategory} ${vendor} ${slug} ${sku} ${rawId} ${modelSpec} ${tags.join(' ')}`;
    const allTokensMatch = tokens.every((tok) => combined.includes(tok));
    if (allTokensMatch) return true;
  }

  // 4. Specification values matching (e.g., "RTX 4090", "144Hz", "OLED", "24GB")
  if (product.specifications) {
    for (const [key, val] of Object.entries(product.specifications)) {
      const lowerVal = val.toLowerCase();
      const lowerKey = key.toLowerCase();
      if (lowerVal.includes(q) || lowerKey.includes(q)) {
        return true;
      }
      if (lowerVal.replace(/[\s\-_]+/g, '').includes(normalizedQ)) {
        return true;
      }
    }
  }

  return false;
}
