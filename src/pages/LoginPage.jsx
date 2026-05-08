import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogIn, FiMail, FiSmartphone } from 'react-icons/fi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { loginWithEmail } from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const { enableViewOnly } = useAuth();

  const [mode, setMode] = useState('email');
  const [email, setEmail] = useState('sanju.gupta@aisglass.com');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials or network error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();

    if (!mobile) {
      setError('Enter mobile number to simulate OTP flow');
      return;
    }

    setError('');
    alert('OTP flow is mock-only in this demo.');
    // TODO: Replace this mock-only OTP flow with Firebase phone auth when production credentials are available.
  };

  const handleViewOnly = () => {
    enableViewOnly();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-black to-navy px-4">
      <div className="w-full max-w-xl glass-effect p-8">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="h-10 w-10 rounded-full bg-teal/20 flex items-center justify-center">
            <FiLogIn className="text-teal text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">AIS Channel Management KPI Dashboard</h1>
            <p className="text-xs text-teal/80">AIS Windows – Channel Management | 16 KPI modules</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleViewOnly}
          className="w-full mb-4 bg-teal/20 hover:bg-teal/30 text-teal font-medium py-2.5 rounded flex items-center justify-center gap-2 transition-colors"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-teal/60">
            <FaEyeSlash className="text-sm" />
          </span>
          <span>View Without Login (Read Only)</span>
        </button>

        <div className="flex mb-4 rounded-full bg-navy/60 p-1">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded-full transition ${
              mode === 'email' ? 'bg-teal text-navy font-semibold' : 'text-teal/70'
            }`}
            onClick={() => setMode('email')}
          >
            <FiMail />
            Email / Password
          </button>
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded-full transition ${
              mode === 'otp' ? 'bg-teal text-navy font-semibold' : 'text-teal/70'
            }`}
            onClick={() => setMode('otp')}
          >
            <FiSmartphone />
            Mobile OTP (Mock)
          </button>
        </div>

        {error && <div className="mb-3 text-xs text-red-400 bg-red-500/10 border border-red-500/40 px-3 py-2 rounded">{error}</div>}

        {mode === 'email' ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-teal/70 mb-1">Official Email</label>
              <input
                type="email"
                className="w-full glass-input px-3 py-2 rounded text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sanju.gupta@aisglass.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-teal/70 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full glass-input px-3 py-2 rounded text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-teal/80 hover:text-teal"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-teal hover:bg-teal/90 text-navy font-semibold py-2.5 rounded flex items-center justify-center gap-2 text-sm disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <FiLogIn />
                  Sign In
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-teal/70 mb-1">Mobile Number</label>
              <input
                type="tel"
                className="w-full glass-input px-3 py-2 rounded text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91-XXXXXXXXXX"
              />
            </div>

            <div>
              <label className="block text-xs text-teal/70 mb-1">OTP (Mock UI only)</label>
              <input
                type="text"
                className="w-full glass-input px-3 py-2 rounded text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
              />
            </div>

            <button type="submit" className="w-full mt-2 bg-teal/40 text-teal font-semibold py-2.5 rounded text-sm cursor-not-allowed">
              OTP Login (Demo only)
            </button>
          </form>
        )}

        <p className="mt-6 text-[11px] text-center text-teal/60">
          Pre-configured user: <span className="text-teal">sanju.gupta@aisglass.com</span> (create in Firebase Auth).
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
