import FloatingShape from './components/FloatingShape';
import {Routes, Route, Navigate} from 'react-router-dom';
import {
  LoginPage,
  SignUpPage,
  EmailVerificationPage,
  Dashboard,
} from './pages/index';
import {Toaster} from 'react-hot-toast';
import {useAuthStore} from './store/authStore';
import {useEffect} from 'react';
import LoadingSpinner from './components/LoadingSpinner';

// protect routes that require authentication
const ProtectedRoute = ({children}) => {
  const {isAuthenticated, user} = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// redirect authendicated user to home page
const RedirectAuthendicatedUser = ({children}) => {
  const {isAuthenticated, user} = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const {checkAuth, isCheckingAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 
    items-center justify-center flex relative overflow-hidden">
      <FloatingShape
        color="bg-green-500"
        size="w-40 h-40"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthendicatedUser>
              <SignUpPage />
            </RedirectAuthendicatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthendicatedUser>
              <LoginPage />
            </RedirectAuthendicatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
