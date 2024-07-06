import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useLayoutEffect,
  FC,
} from "react";
import axios, { AxiosRequestConfig } from "axios";

axios.defaults.withCredentials = true;

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return authContext;
};

interface AuthProviderProps {
  children: ReactNode;
}

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:1337/api/login", {
        username,
        password,
      });
      console.log(response.data.accessToken);
      setToken(response.data.accessToken);
    } catch (error) {
      setToken(null);
      throw new Error("Login failed");
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1337/api/refreshToken"
      );
      setToken(response.data.accessToken);
    } catch {
      setToken(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token === null) {
      refreshAccessToken();
    } else {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      const response = await axios.get("http://localhost:1337/api/logout");
      if (response.data.status !== "ok") console.log("Logout failed");
    } catch (error) {
      throw new Error("Logout failed");
    }

    setToken(null);
  };

  useLayoutEffect(() => {
    const authInterceptor = axios.interceptors.request.use((config) => {
      const extendedConfig = config as ExtendedAxiosRequestConfig;
      if (!extendedConfig.headers) {
        extendedConfig.headers = {};
      }
      extendedConfig.headers.Authorization =
        !extendedConfig._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;

      return config;
    });

    return () => {
      axios.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        // error object contains config that holds the original request (URL, headers, method, data)
        const originalRequest = error.config as ExtendedAxiosRequestConfig;
        if (
          error.response.status === 403 &&
          error.response.data.message === "unauthorized"
        ) {
          try {
            const response = await axios.get(
              "http://localhost:1337/api/refreshToken"
            );
            setToken(response.data.accessToken);
            if (!originalRequest.headers) {
              originalRequest.headers = {};
            }

            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            originalRequest._retry = true;
            return axios(originalRequest);
          } catch {
            setToken(null);
          }
        }

        return Promise.reject(error);
      }
    );
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
