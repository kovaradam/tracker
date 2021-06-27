import React from 'react';
import ReactDOM from 'react-dom';

import { open } from 'indexeddb-hooked';

import App from './App';
import Providers from './components/Providers';
import config from './db/config';
import './index.css';

open(config);

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById('root'),
);

// add leaflet stylesheets here bc of linaria plugin problems
