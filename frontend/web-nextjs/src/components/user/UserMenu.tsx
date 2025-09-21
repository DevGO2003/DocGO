'use client';

import React, { useState } from 'react';
import { Dropdown, Avatar, Badge, Button, Modal, message } from 'antd';
import { 
  UserOutlined, 
  SettingOutlined, 
  LogoutOutlined, 
  BellOutlined,
  DownOutlined,
  ProfileOutlined,
  SecurityScanOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  notifications?: number;
}

interface UserMenuProps {
  user?: User;
  onAction?: (action: string) => void;
  showNotifications?: boolean;
  className?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  user,
  onAction,
  showNotifications = true,
  className = ''
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { logout } = useAuth();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // Handle user actions
  const handleUserAction = (action: string) => {
    if (onAction) {
      onAction(action);
    } else {
      // Default behavior
      switch (action) {
        case 'profile':
          router.push('/profile');
          break;
        case 'settings':
          router.push('/settings');
          break;
        case 'notifications':
          router.push('/notifications');
          break;
        case 'help':
          router.push('/help');
          break;
        case 'logout':
          setLogoutModalVisible(true);
          break;
        default:
          break;
      }
    }
  };

  // Handle logout confirmation
  const handleLogoutConfirm = async () => {
    try {
      await logout();
      message.success(t('user.logoutSuccess'));
      router.push('/login');
    } catch (error) {
      message.error(t('user.logoutError'));
    } finally {
      setLogoutModalVisible(false);
    }
  };

  // Menu items
  const menuItems = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: t('user.profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('user.settings'),
    },
    {
      key: 'security',
      icon: <SecurityScanOutlined />,
      label: t('user.security'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: t('user.help'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('user.logout'),
      danger: true,
    }
  ];

  // If no user, show login button
  if (!user) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button 
          type="primary" 
          onClick={() => router.push('/login')}
          size="small"
        >
          {t('user.login')}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className={`flex items-center space-x-3 ${className}`}>
        {/* Notifications */}
        {showNotifications && (
          <Badge count={user.notifications || 0} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              onClick={() => handleUserAction('notifications')}
              className="text-gray-600 hover:text-gray-900"
            />
          </Badge>
        )}

        {/* User Menu */}
        <Dropdown
          menu={{ 
            items: menuItems, 
            onClick: ({ key }) => handleUserAction(key) 
          }}
          trigger={['click']}
          placement="bottomRight"
          arrow
        >
          <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md transition-colors">
            <Avatar 
              src={user.avatar} 
              icon={<UserOutlined />}
              size="small"
              className="bg-blue-500"
            />
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-900">
                {user.name}
              </div>
              <div className="text-xs text-gray-500">
                {user.role || t('user.defaultRole')}
              </div>
            </div>
            <DownOutlined className="text-xs text-gray-400" />
          </div>
        </Dropdown>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        title={t('user.logoutConfirm')}
        open={logoutModalVisible}
        onOk={handleLogoutConfirm}
        onCancel={() => setLogoutModalVisible(false)}
        okText={t('user.logout')}
        cancelText={t('common.cancel')}
        okButtonProps={{ danger: true }}
      >
        <p>{t('user.logoutMessage')}</p>
      </Modal>
    </>
  );
};

export default UserMenu;

