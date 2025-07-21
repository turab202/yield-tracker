import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = ({ darkMode = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
          <input
            type="password" placeholder="Password"
            className={`w-full px-4 py-3 rounded-xl border placeholder-green-600 text-green-900 focus:outline-none focus:ring-4 transition ${
              darkMode ? 'bg-gray-700 border-green-600 text-white focus:ring-green-500' : 'bg-green-50 border-green-400'
            }`}
            value={password} onChange={e => setPassword(e.target.value)} required />
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
          Don’t have an account? <Link to="/register" className="font-semibold text-green-700 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
