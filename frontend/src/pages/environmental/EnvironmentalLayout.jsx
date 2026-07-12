import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const EnvironmentalLayout = () => {
  const tabs = [
    { name: 'Carbon Transactions', path: '/environmental', end: true },
    { name: 'Departments', path: '/environmental/departments' },
    { name: 'Emission Factors', path: '/environmental/emission-factors' },
    { name: 'Categories', path: '/environmental/categories' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Environmental Module</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage carbon transactions, department directories, emission factors, and category mappings.</p>
      </div>

      <div className="flex border-b border-gray-200 dark:border-slate-700/60 mb-6 gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            end={tab.end}
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

      <Outlet />
    </div>
  );
};

export default EnvironmentalLayout;
