import {Toaster} from 'react-hot-toast';
import {useEffect} from 'react';

import {useAuthStore} from './store/authStore';
import LoadingSpinner from './components/LoadingSpinner';
import FloatingShape from './components/FloatingShape';
import RoutesConfig from './Routes';

// Floating shapes component
const FloatingShapes = () => (
  <>
    <FloatingShape
      color="bg-blue-500"
      size="w-64 h-64"
      top="-5%"
      left="10%"
      delay={0}
    />
    <FloatingShape
      color="bg-indigo-500"
      size="w-48 h-48"
      top="70%"
      left="80%"
      delay={5}
    />
    <FloatingShape
      color="bg-teal-500"
      size="w-32 h-32"
      top="40%"
      left="-10%"
      delay={2}
    />
  </>
);

function App() {
  const {isCheckingAuth, checkAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShapes />
      <RoutesConfig />
      <Toaster />
    </div>
  );
}

export default App;
