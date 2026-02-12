import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './utils/AuthContext';
import App from './App';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
