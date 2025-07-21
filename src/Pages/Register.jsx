import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = ({ darkMode = false }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    const success = await register(form.name, form.email, form.password);
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
        } tracking-wide`}>Create Account</h2>
        {error && <p className="text-red-600 text-sm text-center mb-6 font-semibold animate-pulse">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text" name="name" placeholder="Full Name"
            className={`w-full px-4 py-3 rounded-xl border placeholder-green-600 text-green-900 focus:outline-none focus:ring-4 transition ${
              darkMode ? 'bg-gray-700 border-green-600 text-white focus:ring-green-500' : 'bg-green-50 border-green-400'
            }`}
            value={form.name} onChange={handleChange} required />
          <input
            type="email" name="email" placeholder="Email Address"
            className={`w-full px-4 py-3 rounded-xl border placeholder-green-600 text-green-900 focus:outline-none focus:ring-4 transition ${
              darkMode ? 'bg-gray-700 border-green-600 text-white focus:ring-green-500' : 'bg-green-50 border-green-400'
            }`}
            value={form.email} onChange={handleChange} required />
          <input
            type="password" name="password" placeholder="Password"
            className={`w-full px-4 py-3 rounded-xl border placeholder-green-600 text-green-900 focus:outline-none focus:ring-4 transition ${
              darkMode ? 'bg-gray-700 border-green-600 text-white focus:ring-green-500' : 'bg-green-50 border-green-400'
            }`}
            value={form.password} onChange={handleChange} required />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-800 active:scale-95 transition-transform duration-150 shadow-lg"
          >
            {submitting ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className={`mt-6 text-center text-sm tracking-wide ${
          darkMode ? 'text-green-300' : 'text-green-900'
        }`}>
          Already have an account? <Link to="/login" className="font-semibold text-green-700 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
