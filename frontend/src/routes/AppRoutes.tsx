import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Admin Pages
import { AdminDashboard } from '../pages/Admin/Dashboard';
import { AdminTransportes } from '../pages/Admin/Transportes';
import { AdminMotoristas } from '../pages/Admin/Motoristas';
import { AdminAlunos } from '../pages/Admin/Alunos';
import { AdminAvisos } from '../pages/Admin/Avisos';

// Student Pages
import { StudentDashboard } from '../pages/Student/Dashboard';
import { StudentSearch } from '../pages/Student/Search';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: ('ADMIN' | 'ESTUDANTE')[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.perfil)) {
    return user.perfil === 'ADMIN' 
      ? <Navigate to="/admin/dashboard" replace /> 
      : <Navigate to="/student/my-transport" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Pages */}
      <Route
        path="/login"
        element={
          user ? (
            user.perfil === 'ADMIN' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/student/my-transport" replace />
            )
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/register"
        element={
          user ? (
            user.perfil === 'ADMIN' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/student/my-transport" replace />
            )
          ) : (
            <Register />
          )
        }
      />

      {/* Admin Pages */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/transportes"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminTransportes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/motoristas"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminMotoristas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/alunos"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAlunos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/avisos"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAvisos />
          </ProtectedRoute>
        }
      />

      {/* Student Pages */}
      <Route
        path="/student/my-transport"
        element={
          <ProtectedRoute allowedRoles={['ESTUDANTE']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/search"
        element={
          <ProtectedRoute allowedRoles={['ESTUDANTE']}>
            <StudentSearch />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route
        path="*"
        element={
          user ? (
            user.perfil === 'ADMIN' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/student/my-transport" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};
