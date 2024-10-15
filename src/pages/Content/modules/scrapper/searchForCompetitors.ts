import { CrawlerStages } from '../../../../actions';
import { SearchForCompetitorsResult } from '../../../../actions/types';
import { showBrowserOverlay } from '../browser/overlays';

export async function searchForCompetitors({ type }: { type: CrawlerStages }) {
  showBrowserOverlay();

  setTimeout(() => {
    const allLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        '.search-results-component [data-controller="app-card"] a'
      )
    )
      .map((a) => a.href)
      .filter((link) => link && link.startsWith('https://apps.shopify.com/'))
      .map((link) => {
        const url = new URL(link);

        // get a clean link
        return url.origin + url.pathname;
      });

    // get only unique links
    const links = Array.from(new Set(allLinks));
    // Send the scraped data back to the background process
    chrome.runtime
      .sendMessage({ type, data: { links } as SearchForCompetitorsResult })
      .then();

    window.close();
  }, 5_000);
}
