import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to handle authentication redirects
 * @param redirectPath The path to redirect to after login (for admin users)
 * @param redirectPathUser The path to redirect to after login (for regular users)
 */
export const useAuthRedirect = (redirectPath: string = '/admin/vehicle-page', redirectPathUser: string = '/') => {
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      if (isAdmin) {
        console.log('Admin user detected, redirecting to:', redirectPath);
        navigate(redirectPath, { replace: true });
      } else {
        console.log('Regular user detected, redirecting to:', redirectPathUser);
        navigate(redirectPathUser, { replace: true });
      }
    }
  }, [isLoggedIn, isAdmin, navigate, redirectPath, redirectPathUser]);

  return { isLoggedIn, isAdmin };
};
