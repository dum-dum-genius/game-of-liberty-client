import { createContext, useCallback, useState, useMemo, useEffect } from 'react';
import { AuthApiService } from '@/api-services/auth-api-service';

type ContextValue = {
  singedIn: boolean;
  goToGoogleOauthPage: () => void;
  signIn: (accessToken: string) => void;
  signOut: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    singedIn: false,
    goToGoogleOauthPage: () => {},
    signIn: () => {},
    signOut: () => {},
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

function Provider({ children }: Props) {
  const [authApiService] = useState<AuthApiService>(() => AuthApiService.new());

  const [singedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      setLoggedIn(true);
    }
  }, []);

  const goToGoogleOauthPage = useCallback(() => {
    authApiService.goToGoogleOauthPage();
  }, []);

  const signIn = useCallback((accessToken: string) => {
    localStorage.setItem('access_token', accessToken);
    setLoggedIn(true);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('access_token');
    setLoggedIn(false);
  }, []);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          singedIn,
          goToGoogleOauthPage,
          signIn,
          signOut,
        }),
        [singedIn, goToGoogleOauthPage, signIn, signOut]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export { Provider as AuthProvider, Context as AuthContext };
