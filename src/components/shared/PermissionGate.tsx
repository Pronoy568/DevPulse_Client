import React from 'react';
import { useAppSelector } from '../../app/hooks';

interface PermissionGateProps {
  children: React.ReactNode;
  allowedRoles: Array<'contributor' | 'maintainer' | 'admin'>;
  fallback?: React.ReactNode;
}

/**
 * Renders children only if the current user has one of the allowed roles.
 * Use for conditional UI rendering based on permissions.
 *
 * @example
 * <PermissionGate allowedRoles={['maintainer']}>
 *   <Button danger>Delete</Button>
 * </PermissionGate>
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  allowedRoles,
  fallback = null,
}) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user || !allowedRoles.includes(user.role as any)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
