import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, FileText, HeartHandshake, CheckCircle2, Circle, Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCsrActivities, createCsrActivity, getPolicies, createPolicy } from '../../services/socialService';
import { getCategories } from '../../services/categoryService';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    PLANNED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
    ONGOING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200',
    COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200',
    ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200',
    DRAFT: 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300 border-gray-200',
  };
  
  const className = statusConfig[status] || statusConfig.DRAFT;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${className}`}>
      {status}
    </span>
  );
};

// --- CSR Activity Modal ---
const CsrModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    location: '',
    activity_date: new Date().toISOString().split('T')[0],
    status: 'PLANNED'
  });

  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories({ skip: 0, limit: 100 })
  });
  const categories = categoriesResponse?.data?.items || [];

  const createMutation = useMutation({
    mutationFn: createCsrActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['csr_activities'] });
      toast.success('CSR Activity created successfully');
      onClose();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to create activity')
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-xl shadow-2xl border border-gray-100 dark:border-slate-700 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create CSR Activity</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-env-500 outline-none dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-env-500 outline-none dark:text-white">
              <option value="">Select Category...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-env-500 outline-none dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-env-500 outline-none dark:text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input required type="date" value={formData.activity_date} onChange={e => setFormData({...formData, activity_date: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-env-500 outline-none dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-env-500 outline-none dark:text-white">
                <option value="PLANNED">PLANNED</option>
                <option value="ONGOING">ONGOING</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-env-600 hover:bg-env-700 rounded-xl transition-colors disabled:opacity-50">
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Create Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Policy Modal ---
const PolicyModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    version: '1.0',
    effective_date: new Date().toISOString().split('T')[0],
    status: 'DRAFT'
  });

  const createMutation = useMutation({
    mutationFn: createPolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success('Policy created successfully');
      onClose();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to create policy')
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-xl shadow-2xl border border-gray-100 dark:border-slate-700 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Internal Policy</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-env-500 outline-none dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-env-500 outline-none dark:text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Version</label>
              <input required type="text" value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-env-500 outline-none dark:text-white" placeholder="1.0" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-env-500 outline-none dark:text-white">
                <option value="DRAFT">DRAFT</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-env-600 hover:bg-env-700 rounded-xl transition-colors disabled:opacity-50">
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Create Policy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const Social = () => {
  const [activeTab, setActiveTab] = useState('csr');
  const [isCsrModalOpen, setIsCsrModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  const { data: csrData, isLoading: isLoadingCsr } = useQuery({
    queryKey: ['csr_activities'],
    queryFn: () => getCsrActivities({ skip: 0, limit: 100 })
  });

  const { data: policiesData, isLoading: isLoadingPolicies } = useQuery({
    queryKey: ['policies'],
    queryFn: () => getPolicies({ skip: 0, limit: 100 })
  });

  const csrActivities = csrData?.data?.items || [];
  const policies = policiesData?.data?.items || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <HeartHandshake className="w-8 h-8 text-pink-500" />
            Social & Governance
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-2xl">
            Track our Corporate Social Responsibility (CSR) initiatives and review our internal sustainability policies.
          </p>
        </div>
        
        {/* Dynamic Add Button */}
        <button 
          onClick={() => activeTab === 'csr' ? setIsCsrModalOpen(true) : setIsPolicyModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-env-600 dark:hover:bg-env-500 text-white rounded-xl shadow-md transition-all duration-300 font-bold group"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {activeTab === 'csr' ? 'Add Activity' : 'Add Policy'}
        </button>
      </div>

      {/* Custom Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100/50 dark:bg-slate-800/50 rounded-xl max-w-md w-full backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50">
        <button
          onClick={() => setActiveTab('csr')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
            activeTab === 'csr'
              ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Users className="w-4 h-4" />
          CSR Activities
        </button>
        <button
          onClick={() => setActiveTab('policies')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
            activeTab === 'policies'
              ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Internal Policies
        </button>
      </div>

      {/* Content Area */}
      <div className="mt-8 relative min-h-[400px]">
        {/* CSR Activities Tab */}
        {activeTab === 'csr' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingCsr ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-48 bg-white dark:bg-slate-800 rounded-3xl animate-pulse"></div>
                ))
              ) : csrActivities.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">No CSR Activities found</h3>
                </div>
              ) : (
                csrActivities.map((activity) => (
                  <div key={activity.id} className="group relative bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-slate-700 flex flex-col h-full overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 pr-8">{activity.title}</h3>
                      <StatusBadge status={activity.status} />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 flex-1">{activity.description}</p>
                    <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{activity.location || 'N/A'}</span>
                      <span className="text-gray-500 dark:text-gray-400">Date: {new Date(activity.activity_date).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Hover actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="p-1.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-md text-gray-600 dark:text-gray-300">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-md text-red-600 dark:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Policies Tab */}
        {activeTab === 'policies' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
              {isLoadingPolicies ? (
                <div className="p-8 text-center animate-pulse text-gray-400">Loading policies...</div>
              ) : policies.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">No policies found</h3>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-slate-700">
                  {policies.map((policy) => (
                    <div key={policy.id} className="group p-6 hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors flex items-start gap-4">
                      <div className="mt-1">
                        {policy.status === 'ACTIVE' ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{policy.title} <span className="text-sm font-normal text-gray-400 ml-2">v{policy.version}</span></h3>
                          <div className="flex items-center gap-4">
                             <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity duration-200">
                                <button className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded text-gray-500">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                             </div>
                             <StatusBadge status={policy.status} />
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{policy.description}</p>
                        <div className="mt-4 text-xs font-medium text-gray-400 dark:text-gray-500">
                          Last Updated: {new Date(policy.updated_at || policy.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <CsrModal isOpen={isCsrModalOpen} onClose={() => setIsCsrModalOpen(false)} />
      <PolicyModal isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} />
    </div>
  );
};

export default Social;
