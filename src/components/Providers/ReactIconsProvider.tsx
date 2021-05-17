import React from 'react';

import { IconContext } from 'react-icons';

const ReactIconsProvider: React.FC = ({ children }) => {
  return (
    <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
      {children}
    </IconContext.Provider>
  );
};

export default ReactIconsProvider;
