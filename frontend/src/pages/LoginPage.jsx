import {useState} from 'react';
import {motion} from 'framer-motion';
import {Mail, Lock, Loader} from 'lucide-react';
import {Link} from 'react-router-dom';

import Input from '../components/Input';
import {useAuthStore} from '../store/authStore';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {error, login, isLoading} = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Handle login logic here
    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5}}
      className="w-full max-w-md bg-gray-800 bg-opacity-50 rounded-2xl backdrop-filter 
      backdrop-blur-xl shadow-xl overflow-hidden">
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Welcome Back
        </h2>
        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            label="Email"
            type="email"
            value={email}
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            label="Password"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-green-400 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {error && <p className="text-red-500 mb-2 font-semibold">{error}</p>}
          <motion.button
            whileHover={{scale: 1.02}}
            whileTap={{scale: 0.98}}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
            disabled={isLoading}>
            {isLoading ? (
              <Loader className="size-6 animate-spin mx-auto" />
            ) : (
              'Login'
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Do not have an account?{' '}
          <Link to="/signup" className="text-green-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
