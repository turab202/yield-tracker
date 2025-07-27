import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = ({ darkMode = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);
    if (success) navigate('/');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-tr from-green-100 via-green-200 to-green-300'
    } px-4`}>
      <div className={`max-w-md w-full p-10 rounded-2xl shadow-2xl border ${
        darkMode ? 'bg-gray-800 border-green-700' : 'bg-white border-green-300'
      }`}>
        <h2 className={`text-3xl font-extrabold text-center mb-8 ${
          darkMode ? 'text-green-400' : 'text-green-800'
        } tracking-wide`}>Welcome Back</h2>
        {error && <p className="text-red-600 text-sm text-center mb-6 font-semibold animate-pulse">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email" placeholder="Email Address"
            className={`w-full px-4 py-3 rounded-xl border placeholder-green-600 text-green-900 focus:outline-none focus:ring-4 transition ${
              darkMode ? 'bg-gray-700 border-green-600 text-white focus:ring-green-500' : 'bg-green-50 border-green-400'
            }`}
            value={email} onChange={e => setEmail(e.target.value)} required />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              className={`w-full px-4 py-3 rounded-xl border placeholder-green-600 text-green-900 focus:outline-none focus:ring-4 transition ${
                darkMode ? 'bg-gray-700 border-green-600 text-white focus:ring-green-500' : 'bg-green-50 border-green-400'
              }`}
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-800 active:scale-95 transition-transform duration-150 shadow-lg"
          >
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className={`mt-6 text-center text-sm tracking-wide ${
          darkMode ? 'text-green-300' : 'text-green-900'
        }`}>
          Don't have an account? <Link to="/register" className="font-semibold text-green-700 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;