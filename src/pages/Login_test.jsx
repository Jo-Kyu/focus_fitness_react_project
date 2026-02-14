// 外部資源
import { useState, useRef, useEffect } from "react";
import axios from "axios";

import { useForm } from "react-hook-form";

// 內部資源
import logo from "../assets/images/logos/FOCUS-FITNESS-logo-3-long-big.png";

function Login() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const path = import.meta.env.VITE_API_PATH;

  const [isAuth, setIsAuth] = useState(false);

  // 表單提交事件處理函式
  const handleLoginSubmit = async (data) => {
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
      document.cookie = `token=${token}; expires=${expireDate}`;
      // 權限
      authorization();
      // 驗證登入
      checkLogin();
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

    // 將tokens放入headers
    axios.defaults.headers.common["Authorization"] = autoken;
    checkLogin();
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

  // 表單
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  return (
    <>
      <div className="p-5">
        <div className="container text-center bg-white-opacity-20 p-3 rounded-3">
          <div className="row">
            {/*圖片*/}
            <div className="col-6">
              <div className="h-100 d-flex justify-content-center align-items-end login-bg rounded-3">
                {/*logo*/}
                <div className="max-w-182 mb-8">
                  <img src={logo} alt="logo" />
                </div>
              </div>
            </div>
            {/*表單*/}
            <div className="col-6 pt-107 pb-107">
              <div>
                {/*標題*/}
                <div className="text-start mb-7">
                  <h2 className="fs-7 fw-bold mb-3 text-primary-400">
                    / Log in /
                  </h2>
                  <h2 className="fs-2 fw-bold lh-sm">會員登入</h2>
                </div>
                <form onSubmit={handleSubmit(handleLoginSubmit)}>
                  <div className="mb-3 text-start">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                      帳號<span className="text-danger-normal">*</span>
                    </label>
                    <input
                      {...register("userLoginEmail", {
                        required: "電子郵件為必填",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "請輸入正確的電子郵件格式",
                        },
                      })}
                      type="email"
                      className={`form-control ${errors.userLoginEmail && "is-invalid"}`}
                      id="userLoginEmail"
                      aria-describedby="emailHelp"
                      placeholder="請輸入聯絡信箱，例如example@gmail.com"
                    />
                    {errors.userLoginEmail && (
                      <div className="invalid-feedback text-primary-400">
                        {errors?.userLoginEmail?.message}
                      </div>
                    )}
                  </div>
                  <div className="mb-3 text-start">
                    <label
                      htmlFor="exampleInputPassword1"
                      className="form-label"
                    >
                      密碼<span className="text-danger-normal">*</span>
                    </label>
                    <input
                      {...register("userLoginPassword", {
                        required: "密碼為必填",
                      })}
                      type="password"
                      className={`form-control ${errors.userLoginPassword && "is-invalid"}`}
                      id="userLoginPassword"
                      placeholder="請輸入密碼"
                    />
                    {errors.userLoginPassword && (
                      <div className="invalid-feedback text-primary-400">
                        {errors?.userLoginPassword?.message}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary-400 w-100 pt-3 pb-3 fs-7 fw-bold"
                  >
                    登入
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
