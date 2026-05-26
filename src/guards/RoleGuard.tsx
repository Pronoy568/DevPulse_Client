import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Array<'contributor' | 'maintainer' | 'admin'>;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user || !allowedRoles.includes(user.role as any)) {
    return <Navigate to="/" replace />; // Redirect to dashboard if not allowed
  }

  return <>{children}</>;
};
