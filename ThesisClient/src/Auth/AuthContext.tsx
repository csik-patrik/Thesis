import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

interface JwtPayload {
  sub: string;
  displayname?: string;
  email?: string;
  name?: string;
  role?: string;
  username?: string;
  department?: string;
  costCenter?: string;
  exp?: number;
  [key: string]: any;
}

interface User {
  id: string;
  displayname?: string;
  email?: string;
  name?: string;
  role?: string;
  username?: string;
  department?: string;
  costCenter?: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string) => {
    const decoded = jwtDecode<JwtPayload>(token);

    const userData: User = {
      id: decoded.sub,
      displayname: decoded.displayname,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      username: decoded.username,
      department: decoded.department,
      costCenter: decoded.costCenter,
      token,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // // ✅ On startup, restore user & check token validity
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (!storedUser) return;

  //   const parsedUser = JSON.parse(storedUser);
  //   const decoded = jwtDecode<JwtPayload>(parsedUser.token);

  //   // Check if expired
  //   if (decoded.exp && decoded.exp * 1000 < Date.now()) {
  //     console.warn("Token expired, logging out");
  //     logout();
  //   } else {
  //     setUser(parsedUser);

  //     // Auto-logout when token expires
  //     const msUntilExpiry = decoded.exp ? decoded.exp * 1000 - Date.now() : 0;

  //     if (msUntilExpiry > 0) {
  //       const timeout = setTimeout(() => {
  //         toast.warn("Session expired. Please log in again.");
  //         logout();
  //       }, msUntilExpiry);

  //       // Cleanup on unmount
  //       return () => clearTimeout(timeout);
  //     }
  //   }
  // }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
