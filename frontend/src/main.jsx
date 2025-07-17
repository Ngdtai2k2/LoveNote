import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@material-tailwind/react';

import App from './App';
import './index.css';
import { AppProviders } from '@contexts';
import { store, persistor } from '@redux/store';

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
