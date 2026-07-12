import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Cloud, 
  Activity, 
  Building2, 
  Trophy, 
  AlertTriangle, 
  TrendingUp,
  Loader2
} from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { format } from 'date-fns';
import { useTheme } from '../../contexts/ThemeContext';

const COLORS = ['#10b981', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6', '#14b8a6'];

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: dashboardService.getSummary,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-env-500 animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-900/30 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5" />
        Failed to load dashboard data. Please check your connection.
      </div>
    );
  }

  const { summary, charts, recent_transactions } = data;

  const statCards = [
    { title: 'Total Emissions', value: `${summary.total_emissions.toFixed(2)} CO₂e`, icon: Cloud, color: 'text-env-500 dark:text-env-400', bg: 'bg-env-50 dark:bg-env-900/30' },
    { title: 'Total Transactions', value: summary.total_transactions, icon: Activity, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { title: 'Active Departments', value: summary.active_departments, icon: Building2, color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
    { title: 'Top Department', value: summary.top_department || 'N/A', icon: Trophy, color: 'text-yellow-500 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/30' },
    { title: 'Top Source', value: summary.top_emission_source || 'N/A', icon: AlertTriangle, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/30' },
    { title: 'Avg Emission/Tx', value: `${summary.average_emission_per_transaction.toFixed(2)}`, icon: TrendingUp, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Organization Overview</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 flex flex-col items-start gap-4 transition-colors">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">Emissions by Department</h3>
          {charts.emissions_by_department.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.emissions_by_department} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#f1f5f9'} />
                  <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', color: isDarkMode ? '#ffffff' : '#000000', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="emissions" fill="var(--color-env-500)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400 dark:text-gray-500">No data available</div>
          )}
        </div>

        {/* Donut Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">Emissions by Source</h3>
          {charts.emissions_by_source.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.emissions_by_source}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="emissions"
                    nameKey="source"
                    stroke="none"
                  >
                    {charts.emissions_by_source.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', color: isDarkMode ? '#ffffff' : '#000000', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: isDarkMode ? '#cbd5e1' : '#475569' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400 dark:text-gray-500">No data available</div>
          )}
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Quantity</th>
                <th className="px-6 py-4 font-medium">CO₂e Output</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {recent_transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400 dark:text-gray-500">
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                recent_transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">{tx.department?.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-300">
                        {tx.emission_factor?.source_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {tx.quantity} {tx.emission_factor?.unit}
                    </td>
                    <td className="px-6 py-4 font-semibold text-env-600 dark:text-env-400">
                      {tx.calculated_emission.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-500">
                      {format(new Date(tx.transaction_date), 'MMM dd, yyyy HH:mm')}
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

export default Dashboard;
