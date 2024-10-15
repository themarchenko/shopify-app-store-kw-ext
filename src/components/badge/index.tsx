import React, { FC, PropsWithChildren } from 'react';

import './badge.css';

export const Badge: FC<PropsWithChildren> = ({ children }) => {
  return <span className="badge">{children}</span>;
};
