import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithCustomToken,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login with custom token (from Telegram) - ONLY AUTHENTICATION METHOD
  const loginWithCustomToken = async (customToken) => {
    try {
      // First validate token with backend
      const validateResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin-auth/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: customToken }),
      });

      const validateResult = await validateResponse.json();
      
      if (!validateResult.valid) {
        throw new Error(validateResult.message || 'Invalid token');
      }

      // If token is valid, try Firebase auth, fallback to mock user if Firebase fails
      try {
        const result = await signInWithCustomToken(auth, customToken);
        return result;
      } catch (firebaseError) {
        console.warn('Firebase auth failed, using fallback auth:', firebaseError);
        // Create mock user for fallback authentication
        const mockUser = {
          uid: 'admin-authenticated-via-telegram',
          email: 'admin@tagora.secure',
          displayName: 'Telegram Admin',
          getIdToken: () => Promise.resolve(customToken)
        };
        setCurrentUser(mockUser);
        return { user: mockUser };
      }

    } catch (error) {
      console.error('Custom token login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null); // Clear mock user as well
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      // Auto-logout on token expiration (custom tokens expire)
      if (user) {
        // Check token validity periodically
        const checkTokenValidity = setInterval(async () => {
          try {
            await user.getIdToken();
            // If this fails, the token is expired
          } catch (error) {
            console.log('Token expired, logging out');
            clearInterval(checkTokenValidity);
            logout();
          }
        }, 60000); // Check every minute

        // Cleanup on user change
        return () => clearInterval(checkTokenValidity);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loginWithCustomToken,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
