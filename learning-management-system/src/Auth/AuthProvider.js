import React, { createContext, useState, useEffect } from 'react';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userContext, setUserContext] = useState(null);

  // Check token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log("got token",token);
      setUser(token);
    }

    const usercontext = localStorage.getItem('usercontext');
    if (usercontext) {
      console.log("got usercontext",usercontext);
      setUserContext(usercontext);
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    // Replace with API call
    const response = await fetch('http://localhost:7182/api/Login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (data.Data) {
      localStorage.setItem('token', JSON.stringify(data.Data));
      setUser(JSON.stringify(data.Data));
    }
    return data;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usercontext');
    localStorage.removeItem('role');
    setUserContext(null);
    setUser(null);
   window.location.pathname = '/login';
  };
  const UpdateUserContext = (uctx) => {
    localStorage.setItem('usercontext',uctx);
    setUserContext(uctx);
  };

  const hasCreatePermission = (EntityName) => {
    return hasReadPermission(EntityName) && JSON.parse(userContext)?.RolePermissionList?.filter(x=> x.EntityName === EntityName)[0]?.Permissions?.some(permission => 
      permission.PermissionName === 'CREATE' && permission.IsEnabled
    );
  };
  const hasReadPermission = (EntityName) => {
    return JSON.parse(userContext)?.RolePermissionList?.filter(x=> x.EntityName === EntityName)[0]?.Permissions?.some(permission => 
      permission.PermissionName === 'READ' && permission.IsEnabled
    );
  };
  const hasUpdatePermission = (EntityName) => {
    return hasReadPermission(EntityName) && JSON.parse(userContext).RolePermissionList?.filter(x=> x.EntityName == EntityName)[0]?.Permissions?.some(permission => 
      permission.PermissionName === 'UPDATE' && permission.IsEnabled
    );
  };
  const hasDeletePermission = (EntityName) => {
    return hasReadPermission(EntityName) && JSON.parse(userContext)?.RolePermissionList?.filter(x=> x.EntityName === EntityName)[0]?.Permissions?.some(permission => 
      permission.PermissionName === 'DELETE' && permission.IsEnabled
    );
  };

  return (
    <AuthContext.Provider value={{ user, login, logout ,userContext,UpdateUserContext,hasCreatePermission,hasReadPermission,hasUpdatePermission,hasDeletePermission}}>
      {children}
    </AuthContext.Provider>
  );
};
