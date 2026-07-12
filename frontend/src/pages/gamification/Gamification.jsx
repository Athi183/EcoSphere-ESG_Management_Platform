import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trophy, Star, Target, Zap, Clock, Shield, Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getChallenges, createChallenge, updateChallenge, deleteChallenge } from '../../services/challengeService';
import { getCategories } from '../../services/categoryService';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const difficultyColors = {
  EASY: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  MEDIUM: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  HARD: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
};

const ChallengeModal = ({ isOpen, onClose, challengeToEdit }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    category_id: '',
    xp: 100,
    difficulty: 'EASY',
    deadline: new Date().toISOString().split('T')[0],
    status: 'ACTIVE'
  });

  React.useEffect(() => {
    if (challengeToEdit) {
      setFormData(challengeToEdit);
    } else {
      setFormData({
        title: '',
        description: '',
        category_id: '',
        xp: 100,
        difficulty: 'EASY',
        deadline: new Date().toISOString().split('T')[0],
        status: 'ACTIVE'
      });
    }
  }, [challengeToEdit]);

  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories({ skip: 0, limit: 100 })
  });
  const categories = categoriesResponse?.data?.items || [];

  const createMutation = useMutation({
    mutationFn: createChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast.success('Challenge created successfully');
      onClose();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to create challenge')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateChallenge(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast.success('Challenge updated successfully');
      onClose();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to update challenge')
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (challengeToEdit) {
      updateMutation.mutate({ id: challengeToEdit.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            {challengeToEdit ? 'Edit Challenge' : 'Create Challenge'}
          </h2>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">XP Reward</label>
              <input required type="number" min="1" value={formData.xp} onChange={e => setFormData({...formData, xp: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-env-500 outline-none dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
              <select required value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-env-500 outline-none dark:text-white">
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
              <input required type="date" value={typeof formData.deadline === 'string' ? formData.deadline.split('T')[0] : formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-env-500 outline-none dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-env-500 outline-none dark:text-white">
                <option value="DRAFT">DRAFT</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-env-600 hover:bg-env-700 rounded-xl transition-colors disabled:opacity-50">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {challengeToEdit ? 'Save Changes' : 'Create Challenge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Gamification = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [challengeToEdit, setChallengeToEdit] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null });

  const { data: response, isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => getChallenges({ skip: 0, limit: 100 })
  });

  const deleteMutation = useMutation({
    mutationFn: deleteChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast.success('Challenge deleted successfully');
      setDeleteDialog({ isOpen: false, id: null });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to delete challenge')
  });

  const challenges = response?.data?.items || [];

  const handleEdit = (challenge) => {
    // Reconstruct nested category to flat category_id for the form
    setChallengeToEdit({
      ...challenge,
      category_id: challenge.category.id
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 relative">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Sustainability Challenges
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Complete environmental objectives to earn XP and unlock company-wide badges!
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <button 
            onClick={() => { setChallengeToEdit(null); setIsModalOpen(true); }}
            className="flex items-center justify-center w-10 h-10 bg-env-100 dark:bg-env-900/30 text-env-600 dark:text-env-400 hover:bg-env-200 dark:hover:bg-env-800/40 rounded-xl transition-colors group"
            title="Create Challenge"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <div className="w-px h-10 bg-gray-200 dark:bg-slate-700"></div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Your XP</p>
            <p className="text-2xl font-black text-env-600 dark:text-env-400">0</p>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-slate-700"></div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Rank</p>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">Novice</p>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 animate-pulse"></div>
          ))
        ) : challenges.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
            <Target className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No active challenges</h3>
            <p className="text-gray-500 dark:text-gray-400">Check back later for new sustainability missions!</p>
          </div>
        ) : (
          challenges.map((challenge, index) => (
            <div 
              key={challenge.id}
              className="group relative bg-white dark:bg-slate-800 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glassmorphism Header */}
              <div className="relative h-32 bg-gradient-to-br from-env-500 to-env-700 p-6 overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                  <Shield className="w-32 h-32 text-white" />
                </div>
                
                <div className="relative z-10 flex justify-between items-start">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${difficultyColors[challenge.difficulty]} shadow-sm backdrop-blur-md`}>
                    {challenge.difficulty}
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white font-bold shadow-sm">
                    <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                    {challenge.xp} XP
                  </div>
                </div>
                <h3 className="relative z-10 mt-4 text-xl font-bold text-white leading-tight drop-shadow-md line-clamp-1 pr-12">
                  {challenge.title}
                </h3>

                {/* Admin Actions overlay on hover */}
                <div className="absolute bottom-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => handleEdit(challenge)}
                    className="p-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-lg text-white shadow-sm transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setDeleteDialog({ isOpen: true, id: challenge.id })}
                    className="p-1.5 bg-red-500/80 hover:bg-red-600/90 backdrop-blur-md rounded-lg text-white shadow-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-6 flex-1">
                  {challenge.description || "No description provided for this challenge."}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-gray-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Ends:</span>
                  </div>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {new Date(challenge.deadline).toLocaleDateString()}
                  </span>
                </div>
                
                <button className="mt-6 w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 dark:bg-env-600 dark:hover:bg-env-500 text-white rounded-xl font-bold transition-colors shadow-md flex items-center justify-center gap-2 group-hover:shadow-lg">
                  <Zap className="w-4 h-4" />
                  Accept Challenge
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ChallengeModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setChallengeToEdit(null); }} 
        challengeToEdit={challengeToEdit} 
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Challenge"
        message="Are you sure you want to delete this challenge? This action cannot be undone."
        onConfirm={() => deleteMutation.mutate(deleteDialog.id)}
        onCancel={() => setDeleteDialog({ isOpen: false, id: null })}
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
};

export default Gamification;
