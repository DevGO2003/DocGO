'use client';

import React from 'react';
import { Layout } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import GlobalSearch from '../search/GlobalSearch';
import UserMenu from '../user/UserMenu';
import LanguageSwitcher from '../language/LanguageSwitcher';
import Logo from '../common/Logo';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  onSearch?: (query: string) => void;
  onLanguageChange?: (language: string) => void;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  onUserAction?: (action: string) => void;
  onMenuToggle?: () => void;
  collapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  onLanguageChange,
  user,
  onUserAction,
  onMenuToggle,
  collapsed = false
}) => {
  const { t } = useTranslation('common');

  return (
    <AntHeader className="bg-white shadow-sm border-b border-gray-200 px-0 h-16 flex items-center justify-between">
      <div className="flex items-center">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-2"
          aria-label={t('navigation.toggleMenu')}
        >
          <MenuOutlined className="text-lg" />
        </button>

        {/* Logo */}
        <div className="flex-shrink-0 ml-4 lg:ml-0">
          <Logo />
        </div>
      </div>

      {/* Global Search - Hidden on mobile, visible on tablet and up */}
      <div className="hidden md:flex flex-1 max-w-lg mx-8">
        <GlobalSearch 
          onSearch={onSearch || (() => {})}
          placeholder={t('search.placeholder')}
        />
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-4 mr-4">
        {/* Language Switcher */}
        <LanguageSwitcher 
          onChange={onLanguageChange || (() => {})}
        />

        {/* User Menu */}
        <UserMenu 
          user={user}
          onAction={onUserAction || (() => {})}
        />
      </div>
    </AntHeader>
  );
};

export default Header;
