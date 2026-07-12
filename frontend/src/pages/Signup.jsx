import React, { useState, useMemo } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { 
  UserPlus, User, Mail, Building2, Lock, 
  Eye, EyeOff, ShieldAlert, CheckCircle 
} from 'lucide-react';
import InfoBanner from '../components/common/InfoBanner';
import PasswordStrength from '../components/common/PasswordStrength';

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

  // Password match validation
  const passwordsMatch = useMemo(() => {
    if (!confirmPassword) return null;
    return password === confirmPassword;
  }, [password, confirmPassword]);

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
      await authService.signup({
        name,
        email,
        department_id: department,
        password
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
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6 text-[#F8FAFC] font-sans antialiased relative">
      {/* Decorative Glow elements */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#0052CC]/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg bg-[#1E293B] border border-[#334155] rounded-2xl p-8 shadow-2xl relative overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0052CC] text-white shadow-lg shadow-[#0052CC]/25 mb-4">
            <UserPlus className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">Create Account</h2>
          <p className="text-sm text-[#94A3B8] mt-1.5">Join the AssetFlow platform</p>
        </div>

        {/* Info Banner on Role */}
        <InfoBanner variant="info" title="Access Policy Notice" className="mb-6">
          New accounts are registered with the <strong className="text-[#F8FAFC]">Employee</strong> role by default. 
          If your position requires elevated administrative privileges, please contact your workspace administrator after signing up.
        </InfoBanner>

        {/* Error message */}
        {errorMsg && (
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] p-4 rounded-xl text-sm mb-6 flex items-start gap-3 animate-fade-in" role="alert">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Success message */}
        {successMsg && (
          <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] p-4 rounded-xl text-sm mb-6 flex items-start gap-3 animate-fade-in" role="status">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4" noValidate>
          
          {/* Full Name */}
          <div>
            <label htmlFor="signup-name" className="block text-xs uppercase tracking-wider text-[#94A3B8] font-bold mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                placeholder="Alex Carter"
                autoComplete="name"
                className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] pl-11 pr-4 py-2.5 text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 transition-all duration-200 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="signup-email" className="block text-xs uppercase tracking-wider text-[#94A3B8] font-bold mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                placeholder="name@company.com"
                autoComplete="email"
                className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] pl-11 pr-4 py-2.5 text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 transition-all duration-200 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Department Selection */}
          <div>
            <label htmlFor="signup-department" className="block text-xs uppercase tracking-wider text-[#94A3B8] font-bold mb-1.5">
              Department
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              <select
                id="signup-department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] pl-11 pr-4 py-2.5 text-[#F8FAFC] text-sm focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 transition-all duration-200 disabled:opacity-50 cursor-pointer appearance-none"
              >
                <option value="" className="text-[#64748B]">Select Department...</option>
                <option value="01ac9fc8-ec2e-4f13-a7e2-a7f9b14ae717">IT</option>
                <option value="1a922d98-f8cd-4d51-bbaf-875c96735b8d">HR</option>
                <option value="04d6a263-b4e6-4929-8d26-47b3601a2add">Finance</option>
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-3.5 h-3.5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="signup-password" className="block text-xs uppercase tracking-wider text-[#94A3B8] font-bold mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full bg-[#0F172A] border border-[#334155] rounded-[10px] pl-11 pr-12 py-2.5 text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 transition-all duration-200 disabled:opacity-50"
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
            <PasswordStrength password={password} />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="signup-confirm-password" className="block text-xs uppercase tracking-wider text-[#94A3B8] font-bold mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="••••••••"
                autoComplete="new-password"
                className={`w-full bg-[#0F172A] border rounded-[10px] pl-11 pr-12 py-2.5 text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 ${
                  passwordsMatch === false
                    ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20'
                    : passwordsMatch === true
                    ? 'border-[#22C55E] focus:border-[#22C55E] focus:ring-[#22C55E]/20'
                    : 'border-[#334155] focus:border-[#0052CC] focus:ring-[#0052CC]/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-1 rounded"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Match indicator */}
            {passwordsMatch !== null && (
              <p className={`text-[10px] font-semibold mt-1.5 ${passwordsMatch ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {passwordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
              </p>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start pt-1">
            <input
              id="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4 h-4 rounded bg-[#0F172A] border-[#334155] text-[#0052CC] focus:ring-[#0052CC]/25 focus:ring-offset-0 focus:ring-2 mt-0.5"
            />
            <label htmlFor="terms" className="ml-2.5 text-xs text-[#94A3B8] leading-normal select-none font-medium cursor-pointer">
              I certify that this information is correct and agree to the{' '}
              <a href="#terms" onClick={(e) => e.preventDefault()} className="text-[#0052CC] hover:underline font-bold transition-colors">Terms of Service</a>
              {' '}and{' '}
              <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-[#0052CC] hover:underline font-bold transition-colors">Privacy Policy</a>.
            </label>
          </div>

          {/* Signup Button — 48px height */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0052CC] hover:bg-[#2563EB] disabled:bg-[#0052CC]/40 disabled:cursor-not-allowed text-[#F8FAFC] text-sm font-semibold h-12 rounded-xl shadow-lg shadow-[#0052CC]/15 hover:shadow-xl hover:shadow-[#2563EB]/15 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 mt-6"
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
            <Link to="/login" className="text-[#0052CC] hover:text-[#2563EB] font-bold hover:underline transition-colors">
              Sign In
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
  );
}
