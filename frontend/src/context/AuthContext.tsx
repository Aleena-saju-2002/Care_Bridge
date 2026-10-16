import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";


interface User {
  _id: string;
  name?: string;
  email?: string;
  dob?: string;
  role: string;
  isVerified?: boolean;
  hospitalName?: string;
  representativeEmail?: string;
  verificationStatus?: "pending" | "approved" | "rejected";
  isBlocked?: boolean;
  [key: string]: unknown;
}


interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored && stored !== "undefined"
        ? (JSON.parse(stored) as AuthUser)
        : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem("token");
    return stored && stored !== "undefined" ? stored : null;
  });

  const login = (userData: AuthUser, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}