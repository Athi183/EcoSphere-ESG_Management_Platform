import React from 'react';
import { useQuery } from '@tanstack/react-query';
import CrudTable from '../../components/common/CrudTable';
import SettingsHeader from './SettingsHeader';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '../../services/departmentService';

const Departments = () => {
  // Fetch departments for parent selection option
  const { data: deptData } = useQuery({
    queryKey: ['departmentsListSelect'],
    queryFn: () => getDepartments({ skip: 0, limit: 100 }),
  });

  const allDepts = deptData?.data?.items || deptData?.items || [];
  
  // Format parent options
  const parentOptions = [
    { value: '', label: 'None' },
    ...allDepts.map(d => ({ value: String(d.id), label: d.name }))
  ];

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'head_name', label: 'Head of Department' },
    { 
      key: 'employee_count', 
      label: 'Employees',
      render: (val) => val !== null ? `${val} active` : '0'
    },
    { key: 'status', label: 'Status' }
  ];

  const formFields = [
    {
      name: 'name',
      label: 'Department Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., Human Resources'
    },
    {
      name: 'code',
      label: 'Department Code',
      type: 'text',
      required: true,
      placeholder: 'e.g., HR'
    },
    {
      name: 'head_name',
      label: 'Head Name',
      type: 'text',
      required: false,
      placeholder: 'e.g., Jane Smith'
    },
    {
      name: 'employee_count',
      label: 'Employee Count',
      type: 'number',
      required: false,
      min: 0,
      defaultValue: 0,
      placeholder: '0'
    },
    {
      name: 'parent_department_id',
      label: 'Parent Department',
      type: 'select',
      required: false,
      options: parentOptions,
      defaultValue: ''
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
        title="Departments"
        subtitle="Manage company departments, headcount and ownership hierarchy."
        entityName="Department"
        queryKey="departments"
        fetchFn={getDepartments}
        createFn={createDepartment}
        updateFn={updateDepartment}
        deleteFn={deleteDepartment}
        columns={columns}
        formFields={formFields}
        deleteWarningField="name"
        themeColor="env"
      />
    </div>
  );
};

export default Departments;
