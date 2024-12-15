import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';


const ProtectedRoute = ({ children }) => {
  // const location = useLocation();
  //const { user } = useContext(AuthContext);
  const user = localStorage.getItem('token');
  console.log("11111111", user);
  if (!user){
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
