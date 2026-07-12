import React from 'react';
import CrudTable from '../../components/common/CrudTable';
import SettingsHeader from './SettingsHeader';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../../services/categoryService';

const Categories = () => {
  const columns = [
    { key: 'name', label: 'Category Name' },
    { 
      key: 'type', 
      label: 'Type',
      render: (val) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
          val === 'CSR_ACTIVITY' 
            ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400' 
            : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400'
        }`}>
          {val === 'CSR_ACTIVITY' ? 'CSR Activity' : 'Challenge'}
        </span>
      )
    },
    { key: 'status', label: 'Status' }
  ];

  const formFields = [
    {
      name: 'name',
      label: 'Category Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., Waste Reduction'
    },
    {
      name: 'type',
      label: 'Category Type',
      type: 'select',
      required: true,
      options: [
        { value: 'CSR_ACTIVITY', label: 'CSR Activity' },
        { value: 'CHALLENGE', label: 'Challenge' }
      ],
      defaultValue: 'CSR_ACTIVITY'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'ACTIVE', label: 'ACTIVE' },
        { value: 'INACTIVE', label: 'INACTIVE' }
      ],
      defaultValue: 'ACTIVE'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">System Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Configure and manage corporate metadata.</p>
      </div>

      <SettingsHeader />

      <CrudTable
        title="Categories"
        subtitle="Manage category groups used in gamification challenges and CSR activity listings."
        entityName="Category"
        queryKey="categories"
        fetchFn={getCategories}
        createFn={createCategory}
        updateFn={updateCategory}
        deleteFn={deleteCategory}
        columns={columns}
        formFields={formFields}
        deleteWarningField="name"
        themeColor="social"
      />
    </div>
  );
};

export default Categories;
