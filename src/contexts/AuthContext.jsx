import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [viewOnly, setViewOnly] = useState(
    () => localStorage.getItem('viewOnlyMode') === 'true',
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        setViewOnly(false);
        localStorage.removeItem('viewOnlyMode');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const enableViewOnly = () => {
    setViewOnly(true);
    localStorage.setItem('viewOnlyMode', 'true');
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, viewOnly, loading, enableViewOnly, logout }),
    [user, viewOnly, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
