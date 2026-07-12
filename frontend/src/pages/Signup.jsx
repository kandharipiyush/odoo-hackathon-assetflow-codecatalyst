import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { LogIn, Key, Eye, EyeOff, ShieldAlert, CheckCircle, Info } from 'lucide-react';

export default function Signup() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Email validation helper
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (!email) {
      setErrorMsg('Email address is required.');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address (e.g. name@company.com).');
      return;
    }
    if (!department) {
      setErrorMsg('Please select your department.');
      return;
    }
    if (!password) {
      setErrorMsg('Password is required.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Sign up mock payload - Always defaults to Employee role as per strict requirements
      await authService.signup({
        name,
        email,
        department,
        password,
        role: 'Employee' 
      });

      setSuccessMsg('Account created successfully! Redirecting to login...');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Signup failed. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 text-[#F8FAFC] font-sans antialiased relative">
      {/* Decorative Glow elements */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#0052CC]/5 blur-[80px]" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-500/5 blur-[100px]" />

      <div className="w-full max-w-lg bg-[#1E293B] border border-[#334155] rounded-[16px] p-8 shadow-2xl relative overflow-hidden transition-all duration-200 hover:shadow-[#0052CC]/5">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0052CC] text-white shadow-lg shadow-[#0052CC]/25 mb-4">
            <LogIn className="w-6 h-6 rotate-180" />
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">Create Account</h2>
          <p className="text-sm text-[#94A3B8] mt-1.5">Join the AssetFlow platform</p>
        </div>

        {/* Info Banner on Role */}
        <div className="bg-[#0052CC]/10 border border-[#0052CC]/30 text-[#F8FAFC] p-4 rounded-[10px] text-xs mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#0052CC]" />
          <div>
            <span className="font-bold text-[#F8FAFC]">Access Policy Notice:</span>
            <p className="text-[#94A3B8] mt-1 leading-relaxed">
              New accounts are registered with the <strong className="text-[#F8FAFC]">Employee</strong> role by default. If your position requires elevated administrative privileges, please contact your workspace administrator after signing up.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] p-4 rounded-[10px] text-sm mb-6 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] p-4 rounded-[10px] text-sm mb-6 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#94A3B8] font-bold mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              placeholder="Alex Carter"
              className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] px-4 py-2.5 text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 transition-all duration-200 disabled:opacity-50"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#94A3B8] font-bold mb-1.5">
              Work Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              placeholder="name@company.com"
              className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] px-4 py-2.5 text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 transition-all duration-200 disabled:opacity-50"
            />
          </div>

          {/* Department Selection */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#94A3B8] font-bold mb-1.5">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] px-4 py-2.5 text-[#F8FAFC] text-sm focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              <option value="" className="text-[#64748B]">Select Department...</option>
              <option value="Engineering" className="text-[#F8FAFC]">Engineering</option>
              <option value="Operations" className="text-[#F8FAFC]">Operations</option>
              <option value="IT Support" className="text-[#F8FAFC]">IT Support</option>
              <option value="HR" className="text-[#F8FAFC]">HR / Recruitment</option>
              <option value="Finance" className="text-[#F8FAFC]">Finance & Legal</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#94A3B8] font-bold mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="••••••••"
                className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] pl-4 pr-11 py-2.5 text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 transition-all duration-200 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-1 rounded"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#94A3B8] font-bold mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="••••••••"
                className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] pl-4 pr-11 py-2.5 text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 transition-all duration-200 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-1 rounded"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start pt-1">
            <input
              id="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4.5 h-4.5 rounded-[4px] bg-[#0F172A] border-[#334155] text-[#0052CC] focus:ring-[#0052CC]/25 focus:ring-offset-0 focus:ring-2 mt-0.5"
            />
            <label htmlFor="terms" className="ml-2.5 text-xs text-[#94A3B8] leading-normal select-none font-medium">
              I certify that this information is correct and agree to the{' '}
              <a href="#terms" onClick={(e) => e.preventDefault()} className="text-[#0052CC] hover:underline font-bold">Terms of Service</a>
              {' '}and{' '}
              <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-[#0052CC] hover:underline font-bold">Privacy Policy</a>.
            </label>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0052CC] hover:bg-[#2563EB] disabled:bg-[#0052CC]/40 text-[#F8FAFC] text-sm font-semibold py-3 rounded-[12px] shadow-lg shadow-[#0052CC]/15 hover:shadow-xl hover:shadow-[#2563EB]/15 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 mt-6"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Link to Login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#94A3B8]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0052CC] hover:text-[#2563EB] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
