/**
 * Centralized route paths — prevents magic strings throughout the app.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  DASHBOARD: '/',

  ISSUES: '/issues',
  ISSUE_CREATE: '/issues/create',
  ISSUE_DETAIL: (id: string | number = ':id') => `/issues/${id}`,

  KANBAN: '/kanban',

  PROJECTS: '/projects',
  PROJECT_DETAIL: (id: string | number = ':id') => `/projects/${id}`,

  PROFILE: '/profile',

  NOTIFICATIONS: '/notifications',

  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_LOGS: '/admin/logs',
  ADMIN_SETTINGS: '/admin/settings',
} as const;
