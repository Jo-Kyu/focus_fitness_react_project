import { useState, useEffect, createContext } from "react";
import axios from "axios";

export const LoginAuthContext = createContext();

export function LoginAuthProvider({ children }) {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const path = import.meta.env.VITE_API_PATH;

  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState("");
  console.log(isAuth);
  const Login = async (data) => {
    const login = {
      username: data.userLoginEmail,
      password: data.userLoginPassword,
    };

    try {
      // 取得登入api
      const res = await axios.post(`${baseUrl}/v2/admin/signin`, login);
      const { token, expired } = res.data;
      const expireDate = new Date(expired).toUTCString();
      // 將token存入cookie
      document.cookie = `token=${token}; expires=${expireDate}; path=/`;
      // 權限
      authorization();
      // 驗證登入
      checkLogin();
      setToken(token);
      setIsAuth(true);
    } catch (error) {
      console.log(error);
      alert("登入失敗");
    }
  };

  // 驗證權限
  const authorization = () => {
    // 從cookie取得token
    const autoken = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    console.log(autoken);

    // 將tokens放入headers
    if (autoken) {
      axios.defaults.headers.common.Authorization = autoken;
      setToken(token);
      setIsAuth(true);
    } else {
      setToken("");
      setIsAuth(false);
    }
  };

  useEffect(() => {
    authorization();
  }, []);

  // 驗證登入
  const checkLogin = async () => {
    try {
      await axios.post(`${baseUrl}/v2/api/user/check`);
    } catch (error) {
      console.log(error);
    }
  };

  // 登出
  function logout() {
    axios
      .post(`${baseUrl}/v2/logout`)
      .then((res) => {
        console.log("登出成功");
        console.dir(res);
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      })
      .catch((err) => {
        console.dir(err);
      });
  }
  logout();
  // JSX
  return (
    <LoginAuthContext.Provider value={{ isAuth, token, Login }}>
      {children}
    </LoginAuthContext.Provider>
  );
}
