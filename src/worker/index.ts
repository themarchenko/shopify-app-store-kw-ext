import { CrawlerStages } from '../actions';
import { runScrapeProcess } from './runScrapeProcess';
import { searchForCompetitors } from './searchForCompetitors';
import {
  ScrapedKeyWordsResult,
  SearchForCompetitorsResult,
  StartKeyWordsAnalysis,
} from '../actions/types';
import { createAnalysis, updateAnalysis } from '../lib/client/keywords';

function getInitialState() {
  return {
    analyzeId: '',
    appUrl: '',
    searchTerm: '',
    isProcessing: false,
    tabId: null as number | null,
  };
}

const inMemoryStore = {
  state: getInitialState(),
};

function cleanState() {
  inMemoryStore.state = getInitialState();
}

export async function processWorker(
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) {
  if (message.type === CrawlerStages.AskStatus) {
    await chrome.runtime.sendMessage({
      type: CrawlerStages.Status,
      data: { state: inMemoryStore.state },
    });

    return;
  }

  // run scrapper
  if (message.type === CrawlerStages.StartKeyWordAnalysis) {
    // first time run with target App URL
    cleanState();

    const { appUrl, searchTerm, tabId } = message.data as StartKeyWordsAnalysis;

    // save state
    inMemoryStore.state.isProcessing = true;
    inMemoryStore.state.appUrl = appUrl;
    inMemoryStore.state.searchTerm = searchTerm;
    inMemoryStore.state.tabId = tabId || null;

    await runScrapeProcess(message.data);

    sendResponse({ status: 'started' });

    return;
  }

  // save scrapped data
  if (message.type === CrawlerStages.SaveOrUpdateKeyWordAnalysis) {
    const { appUrl, keywords, tabId } = message.data as ScrapedKeyWordsResult;

    inMemoryStore.state.tabId = tabId;

    // let's create analysis
    if (!inMemoryStore.state.analyzeId) {
      const { searchTerm } = inMemoryStore.state;

      // save analysisID, so later we can work with it
      inMemoryStore.state.analyzeId = await createAnalysis({
        searchPhrase: searchTerm,
        appUrl,
        keywords,
      });

      // run the search for competitors loop
      return searchForCompetitors({
        searchTerm: inMemoryStore.state.searchTerm,
        tabId: inMemoryStore.state.tabId,
      });
    }

    // save competitor data
    await updateAnalysis(inMemoryStore.state.analyzeId, {
      competitors: [
        {
          competitorUrl: appUrl,
          keywords,
        },
      ],
    });

    return;
  }

  if (message.type === CrawlerStages.CompetitorsParseUrl) {
    const { links } = message.data as SearchForCompetitorsResult;

    for (const link of links) {
      try {
        console.log('runScrapeProcess for: ', link);

        await runScrapeProcess({
          appUrl: link,
          tabId: inMemoryStore.state.tabId,
        });

        // add slight delay
        await new Promise((resolve) =>
          setTimeout(resolve, (5 + Math.floor(Math.random() * 10)) * 1000)
        );
      } catch (e) {
        console.error('runScrapeProcess error: ', e);
      }
    }

    const { analyzeId, tabId } = inMemoryStore.state;

    cleanState();

    // open report page
    const { optionsUrl } = await chrome.management.getSelf();

    await chrome.tabs.create({
      url: `${optionsUrl}?analyzeId=${analyzeId}`,
    });

    if (tabId) {
      try {
        await chrome.tabs.remove(tabId);
      } catch (e) {
        // ...
      }
    }

    return;
  }

  // keep for debug purposes
  console.warn('Unknown message passed: ', message.type);
  console.warn({ message });
}
