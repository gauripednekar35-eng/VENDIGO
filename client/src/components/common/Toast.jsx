import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useAuth();

  if (!toastMessage) return null;

  const { message, type } = toastMessage;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center space-x-3 text-xs font-bold text-white ${
        type === 'error' ? 'bg-red-600 border-red-500' :
        type === 'info' ? 'bg-slate-900 border-slate-700' :
        'bg-primary border-primary-light'
      }`}>
        {type === 'error' && <AlertCircle className="w-5 h-5 text-white" />}
        {type === 'info' && <Info className="w-5 h-5 text-amber-400" />}
        {type === 'success' && <CheckCircle2 className="w-5 h-5 text-white" />}
        <span>{message}</span>
      </div>
    </div>
  );
};
