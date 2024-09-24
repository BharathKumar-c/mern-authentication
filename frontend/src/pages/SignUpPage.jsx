import {motion} from 'framer-motion';
import Input from '../components/Input';
import {useState} from 'react';
import {User, Mail, Lock, Loader} from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import {useAuthStore} from '../store/authStore';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {signup, error, isLoading} = useAuthStore();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, name);
      navigate('/verify-email');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5}}
      className="w-full max-w-md overflow-hidden bg-gray-800 bg-opacity-50 shadow-xl backdrop-filter backdrop-blur-xl rounded-2xl">
      <div className="p-[2.5rem]">
        <h1 className="mb-6 text-2xl font-bold text-center text-transparent bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text">
          Create Account
        </h1>
        <form onSubmit={handleSignup}>
          <Input
            icon={User}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
          />
          <Input
            icon={Mail}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
          />
          <Input
            icon={Lock}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          {error && (
            <p className="text-sm text-red-500 font-semibold mt-2">{error}</p>
          )}

          {/* Password strength meter */}
          <PasswordStrengthMeter password={password} />

          <motion.button
            className="w-full px-4 py-3 mt-5 font-bold text-white transition duration-200 rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 foucs:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            type="submit"
            whileHover={{scale: 1.02}}
            whileTap={{scale: 0.98}}
            disabled={isLoading}>
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              'Sign Up'
            )}
          </motion.button>
        </form>
      </div>
      <div className="flex justify-center px-8 py-4 bg-gray-900 bg-opacity-50">
        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <Link to={'/login'} className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
