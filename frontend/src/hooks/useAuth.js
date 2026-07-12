import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom React hook to consume AuthContext
 * @returns {object} Auth Context Value
 * @throws {Error} If consumed outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider. Ensure that <AuthProvider> wraps your application component tree.');
  }
  
  return context;
};

export default useAuth;
