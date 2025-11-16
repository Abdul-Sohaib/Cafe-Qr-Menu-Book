import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface AdminLoginProps {
  onLogin: (token: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${VITE_BACKEND_URL}/auth/login`, { email, password });
      onLogin(response.data.token);
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-2 border-[#552A0A]">
        <div className="flex flex-col">
        <h1 className="text-4xl font-bold font-heading mb-6 text-center">Open House Caffe</h1>
        <h2 className="text-3xl font-bold font-heading mb-6 text-center">Admin Login</h2>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div>
          <div className="mb-4">
            <label className="block text-black mb-2 font-heading font-bold" htmlFor="email">Email</label>
            <div className="flex items-center border border-black bg-transparent text-white rounded-lg p-2">
              <FaEnvelope className="text-black mr-2" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none font-heading text-black bg-transparent"
                placeholder="Enter email"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-black mb-2 font-heading font-bold" htmlFor="password">Password</label>
            <div className="flex items-center border border-black bg-transparent  rounded-lg p-2">
              <FaLock className="text-black mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none font-heading text-black bg-transparent"
                placeholder="Enter password"
              />
               {/* Show/Hide password icon */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="focus:outline-none"
    >
      {showPassword ? (
        <FaEyeSlash className="text-black" />
      ) : (
        <FaEye className="text-black" />
      )}
    </button>
              
            </div>
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-heading text-xl font-bold"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;