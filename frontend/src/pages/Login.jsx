import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const { login, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear field error when typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (validate()) {
      await login(formData.username, formData.password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <h1 className="mt-6 text-center text-4xl font-extrabold text-white mb-2">
            SmartPark Stock Inventory Management System (SIMS)
          </h1>
          <h2 className="text-center text-2xl font-bold text-gray-300 mb-6">
            Sign in to your account
          </h2>
        </div>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              label="Username"
            />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              label="Password"
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
            >
              Sign in
            </Button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-400">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
