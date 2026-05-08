import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { buildRoleScopeFilters, getRoleConfig, resolveRoleFromClaims } from '../config/rbac';
import { isFirebaseConfigured } from '../platform/config/environment';

const AuthContext = createContext(null);

const readStorageValue = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorageValue = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures so auth state can still render.
  }
};

const removeStorageValue = (key) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage failures so auth state can still render.
  }
};

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
    () => readStorageValue('viewOnlyMode') === 'true',
  );
  const firebaseConfigured = isFirebaseConfigured();
  const [loading, setLoading] = useState(firebaseConfigured);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        setViewOnly(false);
        removeStorageValue('viewOnlyMode');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [firebaseConfigured]);

  const enableViewOnly = () => {
    setViewOnly(true);
    writeStorageValue('viewOnlyMode', 'true');
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
