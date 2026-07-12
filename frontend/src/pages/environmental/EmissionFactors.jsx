import React from 'react';
import CrudTable from '../../components/common/CrudTable';
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
  );
};

export default EmissionFactors;
