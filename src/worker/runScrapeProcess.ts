import { CrawlerStages } from '../actions';

interface ScrapeParams {
  appUrl: string;
  tabId?: number | null;
}

export async function runScrapeProcess({ appUrl, tabId }: ScrapeParams) {
  if (tabId) {
    const tab = await chrome.tabs.get(tabId);

    if (tab) {
      return navigateAndScrape(tabId, appUrl);
    }
  }

  // If no tabId is provided, create a new tab
  chrome.tabs.create({ url: appUrl }, async (tab) => {
    if (tab?.id) {
      await navigateAndScrape(tab.id, appUrl);
    }
  });
}

// Reusable function to handle navigation and scraping
async function navigateAndScrape(tabId: number, appUrl: string) {
  // Update the tab to navigate to the new URL
  await chrome.tabs.update(tabId, { url: appUrl });

  // Add listener to wait for the page to fully load
  chrome.tabs.onUpdated.addListener(function listener(
    updatedTabId,
    changeInfo
  ) {
    if (updatedTabId === tabId && changeInfo.status === 'complete') {
      // Remove this listener after it fires once
      chrome.tabs.onUpdated.removeListener(listener);

      // Inject the content script to scrape data after the page loads
      chrome.scripting.executeScript({
        target: { tabId },
        func: (...args: any[]) => {
          // @ts-ignore
          window.ShopifyKeyWordsCrawlerExtension.scrapeKeywords(...args);
        },
        args: [
          {
            type: CrawlerStages.SaveOrUpdateKeyWordAnalysis,
            appUrl,
            tabId,
          },
        ],
      });
    }
  });
}
