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

interface loginResponse {
  status: "success" | "error";
}

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<loginResponse>;
  logout: () => void;
  loading: boolean;
  name: string | null;
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
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = async (
    user_email: string,
    password: string
  ): Promise<loginResponse> => {
    try {
      const response = await axios.post("http://localhost:1337/api/login", {
        email: user_email,
        password,
      });
      setToken(response.data.accessToken);
      localStorage.setItem("email", user_email);
      return { status: "success" };
    } catch (error) {
      setToken(null);
      localStorage.removeItem("email");
      return { status: "error" };
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

  const get_profile = async (): Promise<void> => {
    try {
      const email = localStorage.getItem("email");
      const response = await axios.get("http://localhost:1337/api/profile", {
        params: { email },
      });
      console.log(response);
      setName(response.data.name);
    } catch (err) {
      console.log(err);
      setName(null);
    }
  };

  useEffect(() => {
    if (name === null && token !== null) {
      console.log("Refreshing name");
      get_profile();
    }
  }, [token]);

  useEffect(() => {
    if (token === null) {
      console.log("refreshing token");
      refreshAccessToken();
    } else {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      const response = await axios.post("http://localhost:1337/api/logout");
      if (response.data.status !== "ok") console.log("Logout failed");
      localStorage.removeItem("email");
    } catch (error) {
      throw new Error("Logout failed");
    }

    setToken(null);
    setName(null);
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
    <AuthContext.Provider value={{ token, login, logout, loading, name }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
