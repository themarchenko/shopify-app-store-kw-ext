import React, {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Puff } from 'react-loader-spinner';

import { initialState, fields, FieldKey } from './form-state';
import { CrawlerStages } from '../../actions';

export const SearchForm: FC = () => {
  const [processing, setProcessing] = useState(false);
  const [formState, setFormState] = useState(initialState);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: CrawlerStages.AskStatus }).then();

    const interval = setInterval(() => {
      chrome.runtime.sendMessage({ type: CrawlerStages.AskStatus }).then();
    }, 1_000);

    const handler = (message: any) => {
      if (message.type === CrawlerStages.Status) {
        const { state } = message.data as any;

        setProcessing(!!state.isProcessing);
      }
    };

    chrome.runtime.onMessage.addListener(handler);

    return () => {
      clearInterval(interval);
      chrome.runtime.onMessage.removeListener(handler);
    };
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      setProcessing(false);

      event.preventDefault();

      const [tab] = await chrome.tabs.query({ active: true });

      // Send a message to the background script to start the crawling process
      await chrome.runtime.sendMessage({
        type: CrawlerStages.StartKeyWordAnalysis,
        data: { ...formState, tabId: tab?.id || null },
      });
    },
    [formState]
  );

  const handleInputChange = useCallback(
    (key: FieldKey): ChangeEventHandler<HTMLInputElement> => {
      return (event) => {
        setFormState((prevState) => ({
          ...prevState,
          [key]: event.target.value,
        }));
      };
    },
    []
  );

  if (processing) {
    return (
      <div className="popup-form">
        <Puff
          visible
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="puff-loading"
        />
      </div>
    );
  }

  return (
    <form className="popup-form" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <input
          type="text"
          required
          key={field.key}
          placeholder={field.placeholder}
          value={formState[field.key] as string}
          onChange={handleInputChange(field.key)}
        />
      ))}

      <button type="submit">Process</button>
    </form>
  );
};
