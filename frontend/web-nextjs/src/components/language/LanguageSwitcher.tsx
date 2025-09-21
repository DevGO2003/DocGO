'use client';

import React, { useState, useEffect } from 'react';
import { Select, Button, Dropdown, Menu } from 'antd';
import { GlobalOutlined, CheckOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';

const { Option } = Select;

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

interface LanguageSwitcherProps {
  onChange?: (language: string) => void;
  currentLanguage?: string;
  mode?: 'select' | 'dropdown' | 'button';
  size?: 'small' | 'middle' | 'large';
  showFlag?: boolean;
  showNativeName?: boolean;
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  onChange,
  currentLanguage,
  mode = 'select',
  size = 'middle',
  showFlag = true,
  showNativeName = false,
  className = ''
}) => {
  const { t } = useTranslation('common');
  const { language, setLanguage, availableLanguages } = useLanguage();
  
  const [selectedLanguage, setSelectedLanguage] = useState(
    currentLanguage || language
  );

  // Update selected language when prop changes
  useEffect(() => {
    if (currentLanguage) {
      setSelectedLanguage(currentLanguage);
    }
  }, [currentLanguage]);

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    setLanguage(newLanguage);
    
    if (onChange) {
      onChange(newLanguage);
    }
  };

  // Render language option
  const renderLanguageOption = (lang: Language) => (
    <span className="flex items-center space-x-2">
      {showFlag && <span className="text-lg">{lang.flag}</span>}
      <span>{showNativeName ? lang.nativeName : lang.name}</span>
    </span>
  );

  // Render language option for dropdown
  const renderDropdownOption = (lang: Language) => (
    <div className="flex items-center justify-between w-full">
      <span className="flex items-center space-x-2">
        {showFlag && <span className="text-lg">{lang.flag}</span>}
        <span>{showNativeName ? lang.nativeName : lang.name}</span>
      </span>
      {selectedLanguage === lang.code && (
        <CheckOutlined className="text-blue-500" />
      )}
    </div>
  );

  // Select mode
  if (mode === 'select') {
    return (
      <Select
        value={selectedLanguage}
        onChange={handleLanguageChange}
        size={size}
        className={`min-w-32 ${className}`}
        suffixIcon={<GlobalOutlined />}
        optionLabelProp="label"
      >
        {availableLanguages.map(lang => (
          <Option 
            key={lang.code} 
            value={lang.code}
            label={renderLanguageOption(lang)}
          >
            {renderLanguageOption(lang)}
          </Option>
        ))}
      </Select>
    );
  }

  // Dropdown mode
  if (mode === 'dropdown') {
    const menuItems = availableLanguages.map(lang => ({
      key: lang.code,
      label: renderDropdownOption(lang),
      onClick: () => handleLanguageChange(lang.code),
    }));

    const currentLang = availableLanguages.find(lang => lang.code === selectedLanguage);

    return (
      <Dropdown
        menu={{ items: menuItems }}
        trigger={['click']}
        placement="bottomRight"
        arrow
      >
        <Button 
          size={size}
          className={`flex items-center space-x-2 ${className}`}
        >
          <GlobalOutlined />
          {showFlag && currentLang && (
            <span className="text-lg">{currentLang.flag}</span>
          )}
          <span className="hidden sm:inline">
            {currentLang ? (showNativeName ? currentLang.nativeName : currentLang.name) : 'Language'}
          </span>
        </Button>
      </Dropdown>
    );
  }

  // Button mode (compact)
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {availableLanguages.map(lang => (
        <Button
          key={lang.code}
          type={selectedLanguage === lang.code ? 'primary' : 'text'}
          size={size}
          onClick={() => handleLanguageChange(lang.code)}
          className="min-w-0 px-2"
          title={showNativeName ? lang.nativeName : lang.name}
        >
          {showFlag ? (
            <span className="text-lg">{lang.flag}</span>
          ) : (
            <span className="text-xs font-medium">
              {lang.code.toUpperCase()}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;

