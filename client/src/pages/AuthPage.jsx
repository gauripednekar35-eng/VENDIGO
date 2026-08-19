import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth, googleProvider, signInWithPopup, isFirebaseConfigured } from '../firebase';
import { Mail, Lock, User, Phone, ArrowRight, Loader, Store, UserCheck, PhoneCall } from 'lucide-react';
import { VindigoLogo } from '../components/common/VindigoLogo';

export const AuthPage = ({ onAuthSuccess }) => {
  const { login, register, showToast } = useAuth();
  
  const [step, setStep] = useState('welcome');
  const [role, setRole] = useState('customer');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured) {
      showToast('Google Sign-In using demo account...', 'info');
      const res = await login('customer@vendigo.com', 'customer123', 'customer');
      if (res?.success && onAuthSuccess) onAuthSuccess(res.user?.role || 'customer');
      return;
    }

    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;
      
      const res = await register({
        name: googleUser.displayName || 'Google User',
        email: googleUser.email,
        password: googleUser.uid,
        phone: googleUser.phoneNumber || '',
        role: role,
        address: 'Bangalore, India'
      });

      if (res?.success && onAuthSuccess) {
        onAuthSuccess(res.user?.role || role);
      }
    } catch (err) {
      console.error('Google Sign In error:', err);
      showToast('Google Sign-In failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let result;
      if (step === 'register-form') {
        result = await register({ name, email, password, phone, role, address });
      } else {
        result = await login(email, password, role);
      }
      if (result?.success && onAuthSuccess) {
        onAuthSuccess(result.user?.role || role);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex items-center justify-center p-4">
      <div className="bg-[#1E293B] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-700 shadow-2xl animate-fade-in my-6">

        {/* STEP 1: WELCOME SCREEN */}
        {step === 'welcome' && (
          <div className="space-y-6 text-center">
            <div className="flex flex-col items-center justify-center">
              <VindigoLogo size="lg" showTagline={true} className="flex-col space-x-0 space-y-2" />
            </div>

            {/* Food Stall Image */}
            <div className="relative py-2">
              <div className="w-full h-44 rounded-2xl bg-dark-surface border border-slate-800/80 flex items-center justify-center overflow-hidden shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80"
                  alt="Street Food Stall"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent flex items-end justify-center pb-3">
                  <span className="text-white text-xs font-bold tracking-wider uppercase bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30">
                    Authentic Local Food
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setStep('login-form')}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-emerald-glow transition-all flex items-center justify-center space-x-2"
              >
                <span>Login</span>
              </button>

              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-dark-surface hover:bg-slate-800 text-slate-200 border border-slate-700/60 text-xs font-bold transition-all flex items-center justify-center space-x-3"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                onClick={() => setStep('register-form')}
                className="w-full py-3 rounded-2xl bg-dark-surface hover:bg-slate-800 text-slate-200 border border-slate-700/60 text-xs font-bold transition-all flex items-center justify-center space-x-3"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Continue with Phone</span>
              </button>
            </div>

            <div className="pt-2">
              <p className="text-xs text-slate-400 font-medium">
                Don't have an account?{' '}
                <button
                  onClick={() => setStep('role-select')}
                  className="font-bold text-orange hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: ROLE SELECTOR */}
        {step === 'role-select' && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-white">Register as</h2>
              <p className="text-xs text-slate-400">Choose how you want to join VINDIGO</p>
            </div>

            <div className="space-y-4 pt-2">
              <div
                onClick={() => {
                  setRole('vendor');
                  setStep('register-form');
                }}
                className="p-5 rounded-2xl border border-slate-800/80 hover:border-emerald-500/50 bg-dark-surface cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400">Vendor</h3>
                    <p className="text-xs text-slate-400">Register your food stall</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transform group-hover:translate-x-1 transition-all" />
              </div>

              <div
                onClick={() => {
                  setRole('customer');
                  setStep('register-form');
                }}
                className="p-5 rounded-2xl border border-slate-800/80 hover:border-orange/50 bg-dark-surface cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange/10 text-orange flex items-center justify-center font-bold">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-orange">Customer</h3>
                    <p className="text-xs text-slate-400">Explore street food near you</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-orange transform group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setStep('welcome')}
                className="text-xs font-bold text-slate-400 hover:text-white"
              >
                ← Back to welcome screen
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: FORM */}
        {(step === 'register-form' || step === 'login-form') && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center space-y-1 pb-2">
              <h2 className="text-2xl font-bold text-white">
                {step === 'register-form' ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-slate-400">
                {step === 'register-form' ? `Sign up as a ${role.toUpperCase()}` : 'Enter your details'}
              </p>
            </div>

            <div className="flex bg-dark-surface p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  role === 'customer' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('vendor')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  role === 'vendor' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400'
                }`}
              >
                Vendor
              </button>
            </div>

            {step === 'register-form' && (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-3 rounded-xl bg-dark-surface border border-slate-700/60 text-white focus:outline-none focus:border-emerald-500 font-medium"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-3 rounded-xl bg-dark-surface border border-slate-700/60 text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {step === 'register-form' && (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Phone</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-3 rounded-xl bg-dark-surface border border-slate-700/60 text-white focus:outline-none focus:border-emerald-500 font-medium"
                  />
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-3 rounded-xl bg-dark-surface border border-slate-700/60 text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-glow transition-all flex items-center justify-center space-x-2 disabled:opacity-60 mt-4"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <span>{step === 'register-form' ? 'Sign Up' : 'Log In'}</span>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setStep(step === 'register-form' ? 'login-form' : 'role-select')}
                className="text-xs font-bold text-orange hover:underline"
              >
                {step === 'register-form'
                  ? 'Already have an account? Log in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
