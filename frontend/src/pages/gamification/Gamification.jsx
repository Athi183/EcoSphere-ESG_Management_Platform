import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trophy, Star, Clock, Target, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getChallenges, createChallenge, updateChallenge, deleteChallenge } from '../../services/challengeService';
import { getCategories } from '../../services/categoryService';
import { getBadges, getLeaderboard, joinChallenge } from '../../services/gamificationService';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const statusConfig = {
  DRAFT: { label: 'Draft', color: 'border-gray-400 bg-gray-50 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300', pill: 'bg-white border-gray-300 text-gray-600 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-300' },
  ACTIVE: { label: 'Active', color: 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:border-green-500/50 dark:text-green-400', pill: 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-500/50 dark:text-green-400' },
  COMPLETED: { label: 'Completed', color: 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500/50 dark:text-blue-400', pill: 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500/50 dark:text-blue-400' },
  UNDER_REVIEW: { label: 'Under Review', color: 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:border-purple-500/50 dark:text-purple-400', pill: 'bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900/30 dark:border-purple-500/50 dark:text-purple-400' },
  ARCHIVED: { label: 'Archived', color: 'border-slate-400 bg-slate-50 text-slate-700 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300', pill: 'bg-slate-100 border-slate-400 text-slate-700 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300' }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {challengeToEdit ? 'Edit Challenge' : 'Create Challenge'}
          </h2>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">XP Reward</label>
              <input required type="number" min="1" value={formData.xp} onChange={e => setFormData({...formData, xp: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-env-500 outline-none text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
              <select required value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-env-500 outline-none text-gray-900 dark:text-white">
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
              <input required type="date" value={typeof formData.deadline === 'string' ? formData.deadline.split('T')[0] : formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-env-500 outline-none text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-env-500 outline-none text-gray-900 dark:text-white">
                <option value="DRAFT">DRAFT</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-env-600 hover:bg-env-700 rounded-lg transition-colors disabled:opacity-50">
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
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Join Modal State
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedChallengeToJoin, setSelectedChallengeToJoin] = useState(null);
  const [proofUrl, setProofUrl] = useState('');

  const { data: challengesData, isLoading, refetch } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => getChallenges({ skip: 0, limit: 100 }),
  });

  const { data: badgesResponse } = useQuery({ queryKey: ['badges'], queryFn: getBadges });
  const { data: leaderboardResponse } = useQuery({ queryKey: ['leaderboard'], queryFn: getLeaderboard });

  const joinMutation = useMutation({
    mutationFn: joinChallenge,
    onSuccess: () => {
      toast.success('Successfully joined the challenge!');
      setIsJoinModalOpen(false);
      setProofUrl('');
      setSelectedChallengeToJoin(null);
    },
    onError: () => {
      toast.error('Failed to join challenge. Please try again.');
    }
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

  const allChallenges = challengesData?.data?.items || [];
  const challenges = statusFilter === 'ALL' ? allChallenges : allChallenges.filter(c => c.status === statusFilter);

  const handleEdit = (challenge) => {
    setChallengeToEdit({
      ...challenge,
      category_id: challenge.category.id
    });
    setIsModalOpen(true);
  };

  const pipelineStages = ['DRAFT', 'ACTIVE', 'UNDER_REVIEW', 'COMPLETED', 'ARCHIVED'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Main Content Area */}
      <div className="space-y-6 pt-2">
        
        {/* Top Actions & Pipeline */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <button 
            onClick={() => { setChallengeToEdit(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-env-600 hover:bg-env-700 text-white rounded-lg font-bold transition-colors shrink-0 shadow-sm"
          >
            + New Challenge
          </button>
          
          <div className="flex-1 overflow-x-auto pb-2 md:pb-0">
            <div className="flex items-center gap-2 min-w-max">
              <button 
                onClick={() => setStatusFilter('ALL')}
                className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-colors ${statusFilter === 'ALL' ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900 dark:border-white' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
              >
                All
              </button>
              
              {pipelineStages.map((stage, idx) => {
                const config = statusConfig[stage];
                const isActive = statusFilter === stage;
                return (
                  <React.Fragment key={stage}>
                    <button
                      onClick={() => setStatusFilter(stage)}
                      className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-colors ${isActive ? config.color : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                    >
                      {config.label}
                    </button>
                    {idx < pipelineStages.length - 1 && (
                      <div className="text-gray-300 dark:text-slate-600">→</div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
            ))
          ) : challenges.length === 0 ? (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl">
              <Target className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No challenges found</h3>
              <p className="text-gray-500 dark:text-gray-400">Create a new challenge to get started.</p>
            </div>
          ) : (
            challenges.map((challenge) => {
              const pillConfig = statusConfig[challenge.status] || statusConfig.DRAFT;
              return (
                <div 
                  key={challenge.id}
                  className="group relative bg-white dark:bg-slate-800 rounded-2xl p-5 border-2 border-env-500/20 hover:border-env-500 hover:shadow-lg transition-all flex flex-col"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-blue-500" />
                      {challenge.title}
                    </h3>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                    XP: {challenge.xp} - {challenge.difficulty}
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Deadline: {new Date(challenge.deadline).toLocaleDateString()}
                  </div>

                  <div className="mb-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${pillConfig.pill}`}>
                      {pillConfig.label}
                    </span>
                  </div>
                  
                  <div className="mt-auto pt-4 flex justify-between items-center">
                    <button 
                      onClick={() => {
                        setSelectedChallengeToJoin(challenge);
                        setIsJoinModalOpen(true);
                      }}
                      className="px-6 py-2 bg-env-600 hover:bg-env-700 text-white rounded-lg font-bold transition-colors w-1/2"
                    >
                      Join Challenge
                    </button>
                    
                    {/* Admin Actions */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(challenge)}
                        className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteDialog({ isOpen: true, id: challenge.id })}
                        className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Dynamic Modules: Badge Gallery & Leaderboard */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Badge Gallery */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-env-500" />
            Badge Gallery
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {badgesResponse?.map(badge => (
              <div key={badge.id} className="bg-env-50/50 dark:bg-env-900/20 border border-env-200 dark:border-env-500/30 rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-env-100 dark:bg-env-900/50 flex items-center justify-center shrink-0">{badge.icon || '🏆'}</div>
                <span className="font-semibold text-env-700 dark:text-env-400 text-sm">{badge.name}</span>
              </div>
            ))}
            {(!badgesResponse || badgesResponse.length === 0) && (
              <p className="text-gray-500 dark:text-gray-400 text-sm col-span-2">No badges earned yet.</p>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-red-500" />
            Leaderboard
          </h2>
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-100 dark:border-slate-700">
              <tr>
                <th className="pb-3">Rank</th>
                <th className="pb-3">Employee/Dept</th>
                <th className="pb-3 text-right">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
              {leaderboardResponse?.map((entry) => (
                <tr key={entry.user_id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-3 font-bold text-gray-900 dark:text-white">{entry.rank}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">{entry.full_name} <span className="text-xs text-gray-400 dark:text-gray-500">({entry.department})</span></td>
                  <td className="py-3 text-right font-semibold text-gray-900 dark:text-white">{entry.total_xp.toLocaleString()}</td>
                </tr>
              ))}
              {(!leaderboardResponse || leaderboardResponse.length === 0) && (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-gray-500 dark:text-gray-400 text-sm">No leaderboard data available yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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

      {/* Join Challenge Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Submit Challenge Proof</h2>
              <button onClick={() => { setIsJoinModalOpen(false); setSelectedChallengeToJoin(null); }} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You are joining: <span className="font-bold">{selectedChallengeToJoin?.title}</span>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Proof URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="Link to your photo, document, or post"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-env-500 focus:border-env-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => { setIsJoinModalOpen(false); setSelectedChallengeToJoin(null); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={joinMutation.isPending}
                onClick={() => joinMutation.mutate({ challenge_id: selectedChallengeToJoin?.id, proof_url: proofUrl })}
                className="px-4 py-2 text-sm font-medium text-white bg-env-600 border border-transparent rounded-lg hover:bg-env-700 focus:ring-2 focus:ring-offset-2 focus:ring-env-500 disabled:opacity-50 flex items-center gap-2"
              >
                {joinMutation.isPending ? 'Submitting...' : 'Submit Proof'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gamification;
