import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';

export function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
      async function checkAuth() {
        try {
          // Try to access a protected endpoint
          await axios.get('/api/auth/check');
          setAuthenticated(true);
        } catch (error) {
          // Redirect to login if unauthorized
          router.replace('/dashboard/login');
        } finally {
          setLoading(false);
        }
      }
      
      checkAuth();
    }, [router]);

    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading...</p>
        </div>
      );
    }

    if (!authenticated) {
      return null; // Router will redirect, so we don't need to render anything
    }

    return <Component {...props} />;
  };
}