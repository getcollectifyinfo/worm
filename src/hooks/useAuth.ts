import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth failed: AuthContext is undefined. Check if AuthProvider wraps the app.');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
