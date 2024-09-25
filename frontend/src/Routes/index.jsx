import {Navigate, Route, Routes} from 'react-router-dom';
// Pages
import {
  SignUpPage,
  LoginPage,
  EmailVerificationPage,
  Dashboard,
  ForgotPasswordPage,
  ResetPasswordPage,
} from '../pages';
import {useAuthStore} from '../store/authStore';

// Protected route wrapper
const ProtectedRoute = ({children}) => {
  const {isAuthenticated, user} = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isVerified) return <Navigate to="/verify-email" replace />;

  return <>{children}</>;
};

// Redirect authenticated users
const RedirectAuthenticatedUser = ({children}) => {
  const {isAuthenticated, user} = useAuthStore();

  if (isAuthenticated && user?.isVerified) return <Navigate to="/" replace />;

  return <>{children}</>;
};

const RoutesConfig = () => (
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
        <RedirectAuthenticatedUser>
          <SignUpPage />
        </RedirectAuthenticatedUser>
      }
    />
    <Route
      path="/login"
      element={
        <RedirectAuthenticatedUser>
          <LoginPage />
        </RedirectAuthenticatedUser>
      }
    />
    <Route path="/verify-email" element={<EmailVerificationPage />} />
    <Route
      path="/forgot-password"
      element={
        <RedirectAuthenticatedUser>
          <ForgotPasswordPage />
        </RedirectAuthenticatedUser>
      }
    />
    <Route
      path="/reset-password/:token"
      element={
        <RedirectAuthenticatedUser>
          <ResetPasswordPage />
        </RedirectAuthenticatedUser>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default RoutesConfig;
