import React, { useState } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutGrid, Mail, Lock, Eye, EyeOff, ShieldAlert, 
  Monitor, Activity, Users, ArrowRight 
} from 'lucide-react';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to the path they came from or home
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  // Email validation regex
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleFormLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!email) {
      setErrorMsg('Email address is required.');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address (e.g. name@company.com).');
      return;
    }
    if (!password) {
      setErrorMsg('Password is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (mockEmail) => {
    setIsSubmitting(true);
    setErrorMsg('');
    setInfoMsg('');
    try {
      await login({ email: mockEmail, password: 'password' });
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Quick login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setInfoMsg('Demo System: Please contact your IT administrator to reset credentials.');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col md:flex-row text-[#F8FAFC] font-sans antialiased">
      
      {/* Left Branding Panel (Desktop Only) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#111827] via-[#0F172A] to-[#1E293B] p-12 flex-col justify-between border-r border-[#334155] relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-[#0052CC]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[100px]" />
        
        {/* Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-[#0052CC] flex items-center justify-center shadow-lg shadow-[#0052CC]/25">
            <LayoutGrid className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#F8FAFC] to-[#94A3B8] bg-clip-text text-transparent">
            AssetFlow
          </span>
        </div>

        {/* Feature Highlights */}
        <div className="my-auto space-y-8 relative z-10 max-w-lg">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#0052CC] font-bold">
              Enterprise Resource Planning
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Manage your corporate assets with precision.
            </h1>
            <p className="text-[#94A3B8] text-base leading-relaxed">
              Track lifecycle, streamline maintenance operations, automate room/hardware bookings, and manage compliance audits from a unified control center.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#334155]/60">
            {[
              { icon: Monitor, color: 'text-emerald-500', title: 'Asset Registry', desc: 'Real-time status tracking' },
              { icon: Activity, color: 'text-[#0052CC]', title: 'Maintenance', desc: 'Preventive schedules' },
              { icon: Users, color: 'text-amber-500', title: 'RBAC Permissions', desc: 'Role-based controls' },
            ].map(({ icon: FeatureIcon, color, title, desc }) => (
              <div key={title}>
                <div className={`${color} mb-1.5`}>
                  <FeatureIcon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h4 className="text-sm font-semibold text-[#F8FAFC]">{title}</h4>
                <p className="text-xs text-[#94A3B8] mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-[#94A3B8] relative z-10 flex justify-between items-center">
          <span>AssetFlow ERP © {new Date().getFullYear()}</span>
          <span className="px-2.5 py-1 rounded-full bg-[#1E293B] border border-[#334155] text-[10px]">
            v2.1.0-prod
          </span>
        </div>
      </div>

      {/* Right Login Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">
        {/* Mobile logo */}
        <div className="absolute top-8 left-6 md:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0052CC] flex items-center justify-center">
            <LayoutGrid className="w-3.5 h-3.5 text-white" aria-hidden="true" />
          </div>
          <span className="text-sm font-bold text-[#F8FAFC]">AssetFlow</span>
        </div>

        <div className="w-full max-w-[480px] bg-[#1E293B] border border-[#334155] rounded-2xl p-8 shadow-2xl relative overflow-hidden transition-all duration-200">
          {/* Card header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">Sign In</h2>
            <p className="text-sm text-[#94A3B8] mt-1.5 font-medium">
              Access the AssetFlow workspace console
            </p>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] p-4 rounded-xl text-sm mb-6 flex items-start gap-3 animate-fade-in" role="alert">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Info message (for forgot password) */}
          {infoMsg && (
            <div className="bg-[#0052CC]/10 border border-[#0052CC]/30 text-[#94A3B8] p-4 rounded-xl text-sm mb-6 flex items-start gap-3 animate-fade-in" role="status">
              <Mail className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#0052CC]" aria-hidden="true" />
              <span className="font-medium">{infoMsg}</span>
            </div>
          )}

          <form onSubmit={handleFormLogin} className="space-y-5" noValidate>
            {/* Email Field */}
            <div>
              <label htmlFor="login-email" className="block text-xs uppercase tracking-wider text-[#94A3B8] font-bold mb-2">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] pl-11 pr-4 py-3 text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 transition-all duration-200 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="login-password" className="block text-xs uppercase tracking-wider text-[#94A3B8] font-bold">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-[#0052CC] hover:text-[#2563EB] hover:underline font-semibold transition-all duration-200"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] pl-11 pr-12 py-3 text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 transition-all duration-200 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-1 rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-[#0F172A] border-[#334155] text-[#0052CC] focus:ring-[#0052CC]/25 focus:ring-offset-0 focus:ring-2"
              />
              <label htmlFor="remember-me" className="ml-2.5 text-sm text-[#94A3B8] select-none font-medium cursor-pointer">
                Remember me on this machine
              </label>
            </div>

            {/* Submit Button — 48px height */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0052CC] hover:bg-[#2563EB] disabled:bg-[#0052CC]/40 disabled:cursor-not-allowed text-[#F8FAFC] text-sm font-semibold h-12 rounded-xl shadow-lg shadow-[#0052CC]/15 hover:shadow-xl hover:shadow-[#2563EB]/15 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Link to Signup */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#94A3B8]">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-[#0052CC] hover:text-[#2563EB] font-bold hover:underline transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer branding */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#64748B] font-medium">
            AssetFlow · Enterprise Asset & Resource Management
          </p>
        </div>
      </div>
    </div>
  );
}
