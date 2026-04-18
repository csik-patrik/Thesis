import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

interface JwtPayload {
  sub: string;
  displayname: string;
  email?: string;
  name?: string;
  role?: string | string[];
  username?: string;
  department?: string;
  costCenter?: string;
  exp?: number;
  [key: string]: any;
}

interface User {
  id: string;
  displayname: string;
  email?: string;
  name?: string;
  roles: string[];
  username?: string;
  department?: string;
  costCenter?: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Wrap logout in useCallback to stabilize the function reference
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  // Wrap login in useCallback too
  const login = useCallback((token: string) => {
    const decoded = jwtDecode<JwtPayload>(token);

    const rolesRaw =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
      decoded.role ??
      [];

    const roles = Array.isArray(rolesRaw)
      ? rolesRaw
      : rolesRaw
        ? [rolesRaw]
        : [];

    const userData: User = {
      id: decoded.sub,
      displayname: decoded.displayname,
      email: decoded.email,
      name: decoded.name,
      roles,
      username: decoded.username,
      department: decoded.department,
      costCenter: decoded.costCenter,
      token,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  // Restore user & auto logout on token expiry
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setIsLoading(false); // ✅ Done loading
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      const decoded = jwtDecode<JwtPayload>(parsedUser.token);

      // Check expiration
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.warn("Token expired — logging out");
        logout();
        toast.warning("Your session expired. Please log in again.");
      } else {
        setUser(parsedUser);

        // Auto logout when token expires
        const msUntilExpiry = decoded.exp ? decoded.exp * 1000 - Date.now() : 0;
        if (msUntilExpiry > 0) {
          const timeout = setTimeout(() => {
            toast.warn("Your session expired. Please log in again.");
            logout();
          }, msUntilExpiry);

          setIsLoading(false);
          return () => clearTimeout(timeout);
        }
      }
    } catch (err) {
      console.error("Error restoring user:", err);
      logout();
    }

    setIsLoading(false);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
