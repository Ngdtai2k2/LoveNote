import React from 'react';

import { AppProviders } from '@contexts';
import { ThemeProvider } from '@material-tailwind/react';
import { persistor, store } from '@redux/store';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider>
        <AppProviders>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AppProviders>
      </ThemeProvider>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
