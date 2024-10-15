import React from 'react';
import { ReportContainer } from '../../containers/report';

import './Options.css';

interface Props {
  title: string;
}

const Options: React.FC<Props> = ({ title }: Props) => {
  const { searchParams } = new URL(window.location.href);
  const analyzeId = searchParams.get('analyzeId');

  if (analyzeId) {
    return <ReportContainer id={analyzeId} />;
  }

  return <div className="OptionsContainer">{title} Page</div>;
};

export default Options;
