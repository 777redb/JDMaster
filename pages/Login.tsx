
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, Lock, Mail, ShieldCheck, Terminal } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'attorney' | 'admin'>('student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name, role);
      }
      // Redirect handled by AuthContext state change in App.tsx
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillAdmin = () => {
    setIsLogin(true);
    setEmail('admin@legalph.com');
    setPassword('admin');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-8 bg-gray-50 border-b border-gray-200 text-center">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
             <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">LegalPH</h1>
          <p className="text-gray-500 text-sm mt-1">Enterprise AI Legal Assistant</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
                    placeholder="Juan Dela Cruz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <ShieldCheck className="absolute left-3 top-3 text-gray-400" size={18} />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
                  placeholder="attorney@law.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 rounded-lg text-xs font-medium border ${role === 'student' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Law Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('attorney')}
                    className={`py-2 rounded-lg text-xs font-medium border ${role === 'attorney' ? 'bg-blue-50 border-blue-500 text-blue-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Attorney
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 rounded-lg text-xs font-medium border ${role === 'admin' ? 'bg-red-50 border-red-500 text-red-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Admin (Dev)
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm text-yellow-600 hover:text-yellow-700 font-medium hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          {/* Dev Ops Panel */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="bg-gray-800 rounded-lg p-4 text-left">
              <div className="flex items-center text-yellow-500 mb-2">
                <Terminal size={16} className="mr-2" />
                <span className="text-xs font-bold uppercase tracking-wider">Dev Ops Access</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  <p>User: <span className="text-gray-300 font-mono">admin@legalph.com</span></p>
                  <p>Pass: <span className="text-gray-300 font-mono">admin</span></p>
                </div>
                <button
                  type="button"
                  onClick={fillAdmin}
                  className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-bold rounded transition-colors"
                >
                  Auto-fill
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
