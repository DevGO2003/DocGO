'use client';

import React from 'react';
import { ConfigProvider, App as AntdApp } from 'antd';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import '@/i18n';

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 6,
    wireframe: false,
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#ffffff',
      bodyBg: '#f5f5f5',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#e6f7ff',
      itemHoverBg: '#f0f0f0',
    },
    Button: {
      borderRadius: 6,
    },
    Input: {
      borderRadius: 6,
    },
    Card: {
      borderRadius: 8,
    },
  },
};

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ConfigProvider theme={theme}>
      <AntdApp>
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </AntdApp>
    </ConfigProvider>
  );
};
