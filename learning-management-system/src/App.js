import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Auth/AuthProvider';
import ProtectedRoute from './Auth/ProtectedRoute';
import Home from './ProtectedComponents/Home';
import Login from './Auth/Login';
import Dashboard from './ProtectedComponents/Dashboard';
import MainLayout from './Layout/MainLayout';
import { ConfigProvider } from 'antd';
import CONFIG  from './SampleConfig.json';
import ManageUser from './ProtectedComponents/ManageUser';
import './App.css'
import Permissions from './ProtectedComponents/Permissions';
const App = () => {
  //document.documentElement.style.setProperty("--parent-selected-bg", CONFIG.THEMEOBJ.components.Menu.parentSelectedBg);
  document.documentElement.style.setProperty("--parent-selected-color", CONFIG.THEMEOBJ.components.Menu.parentSelectedColor);
  return (
    <AuthProvider>
      <ConfigProvider theme={CONFIG.THEMEOBJ}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute> <MainLayout> <Dashboard /></MainLayout></ProtectedRoute>} />
            <Route path="/manage-user" element={<ProtectedRoute> <MainLayout> <ManageUser /></MainLayout></ProtectedRoute>} />
            <Route path="/permissions" element={<ProtectedRoute> <MainLayout> <Permissions /></MainLayout></ProtectedRoute>} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          </Routes>
        </Router>
      </ConfigProvider>
    </AuthProvider>
  );
};

export default App;
