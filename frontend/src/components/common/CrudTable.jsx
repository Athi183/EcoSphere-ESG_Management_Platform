import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Edit2, Trash2, X, Search, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

const CrudTable = ({
  title,
  subtitle,
  entityName,
  queryKey,
  fetchFn,
  createFn,
  updateFn,
  deleteFn,
  columns,
  formFields,
  deleteWarningField = 'name',
  themeColor = 'env', // 'env' (emerald), 'social' (orange), 'gov' (indigo)
}) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const limit = 10;

  // React Query Fetch
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryKey, page],
    queryFn: () => fetchFn({ skip: page * limit, limit }),
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Mutations
  const createMutation = useMutation({
    mutationFn: createFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setItemToDelete(null);
    },
  });

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      formFields.forEach(field => {
        setValue(field.name, item[field.name] !== undefined ? item[field.name] : '');
      });
    } else {
      setEditingItem(null);
      reset();
      // Set defaults if defined
      formFields.forEach(field => {
        if (field.defaultValue !== undefined) {
          setValue(field.name, field.defaultValue);
        }
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    reset();
  };

  const onSubmit = (formData) => {
    // Process field types (e.g. convert numbers)
    const processedData = { ...formData };
    formFields.forEach(field => {
      if (field.type === 'number') {
        processedData[field.name] = formData[field.name] !== '' ? Number(formData[field.name]) : null;
      }
    });

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: processedData });
    } else {
      createMutation.mutate(processedData);
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

  // Extract items lists safely
  const items = data?.data?.items || data?.items || [];
  const total = data?.data?.total || data?.total || 0;

  // Client-side search filtering
  const filteredItems = items.filter(item => {
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Theme styling helpers
  const themeClasses = {
    env: {
      text: 'text-env-600 dark:text-env-400',
      bg: 'bg-env-50 dark:bg-env-900/30',
      border: 'border-env-500',
      btn: 'bg-env-600 hover:bg-env-700 focus:ring-env-500 text-white',
      badge: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    },
    social: {
      text: 'text-social-600 dark:text-social-400',
      bg: 'bg-social-50 dark:bg-social-900/30',
      border: 'border-social-500',
      btn: 'bg-social-600 hover:bg-social-700 focus:ring-social-500 text-white',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    },
    gov: {
      text: 'text-gov-600 dark:text-gov-400',
      bg: 'bg-gov-50 dark:bg-gov-900/30',
      border: 'border-gov-500',
      btn: 'bg-gov-600 hover:bg-gov-700 focus:ring-gov-500 text-white',
      badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
    }
  }[themeColor] || themeClasses.env;

  return (
    <div className="space-y-6">
      {/* Header and Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 dark:border-slate-700/60 transition-all duration-300">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{subtitle}</p>
        </div>
        
        <button
          onClick={() => openModal()}
          className={`px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-semibold shadow-sm text-sm hover:scale-[1.02] active:scale-[0.98] ${themeClasses.btn}`}
        >
          <Plus className="w-4 h-4" /> Add {entityName}
        </button>
      </div>

      {/* Main Data Layout */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 dark:border-slate-700/60 overflow-hidden transition-all duration-300">
        
        {/* Search Toolbar */}
        <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4.5 h-4.5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${entityName.toLowerCase()}s...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-900 focus:bg-white focus:ring-2 focus:ring-env-500 dark:focus:ring-env-600 outline-none transition-all dark:text-white"
            />
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            Showing {filteredItems.length} of {total} items
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-env-600" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading details...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-red-500">
              <AlertCircle className="w-10 h-10" />
              <p className="font-semibold">Error retrieving data</p>
              <p className="text-xs text-gray-400 max-w-xs text-center">{error?.message || 'Server connection issue'}</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 dark:bg-slate-800/80 border-b border-gray-100 dark:border-slate-700 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                  {columns.map((col, idx) => (
                    <th key={idx} className="p-4.5">{col.label}</th>
                  ))}
                  <th className="p-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60 text-sm">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="p-12 text-center text-gray-400 dark:text-gray-500">
                      No {entityName.toLowerCase()}s found matching search.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/40 dark:hover:bg-slate-700/20 transition-colors">
                      {columns.map((col, idx) => (
                        <td key={idx} className="p-4.5 text-gray-700 dark:text-gray-300 font-medium">
                          {col.render ? (
                            col.render(item[col.key], item)
                          ) : col.key === 'status' ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                              item[col.key] === 'ACTIVE'
                                ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400'
                            }`}>
                              {item[col.key]}
                            </span>
                          ) : (
                            item[col.key] !== null && item[col.key] !== undefined ? String(item[col.key]) : '-'
                          )}
                        </td>
                      ))}
                      <td className="p-4.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openModal(item)}
                            className="p-1.5 text-gray-400 hover:text-social-600 hover:bg-social-50 dark:hover:bg-social-900/20 dark:hover:text-social-400 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {total > limit && (
          <div className="px-5 py-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              Page {page + 1} of {Math.ceil(total / limit)}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-900 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={(page + 1) * limit >= total}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-900 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingItem ? `Edit ${entityName}` : `Add ${entityName}`}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {formFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        {...register(field.name, { required: field.required && `${field.label} is required` })}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-env-500 outline-none transition-shadow"
                      >
                        {field.options.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        {...register(field.name, { required: field.required && `${field.label} is required` })}
                        rows={3}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-env-500 outline-none transition-shadow resize-none"
                        placeholder={field.placeholder || ''}
                      />
                    ) : (
                      <input
                        type={field.type || 'text'}
                        step={field.type === 'number' ? 'any' : undefined}
                        {...register(field.name, {
                          required: field.required && `${field.label} is required`,
                          min: field.min !== undefined ? { value: field.min, message: `Must be at least ${field.min}` } : undefined
                        })}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-env-500 outline-none transition-shadow"
                        placeholder={field.placeholder || ''}
                      />
                    )}
                    {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>}
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-gray-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className={`px-5 py-2 text-sm rounded-xl font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 ${themeClasses.btn}`}
                >
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingItem ? 'Save Changes' : `Add ${entityName}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!itemToDelete}
        title={`Delete ${entityName}`}
        message={`Are you sure you want to delete ${itemToDelete ? itemToDelete[deleteWarningField] : ''}? This action cannot be undone.`}
        confirmText={`Delete ${entityName}`}
        onConfirm={executeDelete}
        onCancel={() => setItemToDelete(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default CrudTable;
