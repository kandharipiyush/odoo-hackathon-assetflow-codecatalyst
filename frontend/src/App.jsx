import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Router from './router/Router';

/**
 * Root Application Component.
 * Integrates global AuthProvider context and routes.
 */
function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
