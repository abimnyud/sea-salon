"use client";

import { Role, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(
  {} as {
    loading: boolean;
    authenticated?: boolean;
    user?: User;
    mutate: () => Promise<any>;
  }
);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me").then((val) => val.json());

        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const mutate = useCallback(
    async function refetch() {
      try {
        const res = await fetch("/api/me").then((val) => val.json());

        setUser(res.data);

        if (res.data.role === Role.ADMIN) {
          router.push("/admin");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  return (
    <AuthContext.Provider
      value={{
        loading,
        authenticated: !!user,
        user,
        mutate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
