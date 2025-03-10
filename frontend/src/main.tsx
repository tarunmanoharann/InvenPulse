import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './store/store'; // Make sure this path is correct
import './index.css';
import { UserProvider } from './components/UserContext';
// Add this import at the top of main.tsx
import './firebase';  // This ensures Firebase is initialized before your app starts

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}> {/* Wrap the app with Redux Provider */}
      <UserProvider> {/* Wrap with UserProvider */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserProvider>
    </Provider>
  </React.StrictMode>,
);
