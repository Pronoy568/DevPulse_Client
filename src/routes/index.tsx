import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Login } from '../features/auth/pages/Login';
import { Signup } from '../features/auth/pages/Signup';
import { Dashboard } from '../features/dashboard/pages/Dashboard';
import { IssuesList } from '../features/issues/pages/IssuesList';
import { IssueBoard } from '../features/issues/pages/IssueBoard';
import { CreateIssue } from '../features/issues/pages/CreateIssue';
import { IssueDetail } from '../features/issues/pages/IssueDetail';
import { ProfilePage } from '../features/profile/pages/ProfilePage';
import { AdminPage } from '../features/admin/pages/AdminPage';
import { ProjectsList } from '../features/projects/pages/ProjectsList';
import { TeamsList } from '../features/teams/pages/TeamsList';
import { ProtectedRoute } from '../guards/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="projects" element={<ProjectsList />} />
        <Route path="teams" element={<TeamsList />} />
        
        <Route path="issues">
          <Route index element={<IssueBoard />} />
          <Route path="list" element={<IssuesList />} />
          <Route path="create" element={<CreateIssue />} />
          <Route path=":id" element={<IssueDetail />} />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
