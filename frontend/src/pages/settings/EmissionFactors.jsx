import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import {
  getEmissionFactors,
  createEmissionFactor,
  updateEmissionFactor,
  deleteEmissionFactor,
} from '../../services/emissionFactorService';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const EmissionFactors = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['emissionFactors'],
    queryFn: () => getEmissionFactors({ skip: 0, limit: 100 }),
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const createMutation = useMutation({
    mutationFn: createEmissionFactor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emissionFactors'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateEmissionFactor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emissionFactors'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmissionFactor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emissionFactors'] });
      setItemToDelete(null);
    },
  });

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setValue('source_name', item.source_name);
      setValue('unit', item.unit);
      setValue('emission_factor', item.emission_factor);
      setValue('description', item.description || '');
      setValue('status', item.status);
    } else {
      setEditingId(null);
      reset({ status: 'ACTIVE' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = (formData) => {
    // Convert emission_factor to number
    const dataToSubmit = {
      ...formData,
      emission_factor: parseFloat(formData.emission_factor),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: dataToSubmit });
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
  };

  const executeDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.id);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading emission factors...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error loading data.</div>;

  const items = data?.data?.items || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Emission Factors</h2>
          <p className="text-gray-500 text-sm mt-1">Manage carbon multipliers for different emission sources.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-env-600 hover:bg-env-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" /> Add Factor
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-600">Source Name</th>
              <th className="p-4 font-semibold text-gray-600">Unit</th>
              <th className="p-4 font-semibold text-gray-600">Factor</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No emission factors found. Click 'Add Factor' to create one.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">{item.source_name}</td>
                  <td className="p-4 text-gray-600">{item.unit}</td>
                  <td className="p-4 text-gray-600 font-mono bg-gray-50/50">{item.emission_factor}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openModal(item)}
                      className="p-2 text-gray-400 hover:text-social-600 hover:bg-social-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? 'Edit Emission Factor' : 'Add Emission Factor'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source Name</label>
                  <input
                    {...register('source_name', { required: 'Source name is required' })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-env-500 focus:border-env-500 outline-none transition-shadow"
                    placeholder="e.g., Grid Electricity"
                  />
                  {errors.source_name && <p className="text-red-500 text-xs mt-1">{errors.source_name.message}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <input
                      {...register('unit', { required: 'Unit is required' })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-env-500 focus:border-env-500 outline-none transition-shadow"
                      placeholder="e.g., kWh"
                    />
                    {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Factor (&gt;0)</label>
                    <input
                      type="number"
                      step="any"
                      {...register('emission_factor', { 
                        required: 'Factor is required',
                        min: { value: 0.000001, message: 'Must be strictly positive' }
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-env-500 focus:border-env-500 outline-none transition-shadow"
                      placeholder="0.00"
                    />
                    {errors.emission_factor && <p className="text-red-500 text-xs mt-1">{errors.emission_factor.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    {...register('status')}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-env-500 focus:border-env-500 outline-none transition-shadow bg-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea
                    {...register('description')}
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-env-500 focus:border-env-500 outline-none transition-shadow resize-none"
                    placeholder="Additional details..."
                  ></textarea>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-env-600 hover:bg-env-700 text-white px-6 py-2 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Factor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!itemToDelete}
        title="Delete Emission Factor"
        message={`Are you sure you want to delete the emission factor for ${itemToDelete?.source_name}? This action cannot be undone.`}
        confirmText="Delete Factor"
        onConfirm={executeDelete}
        onCancel={() => setItemToDelete(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default EmissionFactors;
