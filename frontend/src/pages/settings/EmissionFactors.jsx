import React from 'react';
import CrudTable from '../../components/common/CrudTable';
import SettingsHeader from './SettingsHeader';
import {
  getEmissionFactors,
  createEmissionFactor,
  updateEmissionFactor,
  deleteEmissionFactor
} from '../../services/emissionFactorService';

const EmissionFactors = () => {
  const columns = [
    { key: 'source_name', label: 'Source Name' },
    { key: 'unit', label: 'Unit' },
    { 
      key: 'emission_factor', 
      label: 'Emission Factor',
      render: (val) => <span className="font-mono bg-gray-50 dark:bg-slate-900/50 px-2 py-1 rounded text-xs">{val}</span>
    },
    { key: 'status', label: 'Status' }
  ];

  const formFields = [
    {
      name: 'source_name',
      label: 'Source Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., Grid Electricity'
    },
    {
      name: 'unit',
      label: 'Unit of Measurement',
      type: 'text',
      required: true,
      placeholder: 'e.g., kWh, Litres'
    },
    {
      name: 'emission_factor',
      label: 'Multiplier Factor (>0)',
      type: 'number',
      required: true,
      min: 0.000001,
      placeholder: '0.00'
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
    },
    {
      name: 'description',
      label: 'Description (Optional)',
      type: 'textarea',
      required: false,
      placeholder: 'Additional details about the carbon factor...'
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
        title="Emission Factors"
        subtitle="Manage carbon multipliers for calculating real-time transactional emissions."
        entityName="Emission Factor"
        queryKey="emissionFactors"
        fetchFn={getEmissionFactors}
        createFn={createEmissionFactor}
        updateFn={updateEmissionFactor}
        deleteFn={deleteEmissionFactor}
        columns={columns}
        formFields={formFields}
        deleteWarningField="source_name"
        themeColor="env"
      />
    </div>
  );
};

export default EmissionFactors;
