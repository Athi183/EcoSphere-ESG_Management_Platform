import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '../../services/reportService';
import api from '../../services/api';
import ReactMarkdown from 'react-markdown';
import { AlertTriangle, Loader2, Sparkles, RefreshCw, CheckCircle2, TrendingUp, ShieldAlert, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const Reports = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState('summary');
  const [aiReport, setAiReport] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const { data: envData, isLoading: envLoading } = useQuery({ queryKey: ['envReport'], queryFn: reportService.getEnvironmental });
  const { data: socData, isLoading: socLoading } = useQuery({ queryKey: ['socReport'], queryFn: reportService.getSocial });
  const { data: govData, isLoading: govLoading } = useQuery({ queryKey: ['govReport'], queryFn: reportService.getGovernance });
  const { data: summaryData, isLoading: summaryLoading } = useQuery({ queryKey: ['esgSummary'], queryFn: reportService.getEsgSummary });

  const tabs = [
    { id: 'environmental', label: 'Environmental' },
    { id: 'social', label: 'Social' },
    { id: 'governance', label: 'Governance' },
    { id: 'summary', label: 'ESG Summary' },
  ];

  const handleGenerateAI = async () => {
    if (!summaryData) return;
    setIsGeneratingAI(true);
    try {
      const response = await api.post('/ai/chat', {
        message: 'executive_report',
        report_context: summaryData
      });
      if (response.data.success) {
        setAiReport(response.data.data.response);
        toast.success("Executive AI Report generated!");
      } else {
        toast.error("Unable to generate executive report. Please try again.");
      }
    } catch (err) {
      toast.error("Unable to generate executive report. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Reports Module</h1>
          <p className="text-gray-500 dark:text-gray-400">View and analyze comprehensive ESG reports.</p>
        </div>
      </div>

      <div className="flex border-b border-gray-200 dark:border-slate-700 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-3 px-6 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-env-500 text-env-600 dark:text-env-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'environmental' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
            {envLoading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin w-8 h-8 text-env-500" /></div> : (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Environmental Data</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Emissions</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{envData?.summary?.total_emissions?.toFixed(2) || 0} kg CO₂</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Top Emission Source</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{envData?.summary?.top_emission_source || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'social' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
            {socLoading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin w-8 h-8 text-env-500" /></div> : (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Social Data</h2>
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Planned</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{socData?.summary?.planned || 0}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ongoing</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{socData?.summary?.ongoing || 0}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                    <p className="text-xl font-bold text-env-600 dark:text-env-400">{socData?.summary?.completed || 0}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cancelled</p>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">{socData?.summary?.cancelled || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'governance' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
            {govLoading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin w-8 h-8 text-env-500" /></div> : (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Governance Data</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Draft Policies</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{govData?.summary?.draft || 0}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Policies</p>
                    <p className="text-xl font-bold text-env-600 dark:text-env-400">{govData?.summary?.active || 0}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Archived Policies</p>
                    <p className="text-xl font-bold text-gray-500 dark:text-gray-400">{govData?.summary?.archived || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">ESG Summary Report</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Aggregated data across Environmental, Social, and Governance pillars.</p>
              </div>
              <button
                onClick={handleGenerateAI}
                disabled={isGeneratingAI || summaryLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGeneratingAI ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Generating Executive Report...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Generate AI Insights</>
                )}
              </button>
            </div>

            {aiReport && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 p-6 rounded-xl shadow-lg border border-indigo-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-6 border-b border-indigo-200 dark:border-slate-700 pb-4">
                  <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                    AI Executive ESG Report
                  </h3>
                  <button
                    onClick={handleGenerateAI}
                    disabled={isGeneratingAI}
                    className="flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                    Regenerate Analysis
                  </button>
                </div>
                
                <div className="prose prose-indigo dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-indigo-900 dark:prose-headings:text-indigo-300 prose-li:marker:text-indigo-500">
                  <ReactMarkdown>{aiReport}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
