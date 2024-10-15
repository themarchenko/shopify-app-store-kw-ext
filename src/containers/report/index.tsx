import React, { FC } from 'react';
import { Puff } from 'react-loader-spinner';

import {
  useReport,
  KeyWordAnalysisReport,
  Competitor,
} from '../../lib/entities/report/hooks/useReport';

import { Badge } from '../../components/badge';

import './report.css';

const KeywordsList: FC<{ keywords: string[] }> = ({ keywords }) => {
  return (
    <div className="keywords">
      {keywords.map((kw, idx) => (
        <Badge key={idx.toString()}>{kw}</Badge>
      ))}
    </div>
  );
};

const CompetitorInfo: FC<{ competitor: Competitor; position: number }> = ({
  competitor,
  position,
}) => {
  return (
    <div>
      <h3>
        #{position} - Competitor URL: {competitor.competitorUrl}
      </h3>
      <KeywordsList keywords={competitor.keywords} />
    </div>
  );
};

const ReportInfo: FC<{ report: KeyWordAnalysisReport }> = ({ report }) => {
  return (
    <div className="report">
      <h2>App URL: {report.appUrl}</h2>
      <h3>
        Search phrase used: <b>"{report.searchPhrase}"</b>
        <br />
        Created at: "{report.createdAt}"
      </h3>

      <div>
        <h4>Potential keywords</h4>
        <div className="keywords">
          {report.potentialKeywords.map((kw, idx) => (
            <Badge key={idx.toString()}>
              {kw.keyword} ({kw.score})
            </Badge>
          ))}
        </div>
      </div>

      <h4>Keywords used by app</h4>
      <KeywordsList keywords={report.keywords} />

      <div>
        <h2>Competitors</h2>

        {report.competitors.map((competitor, idx) => (
          <CompetitorInfo
            key={competitor.id}
            competitor={competitor}
            position={idx + 1}
          />
        ))}
      </div>
    </div>
  );
};

export const ReportContainer: FC<{ id: string }> = ({ id }) => {
  const { isLoading, error, data } = useReport(id);

  return (
    <div className="reportContainer">
      <h1>Report ID: {id}</h1>

      {isLoading && (
        <div className="loader">
          <Puff
            visible
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="puff-loading"
          />
        </div>
      )}

      {error && (
        <p className="error">
          Failed to load...
          <br />
          {error}
        </p>
      )}

      {data && <ReportInfo report={data} />}
    </div>
  );
};
