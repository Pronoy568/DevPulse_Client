import { ThemeConfig, theme } from 'antd';

/**
 * DevPulse Dark Theme — Modern SaaS design inspired by Linear/GitHub.
 * Uses indigo (#6366f1) as primary color with a slate dark palette.
 */
export const devPulseDarkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    // Primary palette
    colorPrimary: '#6366f1',
    colorInfo: '#3b82f6',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',

    // Background
    colorBgContainer: '#1e293b',
    colorBgElevated: '#283548',
    colorBgLayout: '#0f172a',
    colorBgSpotlight: '#334155',

    // Text
    colorText: '#f1f5f9',
    colorTextSecondary: '#94a3b8',
    colorTextTertiary: '#64748b',
    colorTextQuaternary: '#475569',

    // Borders
    colorBorder: '#334155',
    colorBorderSecondary: '#475569',

    // Typography
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,

    // Shape
    borderRadius: 8,
    borderRadiusSM: 6,
    borderRadiusLG: 12,

    // Controls
    controlHeight: 40,
    controlHeightSM: 32,
    controlHeightLG: 48,

    // Shadows
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    boxShadowSecondary: '0 8px 24px rgba(0, 0, 0, 0.4)',
  },
  components: {
    Layout: {
      siderBg: '#1e293b',
      headerBg: '#1e293b',
      bodyBg: '#0f172a',
      triggerBg: '#334155',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: 'rgba(99, 102, 241, 0.12)',
      itemHoverBg: 'rgba(99, 102, 241, 0.08)',
      itemSelectedColor: '#818cf8',
      itemColor: '#94a3b8',
      itemHoverColor: '#f1f5f9',
    },
    Card: {
      colorBgContainer: '#1e293b',
      colorBorderSecondary: '#334155',
    },
    Table: {
      colorBgContainer: '#1e293b',
      headerBg: '#283548',
      headerColor: '#94a3b8',
      rowHoverBg: 'rgba(99, 102, 241, 0.06)',
      borderColor: '#334155',
    },
    Modal: {
      contentBg: '#1e293b',
      headerBg: '#1e293b',
      titleColor: '#f1f5f9',
    },
    Input: {
      colorBgContainer: '#283548',
      activeBorderColor: '#6366f1',
      hoverBorderColor: '#475569',
      colorTextPlaceholder: '#64748b',
    },
    Select: {
      colorBgContainer: '#283548',
      optionSelectedBg: 'rgba(99, 102, 241, 0.12)',
      colorBgElevated: '#283548',
    },
    Button: {
      primaryShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
      defaultBg: '#283548',
      defaultBorderColor: '#475569',
      defaultColor: '#f1f5f9',
    },
    Dropdown: {
      colorBgElevated: '#283548',
    },
    Popconfirm: {
      colorTextHeading: '#f1f5f9',
    },
    Tag: {
      defaultBg: '#283548',
      defaultColor: '#94a3b8',
    },
    Skeleton: {
      colorFill: '#334155',
      colorFillContent: '#283548',
    },
    Divider: {
      colorSplit: '#334155',
    },
    Tooltip: {
      colorBgSpotlight: '#334155',
      colorTextLightSolid: '#f1f5f9',
    },
    Notification: {
      colorBgElevated: '#283548',
    },
    Badge: {
      colorBgContainer: '#1e293b',
    },
    Form: {
      labelColor: '#94a3b8',
    },
  },
};

/**
 * DevPulse Light Theme — Crisp modern slate light theme.
 * Integrates perfectly with the light custom CSS tokens.
 */
export const devPulseLightTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // Primary palette
    colorPrimary: '#6366f1',
    colorInfo: '#3b82f6',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',

    // Background
    colorBgContainer: '#ffffff',
    colorBgElevated: '#f8fafc',
    colorBgLayout: '#f1f5f9',
    colorBgSpotlight: '#0f172a',

    // Text
    colorText: '#0f172a',
    colorTextSecondary: '#475569',
    colorTextTertiary: '#64748b',
    colorTextQuaternary: '#94a3b8',

    // Borders
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',

    // Typography
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,

    // Shape
    borderRadius: 8,
    borderRadiusSM: 6,
    borderRadiusLG: 12,

    // Controls
    controlHeight: 40,
    controlHeightSM: 32,
    controlHeightLG: 48,

    // Shadows
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    boxShadowSecondary: '0 8px 24px rgba(0, 0, 0, 0.08)',
  },
  components: {
    Layout: {
      siderBg: '#ffffff',
      headerBg: '#ffffff',
      bodyBg: '#f1f5f9',
      triggerBg: '#cbd5e1',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: 'rgba(99, 102, 241, 0.08)',
      itemHoverBg: 'rgba(99, 102, 241, 0.04)',
      itemSelectedColor: '#4f46e5',
      itemColor: '#475569',
      itemHoverColor: '#0f172a',
    },
    Card: {
      colorBgContainer: '#ffffff',
      colorBorderSecondary: '#e2e8f0',
    },
    Table: {
      colorBgContainer: '#ffffff',
      headerBg: '#f8fafc',
      headerColor: '#475569',
      rowHoverBg: 'rgba(99, 102, 241, 0.04)',
      borderColor: '#e2e8f0',
    },
    Modal: {
      contentBg: '#ffffff',
      headerBg: '#ffffff',
      titleColor: '#0f172a',
    },
    Input: {
      colorBgContainer: '#ffffff',
      activeBorderColor: '#6366f1',
      hoverBorderColor: '#cbd5e1',
      colorTextPlaceholder: '#94a3b8',
    },
    Select: {
      colorBgContainer: '#ffffff',
      optionSelectedBg: 'rgba(99, 102, 241, 0.08)',
      colorBgElevated: '#ffffff',
    },
    Button: {
      primaryShadow: '0 2px 8px rgba(99, 102, 241, 0.15)',
      defaultBg: '#ffffff',
      defaultBorderColor: '#cbd5e1',
      defaultColor: '#475569',
    },
    Dropdown: {
      colorBgElevated: '#ffffff',
    },
    Popconfirm: {
      colorTextHeading: '#0f172a',
    },
    Tag: {
      defaultBg: '#f1f5f9',
      defaultColor: '#475569',
    },
    Skeleton: {
      colorFill: '#e2e8f0',
      colorFillContent: '#f1f5f9',
    },
    Divider: {
      colorSplit: '#e2e8f0',
    },
    Tooltip: {
      colorBgSpotlight: '#0f172a',
      colorTextLightSolid: '#ffffff',
    },
    Notification: {
      colorBgElevated: '#ffffff',
    },
    Badge: {
      colorBgContainer: '#ffffff',
    },
    Form: {
      labelColor: '#475569',
    },
  },
};

