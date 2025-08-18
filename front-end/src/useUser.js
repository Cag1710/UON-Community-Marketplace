import { useState, useEffect } from 'react';
import { getAuth, onIdTokenChanged } from 'firebase/auth';

const useUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onIdTokenChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      const tokenResult = await u.getIdTokenResult(true);
      setIsAdmin(!!tokenResult.claims.admin);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return { isLoading, user, isAdmin };
};

export default useUser;