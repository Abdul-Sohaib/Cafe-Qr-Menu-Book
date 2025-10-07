/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope } from 'react-icons/fa';

interface AdminLoginProps {
  onLogin: (token: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Attempting login...');
    console.log('Backend URL:', VITE_BACKEND_URL);
    console.log('Email:', email);

    try {
      const response = await axios.post(`${VITE_BACKEND_URL}/auth/login`, { 
        email, 
        password 
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Login successful:', response.data);
      onLogin(response.data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      if (err.response) {
        // Server responded with error
        setError(err.response.data?.message || 'Invalid credentials');
      } else if (err.request) {
        // Request made but no response
        setError('Cannot reach server. Please check if backend is running.');
      } else {
        // Other errors
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-2 border-[#552A0A]">
        <h2 className="text-3xl font-bold font-heading mb-6 text-center">Admin Login</h2>
        {error && <p className="text-red-500 mb-4 text-center font-semibold">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-black mb-2 font-heading font-bold" htmlFor="email">Email</label>
            <div className="flex items-center border border-black bg-transparent text-white rounded-lg p-2">
              <FaEnvelope className="text-black mr-2" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none font-heading text-black"
                placeholder="Enter email"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-black mb-2 font-heading font-bold" htmlFor="password">Password</label>
            <div className="flex items-center border border-black bg-transparent text-white rounded-lg p-2">
              <FaLock className="text-black mr-2" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none font-heading text-black"
                placeholder="Enter password"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-heading text-xl font-bold disabled:bg-blue-300"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {/* Debug info - Remove after fixing */}
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
          <p className="text-gray-600">Backend: {VITE_BACKEND_URL}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;