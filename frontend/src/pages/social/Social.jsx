import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Leaf, Users, Droplet, X, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCsrActivities, createCsrActivity } from '../../services/socialService';
import { getCategories } from '../../services/categoryService';
import { getParticipations, approveParticipation, joinActivity } from '../../services/gamificationService';
import { useAuth } from '../../contexts/AuthContext';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create CSR Activity</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-env-500 outline-none text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-env-500 outline-none text-gray-900 dark:text-white">
              <option value="">Select Category...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-env-500 outline-none text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-env-500 outline-none text-gray-900 dark:text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input required type="date" value={formData.activity_date} onChange={e => setFormData({...formData, activity_date: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-env-500 outline-none text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-env-500 outline-none text-gray-900 dark:text-white">
                <option value="PLANNED">PLANNED</option>
                <option value="ONGOING">ONGOING</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-env-600 hover:bg-env-700 rounded-lg transition-colors disabled:opacity-50">
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Create Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const Social = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();
  const [isCsrModalOpen, setIsCsrModalOpen] = useState(false);

  const { data: csrData, isLoading: isLoadingCsr } = useQuery({
    queryKey: ['csr_activities'],
    queryFn: () => getCsrActivities({ skip: 0, limit: 100 })
  });

  const { data: participations } = useQuery({
    queryKey: ['participations'],
    queryFn: getParticipations
  });

  const joinMutation = useMutation({
    mutationFn: (activityId) => joinActivity({ activity_id: activityId, proof_url: 'joined.jpg' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participations'] });
      toast.success('Successfully joined the activity!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to join activity');
    }
  });

  const approveMutation = useMutation({
    mutationFn: (partId) => approveParticipation(partId, 50),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participations'] });
      toast.success('Participation approved & points awarded!');
    }
  });

  const csrActivities = csrData?.data?.items || [];

  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('tree') || t.includes('plant')) return <Leaf className="w-4 h-4 text-green-500" />;
    if (t.includes('blood') || t.includes('water')) return <Droplet className="w-4 h-4 text-red-500" />;
    return <Users className="w-4 h-4 text-orange-500" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="space-y-6 pt-2">
        
        {/* Top Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <button 
            onClick={() => setIsCsrModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-env-600 hover:bg-env-700 text-white rounded-lg font-bold transition-colors shadow-sm"
          >
            + Create Activity
          </button>
        </div>

        {/* CSR Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingCsr ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
            ))
          ) : csrActivities.length === 0 ? (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl">
              <Users className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No CSR Activities found</h3>
              <p className="text-gray-500 dark:text-gray-400">Create a new activity to engage employees.</p>
            </div>
          ) : (
            csrActivities.map((activity) => {
              // Count how many people joined this specific activity
              const joinedCount = participations?.filter(p => p.activity_title === activity.title).length || 0;
              
              return (
                <div 
                  key={activity.id}
                  className="group relative bg-white dark:bg-slate-800 rounded-2xl p-5 border-2 border-env-500/20 hover:border-env-500 hover:shadow-lg transition-all flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      {getIcon(activity.title)}
                      {activity.title}
                    </h3>
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {joinedCount} joined
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                    {activity.status === 'PLANNED' ? 'Open' : 'Evidence Required'}
                  </div>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <button 
                      onClick={() => joinMutation.mutate(activity.id)}
                      disabled={joinMutation.isPending}
                      className="px-6 py-2 bg-env-600 hover:bg-env-700 text-white rounded-lg font-bold transition-colors text-sm disabled:opacity-50"
                    >
                      Join
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Dynamic Employee Participation Table */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Employee Participation {isAdmin && ': approval queue'}
        </h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-semibold">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Activity/Challenge</th>
                <th className="px-6 py-4">Proof</th>
                <th className="px-6 py-4">Points</th>
                <th className="px-6 py-4">Approval</th>
                {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {participations?.map(part => (
                <tr key={part.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{part.user_name}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{part.activity_title}</td>
                  <td className="px-6 py-4 text-env-500 dark:text-env-400 cursor-pointer hover:underline">{part.proof_url || '-'}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{part.points_awarded || 0}</td>
                  <td className="px-6 py-4">
                    {part.status === 'PENDING' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-500/50">Pending</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-500/50">Approved</span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      {part.status === 'PENDING' && (
                        <button 
                          onClick={() => approveMutation.mutate(part.id)}
                          className="px-4 py-1.5 bg-env-600 hover:bg-env-700 text-white font-bold rounded-lg transition-colors text-xs flex items-center gap-1 ml-auto"
                        >
                          <Check className="w-3 h-3" />
                          Approve
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {(!participations || participations.length === 0) && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No participation requests in the queue.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CsrModal isOpen={isCsrModalOpen} onClose={() => setIsCsrModalOpen(false)} />
    </div>
  );
};

export default Social;
