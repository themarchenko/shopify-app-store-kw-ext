import { processWorker } from '../../worker';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  processWorker(message, sender, sendResponse).then();
});
