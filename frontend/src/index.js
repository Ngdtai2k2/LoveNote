import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@material-tailwind/react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AppProviders } from '@providers';
import { persistor, store } from '@redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
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
);

reportWebVitals();
