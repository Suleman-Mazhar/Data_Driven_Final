import React, { createContext, useState, useEffect, useContext } from 'react';


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    // dummy data
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        
        setTimeout(() => {
          setUser({
            prs_id: 'PRS123456',
            name: 'John Doe',
            roles: ['public'] // or 'government_official', 'merchant'
          });
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Failed to load user:', err);
        setError('Authentication failed');
        localStorage.removeItem('token');
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  const login = async (prs_id, password) => {
    try {
      setError(null);
      
      
      return new Promise((resolve) => {
        setTimeout(() => {
          if (prs_id === 'PRS123456' && password === 'password') {
            const fakeToken = 'fake-jwt-token';
            localStorage.setItem('token', fakeToken);
            
            setUser({
              prs_id: 'PRS123456',
              name: 'John Doe',
              roles: ['public']
            });
            
            resolve(true);
          } else if (prs_id === 'GOVPRS789' && password === 'password') {
            const fakeToken = 'fake-jwt-token-gov';
            localStorage.setItem('token', fakeToken);
            
            setUser({
              prs_id: 'GOVPRS789',
              name: 'Jane Smith',
              roles: ['government_official']
            });
            
            resolve(true);
          } else if (prs_id === 'PRS234567' && password === 'password') {
            const fakeToken = 'fake-jwt-token-merchant';
            localStorage.setItem('token', fakeToken);
            
            setUser({
              prs_id: 'PRS234567',
              name: 'Sarah Johnson',
              roles: ['merchant']
            });
            
            resolve(true);
          } else {
            setError('Invalid credentials');
            resolve(false);
          }
        }, 1000);
      });
    } catch (err) {
      setError('Login failed');
      return false;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        hasRole,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);

export default AuthContext;