
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AdminStats, LogEntry, QueueJob } from '../types';
import { Users, Activity, AlertTriangle, Database, Shield, Server, RefreshCw } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [queues, setQueues] = useState<QueueJob[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs' | 'queues'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, logsRes, queuesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/logs'),
        api.get('/admin/queues')
      ]);
      setStats(statsRes.data);
      setLogs(logsRes.data);
      setQueues(queuesRes.data);
    } catch (error) {
      console.error("Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <div className="p-8 text-center">Loading Admin Panel...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Shield className="mr-2 text-red-600" />
          Admin Control Center
        </h1>
        <button 
          onClick={fetchData}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <TabButton label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <TabButton label="User Management" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
        <TabButton label="System Logs" active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
        <TabButton label="Job Queues" active={activeTab === 'queues'} onClick={() => setActiveTab('queues')} />
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={stats.totalUsers} icon={<Users className="text-blue-500" />} />
            <StatCard label="Active Sessions" value={stats.activeUsers} icon={<Activity className="text-green-500" />} />
            <StatCard label="Total Generations" value={stats.totalGenerations} icon={<Database className="text-purple-500" />} />
            <StatCard label="System Health" value={stats.systemHealth} icon={<Server className="text-red-500" />} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-4">Recent Activity Logs</h3>
                <div className="space-y-3">
                    {logs.slice(0, 5).map(log => (
                        <div key={log.id} className="flex items-start text-sm border-b border-gray-100 pb-2">
                            <span className={`px-2 py-0.5 rounded text-xs mr-2 ${log.level === 'error' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                {log.level.toUpperCase()}
                            </span>
                            <div>
                                <p className="font-medium text-gray-900">{log.action}</p>
                                <p className="text-gray-500 text-xs">{new Date(log.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 font-medium">
                    <tr>
                        <th className="p-4">Timestamp</th>
                        <th className="p-4">Level</th>
                        <th className="p-4">Action</th>
                        <th className="p-4">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log.id} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="p-4 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                                    log.level === 'error' ? 'bg-red-100 text-red-700' : 
                                    log.level === 'warn' ? 'bg-yellow-100 text-yellow-700' : 
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                    {log.level.toUpperCase()}
                                </span>
                            </td>
                            <td className="p-4 font-medium">{log.action}</td>
                            <td className="p-4 text-gray-600 truncate max-w-xs">{log.details}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}

      {/* Queues Tab */}
      {activeTab === 'queues' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
            <h3 className="text-lg font-bold mb-4">Background Worker Status</h3>
            <div className="grid gap-4">
                {queues.map(job => (
                    <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                            <p className="font-bold text-gray-800">{job.type}</p>
                            <p className="text-xs text-gray-500">Job ID: {job.id}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-32 bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${job.progress}%` }}></div>
                            </div>
                            <span className={`px-3 py-1 text-xs rounded-full font-bold ${
                                job.status === 'completed' ? 'bg-green-100 text-green-700' :
                                job.status === 'active' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                                {job.status.toUpperCase()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
      
       {/* Users Tab Placeholder */}
       {activeTab === 'users' && (
          <div className="bg-white p-8 text-center rounded-xl border border-gray-200 text-gray-500">
              User Management Table (Mock Data Only)
          </div>
       )}
    </div>
  );
};

const StatCard = ({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
        <div>
            <p className="text-gray-500 text-sm font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
    </div>
);

const TabButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            active ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
    >
        {label}
    </button>
);
