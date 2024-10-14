import { CrawlerStages } from '../../../../actions';
import { showBrowserOverlay } from '../browser/overlays';
import { ScrapedKeyWordsResult } from '../../../../actions/types';

export function scrapeKeywords({
  type,
  appUrl,
  tabId,
}: {
  appUrl: string;
  tabId: number;
  type: CrawlerStages;
}) {
  showBrowserOverlay();

  function extractKeywords() {
    return Array.from(
      document.querySelectorAll(
        '#adp-details-section .tw-grid p + .tw-col-span-full *:not(button)'
      )
    )
      .map((el) => el?.textContent?.split(','))
      .flat()
      .filter((value) => Boolean(value))
      .map((value) => value!.trim());
  }

  const data: ScrapedKeyWordsResult = {
    appUrl,
    keywords: extractKeywords(),
    tabId,
  };

  // Send the scraped data back to the background process
  chrome.runtime.sendMessage({ type, data: data }).then();

  // hideOverlayClose();
}
