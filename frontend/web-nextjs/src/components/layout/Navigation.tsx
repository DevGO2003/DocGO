'use client';

import React from 'react';
import { Layout, Menu } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  HomeOutlined,
  FileTextOutlined,
  FolderOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  AuditOutlined,
  BellOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

interface NavigationProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  width?: number;
  collapsedWidth?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  collapsed = false,
  onCollapse,
  width = 256,
  collapsedWidth = 80
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: t('navigation.home'),
    },
    {
      key: '/contracts',
      icon: <FileTextOutlined />,
      label: t('navigation.contracts'),
    },
    {
      key: '/documents',
      icon: <FolderOutlined />,
      label: t('navigation.documents'),
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: t('navigation.reports'),
    },
    {
      key: '/users',
      icon: <TeamOutlined />,
      label: t('navigation.users'),
    },
    {
      key: '/audit',
      icon: <AuditOutlined />,
      label: t('navigation.audit'),
    },
    {
      key: '/notifications',
      icon: <BellOutlined />,
      label: t('navigation.notifications'),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: t('navigation.settings'),
    }
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={width}
      collapsedWidth={collapsedWidth}
      className="bg-white border-r border-gray-200"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        {collapsed ? (
          <div className="text-xl font-bold text-blue-600">D</div>
        ) : (
          <div className="text-xl font-bold text-blue-600">DocGO</div>
        )}
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        className="border-r-0"
        style={{
          height: 'calc(100vh - 64px)',
          borderRight: 0,
        }}
      />
    </Sider>
  );
};

export default Navigation;

