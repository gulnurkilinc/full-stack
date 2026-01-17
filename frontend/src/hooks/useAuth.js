import { useState, useEffect } from 'react';
import { getUser, isAuthenticated, isAdmin } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin()
  };
};