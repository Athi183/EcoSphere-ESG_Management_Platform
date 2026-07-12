import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { Leaf, Loader2, Plus, Trash2 } from 'lucide-react';
import { transactionService } from '../../services/transactionService';
import { departmentService } from '../../services/departmentService';
import { getEmissionFactors } from '../../services/emissionFactorService';

const CarbonTransactions = () => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch Data
  const { data: transactions = [], isLoading: loadingTx } = useQuery({
    queryKey: ['transactions'],
    queryFn: transactionService.getTransactions,
  });

  const { data: departments = [], isLoading: loadingDepts } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getDepartments,
  });

  const { data: emissionFactors = [], isLoading: loadingFactors } = useQuery({
    queryKey: ['emissionFactors'],
    queryFn: getEmissionFactors,
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: transactionService.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      toast.success('Carbon transaction recorded successfully!');
      reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to record transaction');
      setIsSubmitting(false);
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: transactionService.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      toast.success('Carbon transaction deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to delete transaction');
    }
  });

  const onSubmit = (data) => {
    setIsSubmitting(true);
    // Convert to proper types
    const payload = {
      department_id: parseInt(data.department_id),
      emission_factor_id: parseInt(data.emission_factor_id),
      quantity: parseFloat(data.quantity),
      remarks: data.remarks || '',
    };
    createMutation.mutate(payload);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteMutation.mutate(id);
    }
  };

  const isLoading = loadingTx || loadingDepts || loadingFactors;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-env-500 animate-spin" />
      </div>
    );
  }

  const deptList = departments?.data?.items || departments?.items || (Array.isArray(departments) ? departments : []);
  const factorList = emissionFactors?.data?.items || emissionFactors?.items || (Array.isArray(emissionFactors) ? emissionFactors : []);
  const txList = transactions?.items || (Array.isArray(transactions) ? transactions : []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Carbon Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Record and monitor day-to-day carbon emissions.</p>
        </div>
      </div>

      {/* Record Transaction Form */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-slate-700 p-6 transition-colors">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">
          <div className="w-8 h-8 bg-env-50 dark:bg-env-900/30 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-env-600 dark:text-env-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Record New Transaction</h2>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
              <select
                {...register("department_id", { required: "Department is required" })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-env-500 focus:border-env-500 outline-none transition-colors bg-white dark:bg-slate-900 dark:text-white"
              >
                <option value="">Select a department...</option>
                {deptList.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              {errors.department_id && <p className="text-sm text-red-500 mt-1">{errors.department_id.message}</p>}
            </div>

            {/* Emission Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emission Source</label>
              <select
                {...register("emission_factor_id", { required: "Emission source is required" })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-env-500 focus:border-env-500 outline-none transition-colors bg-white dark:bg-slate-900 dark:text-white"
              >
                <option value="">Select a source...</option>
                {factorList.map(factor => (
                  <option key={factor.id} value={factor.id}>
                    {factor.source_name} ({factor.unit})
                  </option>
                ))}
              </select>
              {errors.emission_factor_id && <p className="text-sm text-red-500 mt-1">{errors.emission_factor_id.message}</p>}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
              <input
                type="number"
                step="0.01"
                {...register("quantity", { 
                  required: "Quantity is required",
                  min: { value: 0.01, message: "Must be greater than 0" }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-env-500 focus:border-env-500 outline-none transition-colors bg-white dark:bg-slate-900 dark:text-white"
                placeholder="0.00"
              />
              {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity.message}</p>}
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Remarks (Optional)</label>
              <input
                type="text"
                {...register("remarks")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-env-500 focus:border-env-500 outline-none transition-colors bg-white dark:bg-slate-900 dark:text-white"
                placeholder="E.g., Monthly electricity bill"
              />
            </div>
          </div>
          
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center py-2 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-env-600 hover:bg-env-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-env-500 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Leaf className="w-4 h-4 mr-2" />}
              {isSubmitting ? 'Recording...' : 'Record Transaction'}
            </button>
          </div>
        </form>
      </div>

      {/* Historical Transactions Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-800/50">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Carbon Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50/80 dark:bg-slate-800/80 border-b border-gray-100 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Quantity</th>
                <th className="px-6 py-4 font-medium">Calculated CO₂e</th>
                <th className="px-6 py-4 font-medium">Remarks</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {txList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Leaf className="w-8 h-8 mb-2 opacity-50" />
                      <p>No carbon transactions found.</p>
                      <p className="text-xs mt-1">Record a new transaction above to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                txList.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {format(new Date(tx.transaction_date), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">{tx.department?.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-slate-600">
                        {tx.emission_factor?.source_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {tx.quantity} {tx.emission_factor?.unit}
                    </td>
                    <td className="px-6 py-4 font-semibold text-env-600 dark:text-env-400">
                      {tx.calculated_emission.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-500 text-xs max-w-xs truncate" title={tx.remarks}>
                      {tx.remarks || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Delete Transaction"
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
      </div>
    </div>
  );
};

export default CarbonTransactions;
