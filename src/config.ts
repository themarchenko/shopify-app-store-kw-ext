export function getShopifySearchPage(query: string): string {
  return `https://apps.shopify.com/search?q=${encodeURIComponent(query)}`;
}
