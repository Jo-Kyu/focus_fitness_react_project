// 匯入Hook
import { useState, useEffect, useCallback } from "react";
import { LoginAuthContext } from "../context/LoginAuthContext.js";

// 匯入套件
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

// 匯出元件
export function LoginAuthProvider({ children }) {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const Login = (data) => {
    setLoading(true);
    const login = {
      username: data.userLoginEmail,
      password: data.userLoginPassword,
    };

    return axios
      .post(`${baseUrl}/v2/admin/signin`, login)
      .then((res) => {
        const { token, expired } = res.data;
        const expireDate = new Date(expired).toUTCString();
        // 將 token 存入 cookie
        document.cookie = `token=${token}; expires=${expireDate}; path=/`;
        // 權限
        authorization();
        // 驗證登入
        checkLogin();
        setToken(token);
        setIsAuth(true);
        console.log("login res:", res.data);
        console.log("token:", token);

        console.log(res);
        Swal.fire({
          title: "登入成功 !",
          iconHtml: ` <svg
                    xmlns="http://www.w3.org/2000/svg"
                      width="100"
                      height="100"
                      fill="#e1ff00"
                      className="bi bi-check-square-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
                    </svg>`,
          confirmButtonText: "立即購物！",
          customClass: {
            popup: "handleAddToCartToast",
            confirmButton: "confirmButton-2 ",
          },
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("登入失敗!", {
          className: "handleAddToCartToast",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              fill="#ff514f"
              className="bi bi-x-square-fill"
              viewBox="0 0 16 16"
            >
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708" />
            </svg>
          ),
        });
      })
      .finally(() => setLoading(false));
  };

  // 驗證權限
  const authorization = useCallback(() => {
    const autoken = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1",
    );

    if (autoken) {
      axios.defaults.headers.common.Authorization = autoken;
      setToken(autoken);
      setIsAuth(true);
    } else {
      setToken("");
      setIsAuth(false);
    }
  }, []);

  useEffect(() => {
    authorization();
  }, [authorization]);

  // 驗證登入
  const checkLogin = async () => {
    try {
      await axios.post(`${baseUrl}/v2/api/user/check`);
    } catch (error) {
      console.log(error);
    }
  };

  // 登出
  function Logout() {
    Swal.fire({
      title: "你確定要登出嗎？",
      iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#e1ff00" className="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
    </svg>`,
      showCancelButton: true, // 顯示取消按鈕
      confirmButtonText: "登出！",
      cancelButtonText: "取消！",

      customClass: {
        popup: "handleAddToCartToast",
        confirmButton: "confirmButton",
        cancelButton: "cancelButton",
      },
    }).then((res) => {
      if (res.isConfirmed) {
        setLoading(true);
        axios
          .post(`${baseUrl}/v2/logout`)
          .then((res) => {
            toast.success("登出成功！", {
              className: "handleAddToCartToast",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  fill="#e1ff00"
                  className="bi bi-check-square-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
                </svg>
              ),
            });
            console.log("登出成功");
            console.dir(res);
            document.cookie =
              "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            setToken("");
            setIsAuth(false);
          })
          .catch((err) => {
            console.dir(err);
            console.log("登出失敗");
          })
          .finally(() => setLoading(false));
      }
    });
  }

  // JSX
  return (
    <LoginAuthContext.Provider
      value={{ isAuth, token, Login, Logout, loading }}
    >
      {children}
    </LoginAuthContext.Provider>
  );
}
