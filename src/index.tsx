import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(                // strict mode helps by giving useful warnings, will render componets twice
  <React.StrictMode>     
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
