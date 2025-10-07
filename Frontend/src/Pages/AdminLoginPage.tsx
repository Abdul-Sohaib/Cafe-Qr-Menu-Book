import { useState } from 'react';
import AdminLogin from '../components/AdminLogin';

const AdminLoginPage: React.FC = () => {
  const [, setToken] = useState('');

  const handleLogin = (token: string) => {
    setToken(token);
    localStorage.setItem('token', token); // Store token in localStorage
  };

  return (
    <div>
      <AdminLogin onLogin={handleLogin} />
    </div>
  );
};

export default AdminLoginPage;