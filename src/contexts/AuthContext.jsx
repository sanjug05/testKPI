import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { buildRoleScopeFilters, getRoleConfig, resolveRoleFromClaims } from '../config/rbac';

const AuthContext = createContext(null);

const parseCustomAttributes = (firebaseUser) => {
  if (!firebaseUser?.reloadUserInfo?.customAttributes) return {};

  try {
    return JSON.parse(firebaseUser.reloadUserInfo.customAttributes);
  } catch (error) {
    console.warn('Unable to parse Firebase custom attributes', error);
    return {};
  }
};

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

  const profile = useMemo(() => {
    const claims = parseCustomAttributes(user);
    const role = resolveRoleFromClaims(claims, viewOnly);

    return {
      uid: user?.uid || null,
      email: user?.email || null,
      role,
      roleLabel: getRoleConfig(role).label,
      region: claims.region || user?.reloadUserInfo?.region || null,
      state: claims.state || null,
      territory: claims.territory || null,
      rm: claims.rm || null,
      asm: claims.asm || null,
      salesperson: claims.salesperson || null,
      scopeFilters: buildRoleScopeFilters({ role, ...claims }),
      // TODO: Replace local customAttributes parsing with Firebase custom claims from getIdTokenResult().
    };
  }, [user, viewOnly]);

  const value = useMemo(
    () => ({ user, viewOnly, loading, profile, role: profile.role, enableViewOnly, logout }),
    [user, viewOnly, loading, profile],
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
