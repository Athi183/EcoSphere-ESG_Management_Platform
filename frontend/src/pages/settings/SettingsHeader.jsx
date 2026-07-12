import React from 'react';
import { NavLink } from 'react-router-dom';

const SettingsHeader = () => {
  const tabs = [
    { name: 'Departments', path: '/settings/departments' },
    { name: 'Categories', path: '/settings/categories' },
    { name: 'Emission Factors', path: '/settings/emission-factors' },
  ];

  return (
    <div className="flex border-b border-gray-200 dark:border-slate-700/60 mb-6 gap-2">
      {tabs.map((tab) => (
        <NavLink
          key={tab.name}
          to={tab.path}
          className={({ isActive }) =>
            `px-4 py-2.5 text-sm font-bold border-b-2 transition-all duration-200 whitespace-nowrap ${
              isActive
                ? 'border-env-500 text-env-600 dark:text-env-400'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
            }`
          }
        >
          {tab.name}
        </NavLink>
      ))}
    </div>
  );
};

export default SettingsHeader;
